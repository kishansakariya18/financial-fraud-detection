import { forwardRef, Fragment, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
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

import { Input, InputErrorMsg } from 'components/ui';
import { mergeRefs, useBoxPosition, useBoxSize } from 'hooks';

const AsyncCombobox = forwardRef(
  (
    {
      data,
      multiple,
      placeholder,
      label,
      error,
      displayField = 'label',
      valueField = 'value',
      inputProps,
      rootProps,
      className,
      classNames,
      onSearchChange,
      renderSelectedValues,
      loading = false,
      hideSelectedOptions = false,
      ...rest
    },
    ref
  ) => {
    const [query, setQuery] = useState('');

    const boxSizeRef = useRef();
    const { width: inputWidth } = useBoxSize({ ref: boxSizeRef });
    const { left: inputLeft, ref: boxPositionRef } = useBoxPosition();

    const { onChange: inputOnChange, ...restInputProps } = inputProps || {};

    const filterSelected = useMemo(() => {
      if (!multiple || !hideSelectedOptions) return null;
      return (selectedValue) => {
        const set = new Set();
        selectedValue.forEach((selected) => {
          if (selected === null || selected === undefined) return;
          const raw =
            typeof selected === 'object'
              ? (selected?.[valueField] ?? selected?.value ?? selected?.id ?? selected)
              : selected;
          if (raw === null || raw === undefined) return;
          set.add(String(raw));
        });
        return set;
      };
    }, [multiple, hideSelectedOptions, valueField]);

    return (
      <div className={clsx('flex flex-col', classNames?.root)} {...rootProps}>
        <Combobox
          as="div"
          className={clsx(classNames?.root, className)}
          multiple={multiple}
          ref={ref}
          {...rest}>
          {({ open, value: selectedValue }) => {
            const selectedValueSet = filterSelected ? filterSelected(selectedValue) : null;

            const displayOptions =
              multiple && hideSelectedOptions && selectedValueSet
                ? data.filter((item) => {
                    if (item === null || item === undefined) return true;
                    const raw =
                      typeof item === 'object'
                        ? (item?.[valueField] ?? item?.value ?? item?.id ?? item)
                        : item;
                    if (raw === null || raw === undefined) return true;
                    return !selectedValueSet.has(String(raw));
                  })
                : data;

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
                          {selectedValue.length > 0 &&
                            (renderSelectedValues
                              ? renderSelectedValues(selectedValue)
                              : selectedValue.map((val) => val?.[displayField]).join(', '))}
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
                              inputOnChange?.(event);
                              onSearchChange?.(event.target.value);
                            }}
                            value={query}
                            {...restInputProps}
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
                        onChange={(event) => {
                          setQuery(event.target.value);
                          inputOnChange?.(event);
                          onSearchChange?.(event.target.value);
                        }}
                        placeholder={placeholder}
                        suffix={
                          <ChevronDownIcon
                            className={clsx('size-5 transition-transform', open && 'rotate-180')}
                            aria-hidden="true"
                          />
                        }
                        {...restInputProps}
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
                    afterLeave={() => {
                      setQuery('');
                      onSearchChange?.('');
                    }}>
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
                      {loading ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-800 dark:text-dark-100">
                          Loading…
                        </div>
                      ) : displayOptions.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-800 dark:text-dark-100">
                          Nothing found for {query}
                        </div>
                      ) : displayOptions.length === 0 ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-800 dark:text-dark-100">
                          No options available
                        </div>
                      ) : (
                        displayOptions.map((item, index) => (
                          <ComboboxOption
                            key={index}
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
                                {item?.[displayField]}
                              </span>
                            )}
                          </ComboboxOption>
                        ))
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

AsyncCombobox.displayName = 'AsyncCombobox';

AsyncCombobox.propTypes = {
  data: PropTypes.array,
  multiple: PropTypes.bool,
  placeholder: PropTypes.node,
  label: PropTypes.node,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  displayField: PropTypes.string,
  valueField: PropTypes.string,
  inputProps: PropTypes.object,
  rootProps: PropTypes.object,
  classNames: PropTypes.object,
  className: PropTypes.string,
  loading: PropTypes.bool,
  hideSelectedOptions: PropTypes.bool,
  onSearchChange: PropTypes.func,
  renderSelectedValues: PropTypes.func
};

AsyncCombobox.defaultProps = {
  data: [],
  multiple: false,
  placeholder: '',
  label: null,
  error: false,
  displayField: 'label',
  valueField: 'value',
  inputProps: undefined,
  rootProps: undefined,
  classNames: undefined,
  className: undefined,
  loading: false,
  hideSelectedOptions: false,
  onSearchChange: undefined,
  renderSelectedValues: undefined
};

export { AsyncCombobox };
