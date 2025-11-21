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
  SegmentAttributeKey
} from './attributeRegistry';

const ConditionEditor = ({ condition, onChange, disabled, onRemove, onCopy, error }) => {
  const { t } = useTranslation();
  const [attributeKey, setAttributeKey] = useState(condition.attributeKey || '');
  const [operator, setOperator] = useState(condition.operator || '');
  const [value, setValue] = useState(condition.value);
  const [countryOptions, setCountryOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const countriesFetched = useRef(false);
  const currenciesFetched = useRef(false);

  const attributeOptions = getAttributeOptions();
  const operatorOptions = getOperatorOptions(attributeKey);
  const selectedAttribute = getAttribute(attributeKey);

  // Fetch country/currency options when attribute changes to country or currency
  useEffect(() => {
    const fetchAttributeOptions = async () => {
      if (attributeKey === SegmentAttributeKey.COUNTRY && !countriesFetched.current) {
        countriesFetched.current = true;
        await AuthService.getCountries()
          .then(({ response }) => {
            const options = response.data.map((country) => ({
              value: country.CountryCode,
              label: country.CountryCode
            }));
            setCountryOptions(options);
          })
          .catch(() => {
            countriesFetched.current = false; // Reset on error so it can retry
            setCountryOptions([]);
          });
      }
      if (attributeKey === SegmentAttributeKey.CURRENCY && !currenciesFetched.current) {
        currenciesFetched.current = true;
        await CurrencyService.getPlatformCurrancyCodes()
          .then(({ response }) => {
            const options = response.data.map(({ Code }) => ({
              value: Code,
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
  }, [attributeKey]);

  // Reset operator and value when attribute changes
  useEffect(() => {
    if (condition.attributeKey !== attributeKey) {
      setOperator('');
      setValue(null);
    }
  }, [attributeKey, condition.attributeKey]);

  // Reset value when operator changes
  useEffect(() => {
    if (condition.operator !== operator) {
      // Set default value based on operator
      if (!requiresValue(operator)) {
        setValue(null);
      } else if (operator === NumericOperator.BETWEEN) {
        setValue({ min: 0, max: 100 });
      } else if (
        operator === DatetimeOperator.LESS_THAN_X_AGO ||
        operator === DatetimeOperator.GREATER_THAN_X_AGO
      ) {
        setValue({ amount: 7, unit: 'days' });
      } else if (operator === DatetimeOperator.BETWEEN_RELATIVE) {
        setValue({
          from: { amount: 7, unit: 'days' },
          to: { amount: 0, unit: 'days' }
        });
      } else if (operator === DatetimeOperator.BETWEEN_DATE_RANGE) {
        setValue({ from: '', to: '' });
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
      attributeKey,
      operator,
      value
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributeKey, operator, value]);

  // Render value input based on operator
  const renderValueInput = () => {
    if (!requiresValue(operator)) {
      return null;
    }

    // Helper function to get dynamic options for country/currency
    const getDynamicOptions = () => {
      if (attributeKey === SegmentAttributeKey.COUNTRY) return countryOptions;
      if (attributeKey === SegmentAttributeKey.CURRENCY) return currencyOptions;
      return null;
    };

    // Helper to render Combobox for country/currency
    const renderDynamicCombobox = (isMultiple = false) => {
      const options = getDynamicOptions();
      if (!options || options.length === 0) return null;

      const attributeLabel = attributeKey === SegmentAttributeKey.COUNTRY ? 'country' : 'currency';

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
    if (operator === NumericOperator.BETWEEN) {
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={value?.min || ''}
            onChange={(e) => setValue({ ...value, min: parseFloat(e.target.value) || 0 })}
            error={Boolean(error?.value)}
            classNames={{ root: 'flex-1' }}
          />
          <span className="text-xs text-gray-500 dark:text-dark-300">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={value?.max || ''}
            onChange={(e) => setValue({ ...value, max: parseFloat(e.target.value) || 0 })}
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
      selectedAttribute?.dataType === 'numeric'
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
            onChange={(e) => setValue({ ...value, amount: parseInt(e.target.value) || 0 })}
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
    if (operator === DatetimeOperator.BETWEEN_DATE_RANGE) {
      return (
        <div className="flex items-center gap-2">
          <Input
            type="datetime-local"
            value={value?.from || ''}
            onChange={(e) => setValue({ ...value, from: e.target.value })}
            error={Boolean(error?.value)}
            classNames={{ root: 'flex-1' }}
          />
          <span className="text-xs text-gray-500 dark:text-dark-300">to</span>
          <Input
            type="datetime-local"
            value={value?.to || ''}
            onChange={(e) => setValue({ ...value, to: e.target.value })}
            error={Boolean(error?.value)}
            classNames={{ root: 'flex-1' }}
          />
        </div>
      );
    }

    // Enum operators - IN/NOT_IN (Multiple select)
    if (operator === EnumStringOperator.IN || operator === EnumStringOperator.NOT_IN) {
      // Check for dynamic options (country/currency)
      const dynamicCombobox = renderDynamicCombobox(true);
      if (dynamicCombobox) return dynamicCombobox;

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
    if (
      [EnumStringOperator.EQUALS, EnumStringOperator.NOT_EQUALS].includes(operator) &&
      selectedAttribute?.dataType === 'string'
    ) {
      // Check for dynamic options (country/currency)
      const dynamicCombobox = renderDynamicCombobox(false);
      if (dynamicCombobox) return dynamicCombobox;

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
    if (selectedAttribute?.dataType === 'enum' && selectedAttribute?.options) {
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
            value={attributeOptions.find((opt) => opt.value === attributeKey) || null}
            onChange={(opt) => setAttributeKey(opt.value)}
            placeholder={t('attribute')}
            displayField="label"
            error={error?.attributeKey || (error?.field === 'attributeKey' && error?.message)}
          />
        </div>

        {/* Operator Selector */}
        <div className="w-[180px] flex-shrink-0">
          <Listbox
            data={operatorOptions}
            value={operatorOptions.find((opt) => opt.value === operator) || null}
            onChange={(opt) => setOperator(opt.value)}
            placeholder={t('operator')}
            displayField="label"
            disabled={!attributeKey}
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
