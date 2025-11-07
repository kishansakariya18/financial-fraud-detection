// Import Dependencies
import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';

// Local Imports
import { InputErrorMsg } from 'components/ui';

// ----------------------------------------------------------------------

function TagsInput({
  value = [],
  onChange,
  label = 'Tags',
  placeholder = 'Enter tag and press Enter...',
  error = '',
  disabled = false,
  classNames
}) {
  const [tags, setTags] = useState(value || []);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setTags(value || []);
  }, [value]);

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) {
      return;
    }

    if (tags.includes(trimmedTag)) {
      return;
    }

    const newTags = [...tags, trimmedTag];
    setTags(newTags);
    setInputValue('');
    onChange?.(newTags);
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleBlur = () => {
    if (inputValue) {
      addTag(inputValue);
    }
  };

  return (
    <div className={clsx('flex flex-col', classNames?.root)}>
      {label && (
        <label className="input-label">
          <span>{label}</span>
        </label>
      )}
      <div
        className={clsx(
          'form-input-base form-input',
          error
            ? 'border-error dark:border-error-lighter'
            : disabled
              ? 'cursor-not-allowed border-gray-300 bg-gray-150 opacity-60 dark:border-dark-500 dark:bg-dark-600'
              : 'peer border-gray-300 focus-within:border-primary-600 focus-within:ring-primary-500/50 dark:border-dark-450 dark:focus-within:border-primary-500 dark:hover:border-dark-400',
          label && 'mt-1.5',
          classNames?.input
        )}>
        {/* Tags */}
        <div className={`${tags.length === 0 ? 'mb-0' : 'mb-2'} flex flex-wrap gap-2`}>
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-md bg-primary-100 px-2 py-1 text-sm text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-primary-600 hover:text-primary-800 focus:outline-none dark:text-primary-400 dark:hover:text-primary-300">
                  <XMarkIcon className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="w-full border-0 bg-transparent p-0 outline-none focus:ring-0"
        />
      </div>

      <InputErrorMsg when={error && typeof error !== 'boolean'} className={classNames?.error}>
        {error}
      </InputErrorMsg>
    </div>
  );
}

TagsInput.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
  classNames: PropTypes.object
};

export { TagsInput };
