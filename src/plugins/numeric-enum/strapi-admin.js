import Input from './admin/src/components/Input';
import * as yup from 'yup';

const pluginId = 'numeric-enum';

const plugin = {
  register(app) {
    app.customFields.register({
      name: 'numeric-enum',
      pluginId,
      type: 'integer',
      intlLabel: {
        id: 'numeric-enum.field.label',
        defaultMessage: 'Numeric enum',
      },
      intlDescription: {
        id: 'numeric-enum.field.description',
        defaultMessage: 'Select a label and persist a numeric value',
      },
      components: {
        Input: async () => ({
          default: Input,
        }),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: 'numeric-enum.options.section',
              defaultMessage: 'Enum entries',
            },
            items: [
              {
                name: 'options.labels',
                type: 'textarea-enum',
                intlLabel: {
                  id: 'numeric-enum.options.labels.label',
                  defaultMessage: 'Labels',
                },
                description: {
                  id: 'numeric-enum.options.labels.description',
                  defaultMessage: 'One label per line.',
                },
                placeholder: {
                  id: 'numeric-enum.options.labels.placeholder',
                  defaultMessage: 'Ex:\nInformation\nBlock',
                },
                value: ['Information'],
              },
              {
                name: 'options.values',
                type: 'textarea-enum',
                intlLabel: {
                  id: 'numeric-enum.options.values.label',
                  defaultMessage: 'Values',
                },
                description: {
                  id: 'numeric-enum.options.values.description',
                  defaultMessage: 'One numeric value per line, aligned by row with labels.',
                },
                placeholder: {
                  id: 'numeric-enum.options.values.placeholder',
                  defaultMessage: 'Ex:\n0\n1',
                },
                value: [],
              },
            ],
          },
        ],
        validator: () => ({
          labels: yup
            .array()
            .of(
              yup.string().trim().required({
                id: 'numeric-enum.options.labels.required',
                defaultMessage: 'Each label is required.',
              })
            )
            .min(1, {
              id: 'numeric-enum.options.labels.min',
              defaultMessage: 'Add at least one label.',
            }),
          values: yup
            .array()
            .of(
              yup
                .number()
                .typeError({
                  id: 'numeric-enum.options.values.numeric',
                  defaultMessage: 'Each value must be numeric.',
                })
                .integer({
                  id: 'numeric-enum.options.values.integer',
                  defaultMessage: 'Each value must be an integer.',
                })
                .required({
                  id: 'numeric-enum.options.values.required',
                  defaultMessage: 'Each value is required.',
                })
            )
            .min(1, {
              id: 'numeric-enum.options.values.min',
              defaultMessage: 'Add at least one value.',
            })
            .test(
              'same-length-as-labels',
              {
                id: 'numeric-enum.options.values.length',
                defaultMessage: 'Labels and values must have the same number of rows.',
              },
              function validateLength(values) {
                const labels = this.parent?.labels;

                if (!Array.isArray(labels) || !Array.isArray(values)) {
                  return false;
                }

                return labels.length === values.length;
              }
            )
            .test(
              'unique-values',
              {
                id: 'numeric-enum.options.values.unique',
                defaultMessage: 'Values must be unique.',
              },
              (values) => {
                if (!Array.isArray(values)) {
                  return false;
                }

                const normalizedValues = values.map((entry) => Number(entry));
                return new Set(normalizedValues).size === normalizedValues.length;
              }
            ),
        }),
      },
    });
  },
};

export default plugin;
