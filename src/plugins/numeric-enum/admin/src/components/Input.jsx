import React from 'react';
import { Field, SingleSelect, SingleSelectOption } from '@strapi/design-system';

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
  // New pairs format from PairsInput
  if (attributeOptions?.pairs) {
    const result = parsePairs(attributeOptions.pairs);
    if (result.length > 0) return result;
  }

  // Legacy separate labels/values arrays
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
  const errorMessage = typeof error === 'string' ? error : error?.defaultMessage;
  const hint =
    options.length === 0 ? 'Configure labels and numeric values in field options.' : undefined;

  const handleChange = (nextValue) => {
    const stringValue = nextValue === undefined || nextValue === null ? '' : String(nextValue);

    onChange({
      target: {
        name,
        type: attribute?.type || 'integer',
        value: stringValue === '' ? null : Number(stringValue),
      },
    });
  };

  return (
    <Field.Root name={name} error={errorMessage} hint={hint} required={required}>
      <Field.Label>{intlLabel?.defaultMessage || name}</Field.Label>
      <SingleSelect
        id={name}
        name={name}
        value={normalizedValue === '' ? undefined : normalizedValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        placeholder="Select..."
      >
        {options.map((option) => (
          <SingleSelectOption key={option.value} value={String(option.value)}>
            {option.label}
          </SingleSelectOption>
        ))}
      </SingleSelect>
      <Field.Error />
      <Field.Hint />
    </Field.Root>
  );
};

export default Input;
