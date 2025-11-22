import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
  Transition
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { forwardRef, Fragment, useMemo, useRef, useState } from 'react';

import { Button, Input, InputErrorMsg, Tag } from 'components/ui';
import { randomId } from 'utils/randomId';
import { XMarkIcon } from '@heroicons/react/24/outline';

const TagsInputNew = forwardRef(
  (
    {
      onChange,
      value: initialValue = [],
      options = [],
      placeholder = 'Enter tags...',
      error,
      label,
      allowCustom = true,
      ...rest
    },
    ref
  ) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    // Normalize options to { id, value }
    const normalizedOptions = useMemo(
      () => (options || []).map((opt) => (typeof opt === 'string' ? { id: opt, value: opt } : opt)),
      [options]
    );

    const value = useMemo(
      () =>
        [...(initialValue || [])]?.map((v) => {
          if (typeof v === 'string') {
            return { id: v, value: v };
          }
          return v;
        }) || [],
      [initialValue]
    );

    const selectedValuesLower = useMemo(() => new Set(value.map((v) => v.value ?? '')), [value]);

    // Filter options by query & exclude already selected
    const filteredOptions = useMemo(() => {
      const q = query.trim().toLowerCase();
      return normalizedOptions.filter((opt) => {
        const val = opt.value?.toLowerCase?.() ?? '';
        if (selectedValuesLower.has(val)) return false;
        if (!q) return true; // show all suggestions when dropdown opened and no query
        return val.includes(q);
      });
    }, [normalizedOptions, query, selectedValuesLower]);

    const handleAddTag = (tag) => {
      if (!tag?.value) return;
      const exists = value.some((item) => item.value === tag.value);
      if (exists) {
        setQuery('');
        return;
      }

      const next = [
        ...value,
        {
          id: tag.id || randomId(),
          value: tag.value
        }
      ];

      onChange?.(next);
      setQuery('');
    };

    const handleRemoveTagById = (id) => {
      onChange?.(value.filter((item) => item.id !== id));
    };

    // const handleKeyDown = (event) => {
    //   // Backspace: remove last tag when input empty
    //   if (event.key === 'Backspace' && event.currentTarget.value === '' && value.length > 0) {
    //     onChange?.(value.slice(0, -1));
    //   }

    //   // Enter: create custom tag if allowed & dropdown not used
    //   if (event.key === 'Enter') {
    //     event.preventDefault();
    //     const q = query.trim();
    //     if (!q || !allowCustom) return;

    //     handleAddTag({ value: q });
    //   }
    // };

    // Check if current query already exists in suggestions
    const queryAlreadyInOptions = useMemo(() => {
      const q = query.trim();
      if (!q) return false;
      return normalizedOptions.some((opt) => opt.value === q) || value.some((v) => v.value === q);
    }, [normalizedOptions, value, query]);

    // const onChangeList = (list) => {
    //   if (!Array.isArray(list) || list.length === 0) return; // ✅ safety

    //   const last = list[list.length - 1];

    //   if (!last?.value) return; // skip empty
    //   onChange?.(list);
    //   setQuery('');
    // };

    return (
      <Combobox
        as="div"
        className="flex flex-col"
        value={null} // important: we treat Combobox as "picker", not as selected tags state
        onChange={handleAddTag}
        ref={ref}
        {...rest}>
        {({ open }) => (
          <>
            {label && <Label>{label}</Label>}
            <div className="relative">
              <div className="relative w-full">
                <div
                  className={clsx(
                    'flex cursor-text flex-wrap items-center gap-1 rounded-lg border px-3 py-2',
                    error
                      ? 'border-error dark:border-error-lighter'
                      : 'border-gray-300 focus-within:border-primary-600 hover:border-gray-400 dark:border-dark-450 dark:focus-within:border-primary-500 dark:hover:border-dark-400'
                  )}
                  onClick={() => {
                    // focus the actual input when clicking anywhere in the container
                    inputRef.current?.focus();
                  }}>
                  {value.map((tag) => (
                    <Tag key={tag.id} component="button" type="button">
                      <span className="border-r border-gray-300 pr-1 leading-none text-gray-600 dark:text-dark-200">
                        {tag.value}
                      </span>
                      <Button
                        type="button"
                        isIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleRemoveTagById(tag.id);
                          inputRef.current?.focus();
                        }}
                        className="ml-1">
                        <XMarkIcon className="h-3 w-3" />
                      </Button>
                    </Tag>
                  ))}

                  <ComboboxInput
                    placeholder={placeholder}
                    as={Input}
                    ref={inputRef}
                    unstyled
                    classNames={{ root: 'min-w-[60px] flex-1' }}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && e.target.value === '' && value.length > 0) {
                        e.preventDefault();
                        handleRemoveTagById(value[value.length - 1].id);
                      }
                    }}
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                  />

                  <div className="flex items-center ltr:ml-2 rtl:mr-2">
                    <ChevronDownIcon
                      className={clsx(
                        'h-5 w-5 text-gray-400 dark:text-dark-300',
                        open && 'rotate-180'
                      )}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              <Transition
                as={Fragment}
                show={open || !!query}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2">
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none">
                  {/* Existing options */}
                  {filteredOptions.map((opt) => (
                    <ComboboxOption
                      key={opt.id}
                      value={opt}
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none px-4 py-2 text-sm outline-none transition-colors',
                          active
                            ? 'bg-gray-100 dark:bg-dark-600'
                            : 'text-gray-800 dark:text-dark-100'
                        )
                      }>
                      {opt.value}
                    </ComboboxOption>
                  ))}

                  {/* "Create new" option when no exact match & custom allowed */}
                  {allowCustom && query.trim() && !queryAlreadyInOptions && (
                    <ComboboxOption
                      value={{ value: query.trim() }}
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none px-4 py-2 text-sm outline-none transition-colors',
                          active
                            ? 'bg-primary-600 text-white dark:bg-primary-500'
                            : 'text-gray-800 dark:text-dark-100'
                        )
                      }>
                      Add “{query.trim()}”
                    </ComboboxOption>
                  )}

                  {!filteredOptions.length && (!allowCustom || queryAlreadyInOptions) && (
                    <div className="px-4 py-2 text-sm text-gray-400 dark:text-dark-300">
                      No results
                    </div>
                  )}
                </ComboboxOptions>
              </Transition>
            </div>
            <InputErrorMsg {...error}>{error}</InputErrorMsg>
          </>
        )}
      </Combobox>
    );
  }
);
TagsInputNew.displayName = 'TagsInputNew';
export { TagsInputNew };
