import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { AsyncCombobox } from 'components/shared/form/AsyncCombobox';
import PlayerService from 'services/users.services';

const SEARCH_DEBOUNCE = 300;

const dedupeOptions = (options) => {
  const map = new Map();
  options.forEach((option) => {
    if (!option || option.value === undefined || option.value === null) return;
    const key = String(option.value);
    if (!map.has(key)) {
      map.set(key, {
        value: key,
        label: option.label ?? key
      });
    }
  });
  return Array.from(map.values());
};

const ReferrerSelectComponent = ({
  multiple = false,
  value,
  onChange,
  placeholder = 'Search referrer players...',
  error,
  onOptionsCache,
  initialOptions = [] // Pre-loaded player options (for edit mode)
}) => {
  const [options, setOptions] = useState(initialOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debounceRef = useRef();

  // Merge initial options with current options on mount
  useEffect(() => {
    if (initialOptions && initialOptions.length > 0) {
      setOptions((prev) => {
        const merged = dedupeOptions([...initialOptions, ...prev]);
        return merged;
      });
    }
  }, [initialOptions]);

  const normalizeSelection = useCallback((item) => {
    if (item === null || item === undefined) return null;
    if (typeof item === 'string' || typeof item === 'number') {
      const valueString = String(item);
      return { value: valueString, label: valueString };
    }
    if (typeof item === 'object') {
      const rawValue =
        item.value ?? item.id ?? item.UserID ?? item.userId ?? item.valueOf?.() ?? null;
      if (rawValue === null || rawValue === undefined) return null;
      const valueString = String(rawValue);
      const rawLabel = item.label ?? item.name ?? item.Username ?? item.username ?? rawValue;
      return { value: valueString, label: String(rawLabel) };
    }
    return null;
  }, []);

  const baseSelected = useMemo(() => {
    if (multiple) {
      if (!Array.isArray(value)) return [];
      const seen = new Set();
      const result = [];
      value.forEach((item) => {
        const normalized = normalizeSelection(item);
        if (!normalized) return;
        if (seen.has(normalized.value)) return;
        seen.add(normalized.value);
        result.push(normalized);
      });
      return result;
    }
    const normalized = normalizeSelection(value);
    return normalized ? [normalized] : [];
  }, [multiple, value, normalizeSelection]);

  const optionLookup = useMemo(() => {
    const map = new Map();
    options.forEach((option) => {
      map.set(String(option.value), option);
    });
    return map;
  }, [options]);

  const selectedOptions = useMemo(() => {
    return baseSelected.map((item) => {
      const existing = optionLookup.get(item.value);
      if (existing) return existing;
      return item;
    });
  }, [baseSelected, optionLookup]);

  const fetchReferrers = useCallback(
    async (keyword) => {
      try {
        setIsLoading(true);
        const result = await PlayerService.getReferrersList({
          page: 1,
          perPage: 30,
          keyword: keyword || undefined
        });

        if (result?.status === 200) {
          const data = result.response.data || [];
          const mapped = data.map((item) => ({
            value: String(item?.UserID),
            label: item?.Username
          }));

          // Merge with existing options (including initialOptions)
          setOptions((prev) => {
            const merged = dedupeOptions([...prev, ...mapped]);
            onOptionsCache?.(merged);
            return merged;
          });
        } else if (result?.error) {
          console.error('Failed to load referrers:', result.error);
        }
      } catch (error) {
        console.error('Failed to load referrers:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [onOptionsCache]
  );

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchReferrers(searchTerm);
    }, SEARCH_DEBOUNCE);

    return () => {
      clearTimeout(debounceRef.current);
    };
  }, [fetchReferrers, searchTerm]);

  const handleSelectionChange = (selectedItems) => {
    if (multiple) {
      const items = Array.isArray(selectedItems) ? selectedItems : [];
      const seen = new Set();
      const normalized = [];
      items.forEach((item) => {
        const normalizedItem = normalizeSelection(item);
        if (!normalizedItem) return;
        const lookup = optionLookup.get(normalizedItem.value);
        const finalItem = lookup ? lookup : normalizedItem;
        if (seen.has(finalItem.value)) return;
        seen.add(finalItem.value);
        normalized.push(finalItem);
      });
      onChange(normalized);
      setSearchTerm('');
      return;
    }

    if (!selectedItems) {
      onChange(null);
      setSearchTerm('');
      return;
    }

    const normalizedItem = normalizeSelection(selectedItems);
    if (!normalizedItem) {
      onChange(null);
      setSearchTerm('');
      return;
    }
    const finalItem = optionLookup.get(normalizedItem.value) || normalizedItem;
    onOptionsCache?.([finalItem]);
    onChange(finalItem);
    setSearchTerm('');
  };

  const removeValue = (valueToRemove) => {
    const stringValue = String(valueToRemove);
    if (multiple) {
      onChange(selectedOptions.filter((item) => item.value !== stringValue));
    } else if (baseSelected[0]?.value === stringValue) {
      onChange(null);
    }
  };

  const combinedOptions = useMemo(() => {
    return dedupeOptions([...options, ...selectedOptions]);
  }, [options, selectedOptions]);

  const comboboxValue = useMemo(() => {
    const set = new Set(selectedOptions.map((item) => item.value));
    return combinedOptions.filter((option) => set.has(option.value));
  }, [combinedOptions, selectedOptions]);

  return (
    <div className="space-y-2">
      {multiple && selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((item) => (
            <span
              key={item.value}
              className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              {item.label}
              <button
                type="button"
                onClick={() => removeValue(item.value)}
                className="text-primary-500 hover:text-primary-700 focus-visible:outline-none dark:text-primary-300 dark:hover:text-primary-200">
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <AsyncCombobox
        multiple={multiple}
        data={combinedOptions}
        value={multiple ? comboboxValue : (comboboxValue[0] ?? null)}
        onChange={handleSelectionChange}
        placeholder={placeholder}
        error={error}
        loading={isLoading}
        renderSelectedValues={() => null}
        onSearchChange={setSearchTerm}
        classNames={{
          root: 'space-y-1',
          wrapper: 'relative',
          input: 'pr-10'
        }}
        valueField="value"
        hideSelectedOptions={multiple}
        suffix={
          multiple ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-200">
                {selectedOptions.length}
              </span>
            </div>
          ) : undefined
        }
      />
    </div>
  );
};

ReferrerSelectComponent.displayName = 'ReferrerSelect';

export const ReferrerSelect = memo(ReferrerSelectComponent);

ReferrerSelect.propTypes = {
  multiple: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          label: PropTypes.string
        })
      ])
    ),
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string
    })
  ]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onOptionsCache: PropTypes.func,
  initialOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  )
};

ReferrerSelect.defaultProps = {
  multiple: false,
  value: null,
  placeholder: 'Search referrer players...',
  error: null,
  onOptionsCache: undefined,
  initialOptions: []
};
