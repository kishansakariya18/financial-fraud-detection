import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

function EmailInput({
  value = [],
  onChange,
  label = 'Email',
  placeholder = 'Enter email address...',
  error = '',
  parentClass = '',
  disabled = false,
  classNames,
  ...props
}) {
  const [emails, setEmails] = useState(value || []);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    console.log('EmailInput received value:', value);
    setEmails(value || []);
  }, [value]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = (email) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setInputError('Email cannot be empty');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setInputError('Please enter a valid email address');
      return;
    }

    if (emails.includes(trimmedEmail)) {
      setInputError('This email is already added');
      return;
    }

    const newEmails = [...emails, trimmedEmail];
    setEmails(newEmails);
    setInputValue('');
    setInputError('');
    onChange?.(newEmails);
  };

  const removeEmail = (emailToRemove) => {
    const newEmails = emails.filter((email) => email !== emailToRemove);
    setEmails(newEmails);
    onChange?.(newEmails);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addEmail(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      removeEmail(emails[emails.length - 1]);
    }
  };

  const handleFocus = () => {
    // Focus handling if needed
  };

  const handleBlur = () => {
    if (inputValue) {
      addEmail(inputValue);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const emailList = pastedText.split(/[,\s]+/).filter((email) => email.trim());

    emailList.forEach((email) => {
      const trimmedEmail = email.trim();
      if (trimmedEmail && validateEmail(trimmedEmail) && !emails.includes(trimmedEmail)) {
        const newEmails = [...emails, trimmedEmail];
        setEmails(newEmails);
        onChange?.(newEmails);
      }
    });
  };

  return (
    <div className={clsx('input-root', parentClass, classNames?.root)}>
      {label && (
        <label className={clsx('input-label', classNames?.label)}>
          <span className={clsx('input-label', classNames?.labelText)}>{label}</span>
        </label>
      )}

      <div className={clsx('input-wrapper relative', label && 'mt-1.5', classNames?.wrapper)}>
        <div
          className={clsx(
            'form-input-base',
            'form-input',
            error || inputError
              ? 'border-error dark:border-error-lighter'
              : disabled
                ? 'cursor-not-allowed border-gray-300 bg-gray-150 opacity-60 dark:border-dark-500 dark:bg-dark-600'
                : 'peer border-gray-300 focus-within:border-primary-600 focus-within:ring-primary-500/50 dark:border-dark-450 dark:focus-within:border-primary-500 dark:hover:border-dark-400',
            classNames?.input
          )}>
          {/* Email Tags */}
          <div className={`${emails.length === 0 ? 'mb-0' : 'mb-2'} flex flex-wrap gap-2`}>
            {emails.map((email, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-md bg-primary-100 px-2 py-1 text-sm text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {email}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="ml-1 text-primary-600 hover:text-primary-800 focus:outline-none dark:text-primary-400 dark:hover:text-primary-300">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {/* Input Field */}
          <input
            type="email"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setInputError('');
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onPaste={handlePaste}
            placeholder={emails.length === 0 ? placeholder : 'Add another email...'}
            disabled={disabled}
            className="w-full border-none bg-transparent text-sm placeholder-gray-400 outline-none dark:placeholder-dark-300"
            {...props}
          />
        </div>
      </div>

      {/* Error Messages */}
      {(error || inputError) && (
        <div
          className={clsx(
            'input-error mt-1 text-sm text-error dark:text-error-light',
            classNames?.error
          )}>
          {error || inputError}
        </div>
      )}
    </div>
  );
}

export { EmailInput };
