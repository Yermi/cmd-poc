import Input from './admin/src/components/Input';
import * as yup from 'yup';
import PairsInput from './admin/src/components/PairsInput';

const pluginId = 'numeric-enum';

const plugin = {
  register(app) {
    app.addFields({ type: 'pairs-editor', Component: PairsInput });

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
                name: 'options.pairs',
                type: 'pairs-editor',
                intlLabel: {
                  id: 'numeric-enum.options.pairs.label',
                  defaultMessage: 'Enum entries',
                },
                value: '[]',
              },
            ],
          },
        ],
        validator: () => ({
          pairs: yup
            .string()
            .test(
              'valid-pairs',
              {
                id: 'numeric-enum.options.pairs.invalid',
                defaultMessage: 'Add at least one entry with a label and a numeric value.',
              },
              (val) => {
                try {
                  const arr = JSON.parse(val || '[]');
                  if (!Array.isArray(arr) || arr.length === 0) return false;
                  const valid = arr.filter(
                    (p) =>
                      p &&
                      typeof p.label === 'string' &&
                      p.label.trim().length > 0 &&
                      Number.isFinite(Number(p.value))
                  );
                  return valid.length > 0;
                } catch {
                  return false;
                }
              }
            )
            .test(
              'unique-values',
              {
                id: 'numeric-enum.options.pairs.unique',
                defaultMessage: 'Values must be unique.',
              },
              (val) => {
                try {
                  const arr = JSON.parse(val || '[]');
                  if (!Array.isArray(arr)) return false;
                  const nums = arr.map((p) => Number(p.value));
                  return new Set(nums).size === nums.length;
                } catch {
                  return false;
                }
              }
            ),
        }),
      },
    });
  },
  bootstrap(app) {
    const ctbPlugin = app.getPlugin('content-type-builder');
    const formsAPI = ctbPlugin?.apis?.forms;

    formsAPI?.components?.add({
      id: 'pairs-editor',
      component: PairsInput,
    });
  },
};

export default plugin;
