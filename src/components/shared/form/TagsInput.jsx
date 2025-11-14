import { useState, useRef, useEffect } from 'react';

export default function TagInput({
  label = '',
  placeholder = '',
  value = [],
  onChange,
  separators = [',', 'Enter'], // add on comma or Enter
  maxTags, // optional
  allowDuplicates = false, // default: unique
  className = '',
  errorText // optional validation text
}) {
  const [tags, setTags] = useState(value);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setTags(value || []);
  }, [value]);

  const commit = (raw) => {
    const text = (raw || '').trim();
    if (!text) return;

    const next = allowDuplicates ? [...tags, text] : tags.includes(text) ? tags : [...tags, text];

    if (maxTags && next.length > maxTags) return;

    setTags(next);
    onChange && onChange(next);
    setInput('');
  };

  const remove = (idx) => {
    const next = tags.filter((_, i) => i !== idx);
    setTags(next);
    onChange && onChange(next);
  };

  const onKeyDown = (e) => {
    // add on separators
    if (separators.includes(e.key)) {
      e.preventDefault();
      commit(input);
      return;
    }
    // remove last tag when input empty + backspace
    if (e.key === 'Backspace' && input === '' && tags.length) {
      e.preventDefault();
      remove(tags.length - 1);
    }
  };

  const onPaste = (e) => {
    // paste split by comma/newline -> add many
    const text = e.clipboardData.getData('text');
    if (!text) return;

    const parts = text
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (!parts.length) return;

    e.preventDefault();
    parts.forEach(commit);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div
        className={[
          'form-input-base form-input peer relative mt-1.5 border-gray-300 hover:border-gray-400 focus:border-primary-600 dark:border-dark-450 dark:hover:border-dark-400 dark:focus:border-primary-500'
        ].join(' ')}
        onClick={() => inputRef.current?.focus()}>
        <ul className="flex flex-wrap items-center gap-1.5">
          {(!tags || tags.length === 0) && input.length === 0 && (
            <span className="select-none text-gray-600">{placeholder}</span>
          )}

          {tags.map((tag, i) => (
            <li
              key={`${tag}-${i}`}
              className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(i);
                }}
                className="opacity-70 hover:opacity-100"
                aria-label={`Remove ${tag}`}>
                ×
              </button>
            </li>
          ))}
          {/* the real input lives inline with the chips */}
          <li className="min-w-[120px] flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              className="w-full border-none bg-transparent text-sm text-gray-900 placeholder-gray-700 outline-none dark:text-gray-100"
              placeholder={tags.length ? '' : ''}
              // optional accessibility
              role="combobox"
              aria-expanded="false"
              aria-autocomplete="list"
              aria-haspopup="listbox"
              autoComplete="off"
              type="text"
            />
          </li>
        </ul>
      </div>
      {errorText ? <p className="mt-1 text-xs text-red-500">{errorText}</p> : null}
    </div>
  );
}
