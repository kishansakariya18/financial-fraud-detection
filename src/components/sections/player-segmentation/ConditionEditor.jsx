import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Button, Input } from 'components/ui';
import { Listbox } from 'components/shared/form/Listbox';
import { Combobox } from 'components/shared/form/Combobox';
import { TagsInputNew } from 'components/shared/form/TagsInputNew';
import AuthService from 'services/auth.services';
import CurrencyService from 'services/currency.services';
import {
  getAttribute,
  getAttributeOptions,
  getOperatorOptions,
  getTimeUnitOptions,
  requiresValue,
  NumericOperator,
  DatetimeOperator,
  EnumStringOperator,
  SegmentAttributeKey,
  ValueInputType
} from './attributeRegistry';

const ConditionEditor = ({ condition, onChange, disabled = false, onRemove, onCopy, error }) => {
  const { t } = useTranslation();
  const [field, setField] = useState(condition.field || '');
  const [operator, setOperator] = useState(condition.operator || '');
  const [value, setValue] = useState(condition.value);
  const [countryOptions, setCountryOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const countriesFetched = useRef(false);
  const currenciesFetched = useRef(false);

  const attributeOptions = getAttributeOptions();
  const operatorOptions = getOperatorOptions(field);
  const selectedAttribute = getAttribute(field);

  // Fetch country/currency options when attribute changes to country or currency
  useEffect(() => {
    const fetchAttributeOptions = async () => {
      if (field === SegmentAttributeKey.COUNTRY && !countriesFetched.current) {
        countriesFetched.current = true;
        await AuthService.getCountries()
          .then(({ response }) => {
            const options = response.data.map((country) => ({
              value: country.CountryID,
              label: country.CountryName
            }));
            setCountryOptions(options);
          })
          .catch(() => {
            countriesFetched.current = false; // Reset on error so it can retry
            setCountryOptions([]);
          });
      }
      if (field === SegmentAttributeKey.CURRENCY && !currenciesFetched.current) {
        currenciesFetched.current = true;
        await CurrencyService.getPlatformCurrancyCodes()
          .then(({ response }) => {
            const options = response.data.map(({ Code, CurrencyID }) => ({
              value: CurrencyID,
              label: Code
            }));
            setCurrencyOptions(options);
          })
          .catch(() => {
            currenciesFetched.current = false; // Reset on error so it can retry
            setCurrencyOptions([]);
          });
      }
    };
    fetchAttributeOptions();
  }, [field]);

  // Reset operator and value when attribute changes
  useEffect(() => {
    if (condition.field !== field) {
      setOperator('');
      setValue(null);
    }
  }, [field, condition.field]);

  // Reset value when operator changes
  useEffect(() => {
    if (condition.operator !== operator) {
      // Set default value based on operator
      if (!requiresValue(operator)) {
        setValue(null);
      } else if (operator === NumericOperator.BETWEEN) {
        setValue([0, 0]);
      } else if (
        operator === DatetimeOperator.LESS_THAN_X_AGO ||
        operator === DatetimeOperator.GREATER_THAN_X_AGO
      ) {
        setValue({ amount: 7, direction: 'Ago', unit: 'days' });
      } else if (operator === DatetimeOperator.BETWEEN_RELATIVE) {
        setValue({
          from: { amount: 7, unit: 'days' },
          to: { amount: 0, unit: 'days' }
        });
      } else if (operator === DatetimeOperator.BETWEEN_DATE_RANGE) {
        setValue(['', '']);
      } else if (operator === EnumStringOperator.IN || operator === EnumStringOperator.NOT_IN) {
        setValue([]);
      } else {
        setValue('');
      }
    }
  }, [operator, condition.operator]);

  // Notify parent of changes
  useEffect(() => {
    onChange({
      ...condition,
      field,
      dataType: selectedAttribute?.dataType,
      operator,
      value
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, selectedAttribute, operator, value]);

  // Render value input based on operator
  const renderValueInput = () => {
    if (!requiresValue(operator)) {
      return null;
    }

    // Helper function to get dynamic options for country/currency
    const getDynamicOptions = () => {
      if (field === SegmentAttributeKey.COUNTRY) return countryOptions;
      if (field === SegmentAttributeKey.CURRENCY) return currencyOptions;
      return null;
    };

    // Helper to render Combobox for country/currency
    const renderDynamicCombobox = (isMultiple = false) => {
      const options = getDynamicOptions();
      if (!options || options.length === 0) return null;

      const attributeLabel = field === SegmentAttributeKey.COUNTRY ? 'country' : 'currency';

      return (
        <Combobox
          data={options}
          value={
            isMultiple
              ? options.filter((opt) => {
                  const valueArray = Array.isArray(value) ? value : [];
                  return valueArray.includes(opt.value);
                })
              : options.find((opt) => opt.value === value) || null
          }
          onChange={(selected) => {
            if (isMultiple) {
              const values = Array.isArray(selected)
                ? selected.map((s) => s.value)
                : selected
                  ? [selected.value]
                  : [];
              setValue(values);
            } else {
              setValue(selected?.value || '');
            }
          }}
          placeholder={`Select ${attributeLabel}${isMultiple ? '(s)' : ''}`}
          displayField="label"
          searchFields={['label', 'value']}
          multiple={isMultiple}
          highlight
        />
      );
    };

    // Numeric operators
    if (
      selectedAttribute?.inputType === ValueInputType.NUMBER &&
      operator === NumericOperator.BETWEEN
    ) {
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={value?.[0] || ''}
            onChange={(e) => setValue([parseFloat(e.target.value) || 0, value?.[1]])}
            error={Boolean(error?.value)}
            classNames={{ root: 'flex-1' }}
          />
          <span className="text-xs text-gray-500 dark:text-dark-300">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={value?.[1] || ''}
            onChange={(e) => setValue([value?.[0], parseFloat(e.target.value) || 0])}
            error={Boolean(error?.value)}
            classNames={{ root: 'flex-1' }}
          />
        </div>
      );
    }

    if (
      [
        NumericOperator.EQUALS,
        NumericOperator.NOT_EQUALS,
        NumericOperator.GREATER_THAN,
        NumericOperator.LESS_THAN
      ].includes(operator) &&
      selectedAttribute?.inputType === ValueInputType.NUMBER
    ) {
      return (
        <Input
          type="number"
          placeholder="Enter value"
          value={value || ''}
          onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
          error={Boolean(error?.value)}
        />
      );
    }

    // Datetime operators - relative
    if (
      operator === DatetimeOperator.LESS_THAN_X_AGO ||
      operator === DatetimeOperator.GREATER_THAN_X_AGO
    ) {
      const timeUnitOptions = getTimeUnitOptions();
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Amount"
            value={value?.amount || ''}
            onChange={(e) =>
              setValue({ ...value, direction: 'Ago', amount: parseInt(e.target.value) || 0 })
            }
            error={Boolean(error?.value)}
            classNames={{ root: 'w-20' }}
          />
          <Listbox
            data={timeUnitOptions}
            value={timeUnitOptions.find((opt) => opt.value === value?.unit) || null}
            onChange={(opt) => setValue({ ...value, unit: opt.value })}
            placeholder="Unit"
            displayField="label"
            classNames={{ root: 'flex-1' }}
          />
          <span className="text-xs text-gray-500 dark:text-dark-300">ago</span>
        </div>
      );
    }

    if (operator === DatetimeOperator.BETWEEN_RELATIVE) {
      const timeUnitOptions = getTimeUnitOptions();
      return (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-10 text-xs text-gray-600 dark:text-dark-300">From:</span>
            <Input
              type="number"
              placeholder="Value"
              value={value?.from?.amount || ''}
              onChange={(e) =>
                setValue({
                  ...value,
                  from: { ...value?.from, amount: parseInt(e.target.value) || 0 }
                })
              }
              error={Boolean(error?.value)}
              classNames={{ root: 'w-16' }}
            />
            <Listbox
              data={timeUnitOptions}
              value={timeUnitOptions.find((opt) => opt.value === value?.from?.unit) || null}
              onChange={(opt) =>
                setValue({
                  ...value,
                  from: { ...value?.from, unit: opt.value }
                })
              }
              placeholder="Unit"
              displayField="label"
              classNames={{ root: 'flex-1' }}
            />
            <span className="text-xs text-gray-500 dark:text-dark-300">ago</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-10 text-xs text-gray-600 dark:text-dark-300">To:</span>
            <Input
              type="number"
              placeholder="Amt"
              value={value?.to?.amount || ''}
              onChange={(e) =>
                setValue({
                  ...value,
                  to: { ...value?.to, amount: parseInt(e.target.value) || 0 }
                })
              }
              error={Boolean(error?.value)}
              classNames={{ root: 'w-16' }}
            />
            <Listbox
              data={timeUnitOptions}
              value={timeUnitOptions.find((opt) => opt.value === value?.to?.unit) || null}
              onChange={(opt) =>
                setValue({
                  ...value,
                  to: { ...value?.to, unit: opt.value }
                })
              }
              placeholder="Unit"
              displayField="label"
              classNames={{ root: 'flex-1' }}
            />
            <span className="text-xs text-gray-500 dark:text-dark-300">ago</span>
          </div>
        </div>
      );
    }

    // Datetime operators - absolute date range
    if (
      selectedAttribute?.inputType === ValueInputType.DATETIME &&
      operator === DatetimeOperator.BETWEEN_DATE_RANGE
    ) {
      return (
        <div className="flex items-center gap-2">
          <Input
            type="datetime-local"
            value={value?.[0] || ''}
            onChange={(e) => setValue([e.target.value, value?.[1] || ''])}
            error={Boolean(error?.value)}
            classNames={{ root: 'flex-1' }}
          />
          <span className="text-xs text-gray-500 dark:text-dark-300">to</span>
          <Input
            type="datetime-local"
            value={value?.[1] || ''}
            onChange={(e) => setValue([value?.[0] || '', e.target.value])}
            error={Boolean(error?.value)}
            classNames={{ root: 'flex-1' }}
          />
        </div>
      );
    }

    // Enum operators - IN/NOT_IN (Multiple select)
    if (operator === EnumStringOperator.IN || operator === EnumStringOperator.NOT_IN) {
      // Check for dynamic options (country/currency)
      if (selectedAttribute?.inputType === ValueInputType.AUTOCOMPLETE) {
        const dynamicCombobox = renderDynamicCombobox(true);
        if (dynamicCombobox) return dynamicCombobox;
      }
      // For attributes with predefined options
      if (selectedAttribute?.options) {
        return (
          <Listbox
            data={selectedAttribute.options}
            value={selectedAttribute.options.filter((opt) => value?.includes(opt.value))}
            onChange={(selected) => {
              const values = Array.isArray(selected)
                ? selected.map((s) => s.value)
                : [selected.value];
              setValue(values);
            }}
            placeholder="Select values"
            displayField="label"
            multiple
          />
        );
      }

      // For string attributes without predefined options, use tag input
      return (
        <TagsInputNew
          value={
            Array.isArray(value) ? value.map((v, idx) => ({ id: `tag-${idx}-${v}`, value: v })) : []
          }
          onChange={(tags) => {
            const values = tags.map((tag) => tag.value);
            setValue(values);
          }}
          placeholder="Enter values..."
          allowCustom
          error={error?.value}
        />
      );
    }

    // String operators - EQUALS/NOT_EQUALS (Single select)

    if ([EnumStringOperator.EQUALS, EnumStringOperator.NOT_EQUALS].includes(operator)) {
      if (selectedAttribute?.inputType === ValueInputType.AUTOCOMPLETE) {
        const dynamicCombobox = renderDynamicCombobox(false);
        if (dynamicCombobox) return dynamicCombobox;
      }

      // For attributes with predefined options
      if (selectedAttribute?.options) {
        return (
          <Listbox
            data={selectedAttribute.options}
            value={selectedAttribute.options.find((opt) => opt.value === value) || null}
            onChange={(opt) => setValue(opt.value)}
            placeholder="Select value"
            displayField="label"
          />
        );
      }

      return (
        <Input
          type="text"
          placeholder="Enter value"
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          error={Boolean(error?.value)}
        />
      );
    }

    // Enum with options
    if (selectedAttribute?.inputType === ValueInputType.ENUM && selectedAttribute?.options) {
      return (
        <Listbox
          data={selectedAttribute.options}
          value={selectedAttribute.options.find((opt) => opt.value === value) || null}
          onChange={(opt) => setValue(opt.value)}
          placeholder="Select value"
          displayField="label"
        />
      );
    }

    // Default fallback
    return (
      <Input
        type="text"
        placeholder="Enter value"
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        error={Boolean(error?.value)}
      />
    );
  };

  return (
    <div className="group relative pr-20">
      {/* Main horizontal layout */}
      <div className="flex items-start gap-2">
        {/* Attribute Selector */}
        <div className="w-[220px] flex-shrink-0">
          <Listbox
            data={attributeOptions}
            value={attributeOptions.find((opt) => opt.value === field) || null}
            onChange={(opt) => setField(opt.value)}
            placeholder={t('attribute')}
            displayField="label"
            error={error?.field || (error?.field === 'field' && error?.message)}
          />
        </div>
        {/* Operator Selector */}
        <div className="w-[240px] flex-shrink-0">
          <Listbox
            data={operatorOptions}
            value={operatorOptions.find((opt) => opt.value === operator) || null}
            onChange={(opt) => setOperator(opt.value)}
            placeholder={t('operator')}
            displayField="label"
            disabled={!field}
            error={error?.operator || (error?.field === 'operator' && error?.message)}
          />
        </div>
        {/* Value Input */}
        <div className="min-w-0 flex-1">{renderValueInput()}</div>
      </div>

      {/* Hover-only action buttons */}
      <div className="absolute right-0 top-0 hidden gap-1 group-hover:flex">
        {onCopy && (
          <Button
            color="success"
            variant="flat"
            isIcon
            type="button"
            onClick={onCopy}
            className="size-9">
            <DocumentDuplicateIcon className="size-4" />
          </Button>
        )}
        <Button
          color="error"
          isIcon
          variant="flat"
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="size-9">
          <TrashIcon className="size-4" />
        </Button>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="mt-1">
          {typeof error === 'string' ? (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          ) : error.message && !error.field ? (
            <p className="text-xs text-red-600 dark:text-red-400">{error.message}</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ConditionEditor;
