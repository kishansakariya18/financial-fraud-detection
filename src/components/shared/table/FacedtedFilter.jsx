// Import Dependencies
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { Badge, Button, Checkbox, Input } from 'components/ui';
import { useFuse } from 'hooks';
import { ResponsiveFilter } from './ResponsiveFilter';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export function FacedtedFilter({
  column,
  title,
  options,
  labelField = 'label',
  valueField = 'value',
  Icon,
  renderPrefix,
  showCheckbox = true,
  isMultiple = true
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => column?.setFilterValue(undefined), []);

  const selectedValues = column?.getFilterValue();

  const normalizedSelectedValues = isMultiple
    ? Array.isArray(selectedValues)
      ? selectedValues
      : []
    : selectedValues;

  const selectedItems = options?.filter((o) =>
    isMultiple
      ? normalizedSelectedValues.includes(o[valueField])
      : o[valueField] === normalizedSelectedValues
  );

  const { t } = useTranslation();

  const handleRemoveValue = (event, value) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (isMultiple) {
      const nextValues = normalizedSelectedValues.filter((item) => item !== value);
      column?.setFilterValue(nextValues.length > 0 ? nextValues : undefined);
    } else {
      column?.setFilterValue(undefined);
    }
  };

  const renderSelectedBadge = (item) => (
    <Badge key={String(item[valueField])} className="text-xxs flex items-center gap-1">
      {item.icon && <item.icon className="size-4 stroke-1" />}
      <span className="truncate">{item[labelField]}</span>
      <button
        type="button"
        onClick={(event) => handleRemoveValue(event, item[valueField])}
        className="grid size-4 place-content-center rounded-full bg-black/10 text-gray-700 transition hover:bg-black/20 dark:bg-white/10 dark:text-dark-50 dark:hover:bg-white/20">
        <XMarkIcon className="size-3" />
      </button>
    </Badge>
  );

  return (
    <ResponsiveFilter
      buttonContent={
        <>
          {Icon && <Icon className="size-4" />}

          <span>{title}</span>

          {selectedItems?.length > 0 && (
            <>
              <div className="h-full w-px bg-gray-300 dark:bg-dark-450" />

              {selectedItems.length > 2 ? (
                <Badge className="text-xxs flex items-center gap-1">
                  <span className="truncate">
                    {selectedItems.length} {t('selected')}
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      column?.setFilterValue(undefined);
                    }}
                    className="grid size-4 place-content-center rounded-full bg-black/10 text-gray-700 transition hover:bg-black/20 dark:bg-white/10 dark:text-dark-50 dark:hover:bg-white/20">
                    <XMarkIcon className="size-3" />
                  </button>
                </Badge>
              ) : (
                <div className="flex flex-wrap items-center gap-1">
                  {selectedItems.map((val) => renderSelectedBadge(val))}
                </div>
              )}
            </>
          )}
        </>
      }>
      <ComboboxFilter
        {...{
          column,
          title,
          options,
          labelField,
          valueField,
          renderPrefix,
          showCheckbox,
          isMultiple
        }}
      />
    </ResponsiveFilter>
  );
}

function ComboboxFilter({
  column,
  title,
  options,
  labelField,
  valueField,
  renderPrefix,
  showCheckbox,
  isMultiple = true
}) {
  const inputRef = useRef();
  const {
    result: filteredItems,
    query,
    setQuery
  } = useFuse(options, {
    keys: [labelField],
    threshold: 0.2,
    matchAllOnEmptyQuery: true
  });

  const { smAndUp } = useBreakpointsContext();
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = column?.getFilterValue();
  const normalizedSelectedValues = isMultiple
    ? Array.isArray(selectedValues)
      ? selectedValues
      : []
    : selectedValues;

  const comboboxValue = isMultiple
    ? options?.filter((o) => normalizedSelectedValues.includes(o[valueField]))
    : (options?.find((o) => o[valueField] === normalizedSelectedValues) ?? null);

  useEffect(() => {
    smAndUp && inputRef.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Combobox
      value={comboboxValue}
      onChange={(list) => {
        if (isMultiple) {
          column?.setFilterValue(list.map((item) => item[valueField]));
        } else {
          column?.setFilterValue(list ? list[valueField] : undefined);
        }
      }}
      multiple={isMultiple}
      className="h-[366px] sm:h-auto sm:max-h-80 sm:w-56">
      <div className="relative flex flex-col">
        <div className="relative bg-gray-100 py-1 dark:bg-dark-900">
          <ComboboxInput
            as={Input}
            className="border-none"
            ref={inputRef}
            autoComplete="new"
            placeholder={title}
            displayValue={(item) => (item ? item[labelField] : '')}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<MagnifyingGlassIcon className="size-4" />}
          />
        </div>

        <ComboboxOptions static className="h-auto w-full overflow-y-auto py-1 outline-none">
          {filteredItems.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none px-2.5 py-2 text-gray-800 dark:text-dark-100">
              Nothing found for {query}
            </div>
          ) : (
            filteredItems.map(({ item, refIndex }) => (
              <ComboboxOption
                key={refIndex}
                className={({ focus }) =>
                  clsx(
                    'relative cursor-pointer select-none px-2.5 py-2 text-gray-800 outline-none transition-colors dark:text-dark-100',
                    focus && 'bg-gray-100 dark:bg-dark-600'
                  )
                }
                value={item}>
                {({ selected }) => (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      {showCheckbox && <Checkbox checked={selected} readOnly />}
                      {item.icon && <item.icon className="size-4.5 stroke-1" />}
                      {renderPrefix && renderPrefix(item, selected)}
                      <span className="block truncate text-xs+">{item[labelField]}</span>
                    </div>
                    <span className="font-mono text-xs">{facets?.get(item[valueField])}</span>
                  </div>
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
        {(isMultiple ? normalizedSelectedValues.length > 0 : comboboxValue !== null) && (
          <Button
            onClick={() => column?.setFilterValue(undefined)}
            className="w-full shrink-0 rounded-none">
            Clear Filter
          </Button>
        )}
      </div>
    </Combobox>
  );
}

FacedtedFilter.propTypes = {
  column: PropTypes.object,
  title: PropTypes.string,
  labelField: PropTypes.string,
  valueField: PropTypes.string,
  options: PropTypes.array,
  Icon: PropTypes.elementType,
  renderPrefix: PropTypes.func,
  showCheckbox: PropTypes.bool
};

ComboboxFilter.propTypes = {
  column: PropTypes.object,
  title: PropTypes.string,
  labelField: PropTypes.string,
  valueField: PropTypes.string,
  options: PropTypes.array,
  renderPrefix: PropTypes.func,
  showCheckbox: PropTypes.bool
};
