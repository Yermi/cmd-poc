import React from 'react';

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
  const options = parsePairs(attribute?.options?.pairs);
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
          Configure valid JSON pairs in the field options.
        </p>
      ) : null}
    </div>
  );
};

export default Input;
