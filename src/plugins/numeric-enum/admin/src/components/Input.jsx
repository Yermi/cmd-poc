import React from 'react';

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter((entry) => entry.length > 0);
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return value
      .split('\n')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }

  return [];
};

const parsePairs = (rawPairs) => {
  if (typeof rawPairs !== 'string' || rawPairs.trim().length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawPairs);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.label === 'string' &&
          item.label.trim().length > 0 &&
          Number.isFinite(Number(item.value))
      )
      .map((item) => ({
        label: item.label,
        value: Number(item.value),
      }));
  } catch {
    return [];
  }
};

const parseOptions = (attributeOptions) => {
  const labels = normalizeList(attributeOptions?.labels);
  const values = normalizeList(attributeOptions?.values);

  if (labels.length > 0 && values.length > 0) {
    const length = Math.min(labels.length, values.length);

    return Array.from({ length })
      .map((_, index) => ({
        label: labels[index],
        value: Number(values[index]),
      }))
      .filter((item) => item.label.length > 0 && Number.isFinite(item.value));
  }

  // Backward compatibility for old JSON-based configuration.
  return parsePairs(attributeOptions?.pairs);
};

const Input = ({
  name,
  value,
  onChange,
  attribute,
  disabled,
  required,
  intlLabel,
  error,
}) => {
  const options = parseOptions(attribute?.options);
  const normalizedValue = value === null || value === undefined ? '' : String(value);

  const handleChange = (event) => {
    const nextValue = event.target.value;

    onChange({
      target: {
        name,
        type: attribute?.type || 'integer',
        value: nextValue === '' ? null : Number(nextValue),
      },
    });
  };

  return (
    <div>
      <label htmlFor={name} style={{ display: 'block', marginBottom: '0.25rem' }}>
        {intlLabel?.defaultMessage || name}
      </label>
      <select
        id={name}
        name={name}
        value={normalizedValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        style={{ width: '100%', minHeight: '2.25rem' }}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p style={{ color: '#c00', marginTop: '0.25rem' }}>
          {error.defaultMessage || 'Invalid value'}
        </p>
      ) : null}
      {options.length === 0 ? (
        <p style={{ marginTop: '0.25rem', opacity: 0.8 }}>
          Configure labels and numeric values in field options.
        </p>
      ) : null}
    </div>
  );
};

export default Input;
