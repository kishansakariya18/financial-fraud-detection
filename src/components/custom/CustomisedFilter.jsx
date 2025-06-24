import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { Badge, Button, Checkbox, Input } from 'components/ui';
import { useFuse } from 'hooks';
import { ResponsiveFilter } from '../shared/table/ResponsiveFilter';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';

export function CustomisedFilter({
  title,
  options,
  selectedValues,
  setSelectedValues,
  labelField = 'label',
  valueField = 'value',
  Icon,
  renderPrefix,
  showCheckbox = true
}) {
  const selectedItems = options?.filter((o) => selectedValues.includes(o[valueField]));

  return (
    <ResponsiveFilter
      buttonContent={
        <>
          {Icon && <Icon className="size-4" />}
          <span>{title}</span>

          {selectedItems?.length > 0 && (
            <>
              <div className="h-full w-px bg-gray-300 dark:bg-dark-450" />
              <Badge className="lg:hidden">{selectedItems.length}</Badge>

              {selectedItems.length > 2 ? (
                <Badge className="max-lg:hidden">{selectedItems.length} selected</Badge>
              ) : (
                <div className="hidden gap-1 lg:flex">
                  {selectedItems.map((val) => (
                    <Badge key={val[valueField]} className="gap-1">
                      {val.icon && <val.icon className="size-4 stroke-1" />}
                      <span>{val[labelField]}</span>
                    </Badge>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      }>
      <ControlledComboboxFilter
        {...{
          title,
          options,
          selectedValues,
          setSelectedValues,
          labelField,
          valueField,
          renderPrefix,
          showCheckbox
        }}
      />
    </ResponsiveFilter>
  );
}

function ControlledComboboxFilter({
  title,
  options,
  selectedValues,
  setSelectedValues,
  labelField,
  valueField,
  renderPrefix,
  showCheckbox
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

  useEffect(() => {
    smAndUp && inputRef.current?.focus();
  }, [smAndUp]);

  const selectedItems = options.filter((o) => selectedValues.includes(o[valueField]));

  return (
    <Combobox
      value={selectedItems}
      onChange={(list) => {
        setSelectedValues(list.map((item) => item[valueField]));
      }}
      multiple
      className="h-[366px] sm:h-auto sm:max-h-80 sm:w-56">
      <div className="relative flex flex-col">
        <div className="relative bg-gray-100 py-1 dark:bg-dark-900">
          <ComboboxInput
            as={Input}
            className="border-none"
            ref={inputRef}
            autoComplete="new"
            placeholder={title}
            displayValue={({ name }) => name}
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
                    {/* Optional: remove this if facet counts are not needed */}
                    {/* <span className="font-mono text-xs">{facetCount[item[valueField]]}</span> */}
                  </div>
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>

        {selectedValues?.length > 0 && (
          <Button onClick={() => setSelectedValues([])} className="w-full shrink-0 rounded-none">
            Clear Filter
          </Button>
        )}
      </div>
    </Combobox>
  );
}

CustomisedFilter.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedValues: PropTypes.array.isRequired,
  setSelectedValues: PropTypes.func.isRequired,
  labelField: PropTypes.string,
  valueField: PropTypes.string,
  Icon: PropTypes.elementType,
  renderPrefix: PropTypes.func,
  showCheckbox: PropTypes.bool
};

ControlledComboboxFilter.propTypes = CustomisedFilter.propTypes;
