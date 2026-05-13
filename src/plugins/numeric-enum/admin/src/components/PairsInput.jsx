import React, { useState, useEffect } from 'react';
import { Box, Button, Field, Flex, IconButton, TextInput, Tooltip, Typography } from '@strapi/design-system';
import { Minus, Plus } from '@strapi/icons';

const parsePairsFromValue = (v) => {
  if (!v || typeof v !== 'string' || !v.trim()) {
    return [{ label: '', value: '' }];
  }
  try {
    const parsed = JSON.parse(v);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((p) => ({ label: String(p.label ?? ''), value: String(p.value ?? '') }));
    }
  } catch {
    // fall through
  }
  return [{ label: '', value: '' }];
};

const PairsInput = ({ name, value, onChange, intlLabel, disabled, required, error }) => {
  const [pairs, setPairs] = useState(() => parsePairsFromValue(value));
  const errorMessage = typeof error === 'string' ? error : error?.defaultMessage;

  useEffect(() => {
    setPairs(parsePairsFromValue(value));
  }, [value]);

  const emitChange = (nextPairs) => {
    const serialized = JSON.stringify(
      nextPairs.map((p) => ({
        label: p.label,
        value: p.value === '' ? '' : Number(p.value),
      }))
    );
    onChange({ target: { name, value: serialized } });
  };

  const handleLabelChange = (index, val) => {
    const next = pairs.map((p, i) => (i === index ? { ...p, label: val } : p));
    setPairs(next);
    emitChange(next);
  };

  const handleValueChange = (index, val) => {
    const next = pairs.map((p, i) => (i === index ? { ...p, value: val } : p));
    setPairs(next);
    emitChange(next);
  };

  const handleAdd = () => {
    const next = [...pairs, { label: '', value: '' }];
    setPairs(next);
    emitChange(next);
  };

  const handleRemove = (index) => {
    const next = pairs.filter((_, i) => i !== index);
    const safe = next.length === 0 ? [{ label: '', value: '' }] : next;
    setPairs(safe);
    emitChange(safe);
  };

  const canRemove = pairs.length > 1;

  return (
    <Field.Root name={name} error={errorMessage} required={required}>
      <Field.Label>{intlLabel?.defaultMessage || name}</Field.Label>

      <Box paddingTop={1} paddingBottom={1}>
        <Flex gap={2} style={{ paddingRight: canRemove ? '2.5rem' : 0 }}>
          <Box style={{ flex: '2 1 0%' }}>
            <Typography variant="pi" textColor="neutral600">
              Text
            </Typography>
          </Box>
          <Box style={{ flex: '1 1 0%' }}>
            <Typography variant="pi" textColor="neutral600">
              Value
            </Typography>
          </Box>
        </Flex>
      </Box>

      {pairs.map((pair, index) => (
        <Flex key={index} gap={2} alignItems="center" paddingBottom={2}>
          <Box style={{ flex: '2 1 0%' }}>
            <TextInput
              type="text"
              placeholder="Label text"
              value={pair.label}
              disabled={disabled}
              onChange={(e) => handleLabelChange(index, e.target.value)}
            />
          </Box>
          <Box style={{ flex: '1 1 0%' }}>
            <TextInput
              type="number"
              placeholder="0"
              value={pair.value}
              disabled={disabled}
              onChange={(e) => handleValueChange(index, e.target.value)}
            />
          </Box>
          {canRemove && (
            <IconButton
              label="Remove entry"
              size="M"
              variant="secondary"
              onClick={() => handleRemove(index)}
              disabled={disabled}
            >
              <Minus />
            </IconButton>
          )}
        </Flex>
      ))}

      <Tooltip label="Add a new entry">
        <Button
          type="button"
          variant="secondary"
          size="S"
          startIcon={<Plus />}
          onClick={handleAdd}
          disabled={disabled}
        >
          Add entry
        </Button>
      </Tooltip>

      <Field.Error />
      <Field.Hint />
    </Field.Root>
  );
};

export default PairsInput;
