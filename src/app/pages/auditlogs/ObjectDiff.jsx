// import React from 'react';

const getType = (v) => {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
};

const formatValue = (v) => {
  if (typeof v === 'string') return `"${v}"`;
  return String(v);
};

const dumpLines = (val, depth, key, isLast, type) => {
  const baseIndent = '  '.repeat(depth);
  const keyPrefix = key ? `"${key}": ` : '';
  const comma = isLast ? '' : ',';

  if (typeof val !== 'object' || val === null) {
    return [{ text: `${baseIndent}${keyPrefix}${formatValue(val)}${comma}`, type }];
  }

  const json = JSON.stringify(val, null, 2);
  const lines = json.split('\n');

  return lines.map((line, idx) => {
    let text;
    if (idx === 0) {
      text = `${baseIndent}${keyPrefix}${line}`;
    } else {
      text = `${baseIndent}${line}`;
    }

    if (idx === lines.length - 1) {
      text += comma;
    }

    return { text, type };
  });
};

const buildDiff = (oldVal, newVal, depth = 0, key = null, isLast = true) => {
  const indent = '  '.repeat(depth);
  const comma = isLast ? '' : ',';
  const keyPrefix = key ? `"${key}": ` : '';

  // Case 1: Added
  if (oldVal === undefined) {
    return dumpLines(newVal, depth, key, isLast, 'added');
  }

  // Case 2: Removed
  if (newVal === undefined) {
    return dumpLines(oldVal, depth, key, isLast, 'removed');
  }

  // Case 3: Both exist
  const oldType = getType(oldVal);
  const newType = getType(newVal);

  if (oldType !== newType) {
    return [
      ...dumpLines(oldVal, depth, key, isLast, 'removed'),
      ...dumpLines(newVal, depth, key, isLast, 'added')
    ];
  }

  if (oldType === 'object' || oldType === 'array') {
    const isArray = oldType === 'array';
    const keys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);
    const sortedKeys = Array.from(keys);

    if (isArray) {
      sortedKeys.sort((a, b) => parseInt(a) - parseInt(b));
    } else {
      sortedKeys.sort();
    }

    const openChar = isArray ? '[' : '{';
    const closeChar = isArray ? ']' : '}';

    const lines = [];
    lines.push({ text: `${indent}${keyPrefix}${openChar}`, type: 'unchanged' });

    sortedKeys.forEach((k, index) => {
      const isLastItem = index === sortedKeys.length - 1;
      const childLines = buildDiff(oldVal[k], newVal[k], depth + 1, isArray ? null : k, isLastItem);
      lines.push(...childLines);
    });

    lines.push({ text: `${indent}${closeChar}${comma}`, type: 'unchanged' });
    return lines;
  }

  // Primitives
  if (oldVal !== newVal) {
    return [
      ...dumpLines(oldVal, depth, key, isLast, 'removed'),
      ...dumpLines(newVal, depth, key, isLast, 'added')
    ];
  }

  // Equal primitives
  return [{ text: `${indent}${keyPrefix}${formatValue(oldVal)}${comma}`, type: 'unchanged' }];
};

const ObjectDiff = ({ oldData, newData }) => {
  if (!oldData && !newData) return null;

  const lines = buildDiff(oldData, newData, 0, null, true);

  // Filter lines for left (Old) and right (New) views
  // This removes the empty spacer lines that were previously used for alignment
  const leftLines = lines.filter((line) => line.type === 'unchanged' || line.type === 'removed');
  const rightLines = lines.filter((line) => line.type === 'unchanged' || line.type === 'added');

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="overflow-auto rounded bg-gray-100 p-4 font-mono text-sm dark:bg-dark-700">
        <div className="mb-2 font-bold text-gray-500">Old Value</div>
        {leftLines.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.type === 'removed' ? 'bg-red-100 dark:bg-red-900/30' : ''
            } block w-full whitespace-pre`}>
            {line.text}
          </div>
        ))}
      </div>
      <div className="overflow-auto rounded bg-gray-100 p-4 font-mono text-sm dark:bg-dark-700">
        <div className="mb-2 font-bold text-gray-500">New Value</div>
        {rightLines.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.type === 'added' ? 'bg-green-100 dark:bg-green-900/30' : ''
            } block w-full whitespace-pre`}>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjectDiff;
