// Import Dependencies
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
  Transition
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { forwardRef, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';

// Local Imports
import { Input, InputErrorMsg } from 'components/ui';
import { useFuse, useBoxPosition, useBoxSize, mergeRefs } from 'hooks';
import { Highlight } from '../Highlight';

// ----------------------------------------------------------------------

const CustomCombobox = forwardRef(
  (
    {
      data,
      multiple,
      placeholder,
      label,
      error,
      displayField = 'label',
      searchFields = [],
      highlight,
      inputProps,
      rootProps,
      className,
      classNames,
      showSelectAll = false,
      selectAllLabel = 'Select All',
      onChange,
      ...rest
    },
    ref
  ) => {
    const {
      result: filteredData,
      query,
      setQuery
    } = useFuse(data, {
      keys: searchFields,
      threshold: 0.2,
      matchAllOnEmptyQuery: true
    });
    const boxSizeRef = useRef();

    const { width: inputWidth } = useBoxSize({ ref: boxSizeRef });
    const { left: inputLeft, ref: boxPositionRef } = useBoxPosition();

    return (
      <div className={clsx('flex flex-col', classNames?.root)} {...rootProps}>
        <Combobox
          as="div"
          className={clsx(classNames?.root, className)}
          multiple={multiple}
          ref={ref}
          onChange={onChange}
          {...rest}>
          {({ open, value: selectedValue }) => {
            // Calculate if all filtered items are selected
            const selectedValueSet = new Set(
              Array.isArray(selectedValue)
                ? selectedValue.map((val) => {
                    if (typeof val === 'object' && val !== null) {
                      return val.value ?? val[displayField];
                    }
                    return val;
                  })
                : []
            );

            const allFilteredSelected =
              multiple &&
              filteredData.length > 0 &&
              filteredData.every(({ item }) => {
                const itemValue = item?.value ?? item?.[displayField] ?? item;
                return selectedValueSet.has(itemValue);
              });

            const handleSelectAll = () => {
              if (!multiple || !showSelectAll || !onChange) return;

              if (allFilteredSelected) {
                // Deselect all filtered items
                const filteredValues = filteredData.map(({ item }) => {
                  const itemValue = item?.value ?? item?.[displayField] ?? item;
                  return itemValue;
                });
                const newSelection = Array.isArray(selectedValue)
                  ? selectedValue.filter((val) => {
                      const valValue =
                        typeof val === 'object' && val !== null
                          ? (val.value ?? val[displayField])
                          : val;
                      return !filteredValues.includes(valValue);
                    })
                  : [];
                onChange(newSelection);
              } else {
                // Select all filtered items
                const filteredItems = filteredData.map(({ item }) => item);
                const existingSelection = Array.isArray(selectedValue) ? [...selectedValue] : [];
                const existingValues = new Set(
                  existingSelection.map((val) => {
                    if (typeof val === 'object' && val !== null) {
                      return val.value ?? val[displayField];
                    }
                    return val;
                  })
                );

                const newItems = filteredItems.filter((item) => {
                  const itemValue = item?.value ?? item?.[displayField] ?? item;
                  return !existingValues.has(itemValue);
                });

                onChange([...existingSelection, ...newItems]);
              }
            };

            return (
              <>
                {label && <Label>{label}</Label>}
                <div
                  ref={mergeRefs(boxPositionRef, boxSizeRef)}
                  className={clsx('relative', label && 'mt-1.5')}>
                  {multiple ? (
                    <div>
                      <ComboboxButton
                        as="div"
                        className={clsx(
                          'relative w-full cursor-default overflow-hidden rounded-lg border text-start outline-none transition-colors focus:outline-none',
                          error
                            ? 'border-error dark:border-error-lighter'
                            : 'border-gray-300 focus-within:!border-primary-600 hover:border-gray-400 dark:border-dark-450 dark:focus-within:!border-primary-500 dark:hover:border-dark-400'
                        )}>
                        <div className="flex flex-wrap justify-start gap-2 px-3 py-2 ltr:pr-9 rtl:pl-9">
                          {selectedValue.length > 0 && (
                            <div>{selectedValue.map((val) => val?.[displayField]).join(', ')}</div>
                          )}
                          <ComboboxInput
                            as={Input}
                            classNames={{
                              root: 'flex-1',
                              input:
                                'placeholder:font-light placeholder:text-gray-600 dark:placeholder:text-dark-200'
                            }}
                            unstyled
                            displayValue={(val) => val?.item?.[displayField]}
                            autoComplete="new"
                            placeholder={
                              selectedValue.length === 0 && query === '' ? placeholder : undefined
                            }
                            onChange={(event) => {
                              setQuery(event.target.value);
                            }}
                            value={query}
                            {...inputProps}
                          />
                        </div>

                        <div className="absolute inset-y-0 flex items-center ltr:right-0 ltr:pr-2 rtl:left-0 rtl:pl-2">
                          <ChevronDownIcon
                            className={clsx(
                              'size-5 text-gray-400 transition-transform dark:text-dark-300',
                              open && 'rotate-180'
                            )}
                            aria-hidden="true"
                          />
                        </div>
                      </ComboboxButton>
                      <InputErrorMsg when={error && typeof error !== 'boolean'}>
                        {error}
                      </InputErrorMsg>
                    </div>
                  ) : (
                    <ComboboxButton className="relative w-full cursor-pointer overflow-hidden text-start">
                      <ComboboxInput
                        as={Input}
                        autoComplete="new"
                        error={error}
                        displayValue={(val) => val?.[displayField]}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                        suffix={
                          <ChevronDownIcon
                            className={clsx('size-5 transition-transform', open && 'rotate-180')}
                            aria-hidden="true"
                          />
                        }
                        {...inputProps}
                      />
                    </ComboboxButton>
                  )}

                  <Transition
                    as={Fragment}
                    enter="transition ease-out"
                    enterFrom="opacity-0 translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-2"
                    afterLeave={() => setQuery('')}>
                    <ComboboxOptions
                      anchor={{ to: 'bottom end', gap: 8 }}
                      style={{
                        width: inputWidth,
                        '--left-anchor': `${inputLeft}px`
                      }}
                      className={clsx(
                        'absolute !left-[--left-anchor] z-10 max-h-60 overflow-y-auto overflow-x-hidden rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none',
                        multiple && 'mt-2'
                      )}>
                      {filteredData.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-800 dark:text-dark-100">
                          Nothing found for {query}
                        </div>
                      ) : (
                        <>
                          {multiple && showSelectAll && filteredData.length > 0 && (
                            <div
                              onClick={handleSelectAll}
                              className={clsx(
                                'relative cursor-pointer select-none border-b border-gray-200 px-4 py-2 outline-none transition-colors dark:border-dark-500',
                                allFilteredSelected
                                  ? 'bg-primary-100 font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-dark-600 dark:text-dark-100 dark:hover:bg-dark-500'
                              )}>
                              <span className="block truncate">{selectAllLabel}</span>
                            </div>
                          )}
                          {filteredData.map(({ item, refIndex }) => (
                            <ComboboxOption
                              key={refIndex}
                              className={({ selected, active }) =>
                                clsx(
                                  'relative cursor-pointer select-none px-4 py-2 outline-none transition-colors',
                                  active && !selected && 'bg-gray-100 dark:bg-dark-600',
                                  selected
                                    ? 'bg-primary-600 text-white dark:bg-primary-500'
                                    : 'text-gray-800 dark:text-dark-100'
                                )
                              }
                              value={item}>
                              {({ selected }) => (
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                  }`}>
                                  {highlight ? (
                                    <Highlight query={query}>{item?.[displayField]}</Highlight>
                                  ) : (
                                    item?.[displayField]
                                  )}
                                </span>
                              )}
                            </ComboboxOption>
                          ))}
                        </>
                      )}
                    </ComboboxOptions>
                  </Transition>
                </div>
              </>
            );
          }}
        </Combobox>
      </div>
    );
  }
);

CustomCombobox.displayName = 'Combobox';

CustomCombobox.propTypes = {
  data: PropTypes.array,
  multiple: PropTypes.bool,
  placeholder: PropTypes.node,
  label: PropTypes.node,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  displayField: PropTypes.string,
  searchFields: PropTypes.node,
  highlight: PropTypes.bool,
  inputProps: PropTypes.object,
  rootProps: PropTypes.object,
  classNames: PropTypes.object,
  className: PropTypes.string,
  showSelectAll: PropTypes.bool,
  selectAllLabel: PropTypes.string
};

export { CustomCombobox as Combobox };
