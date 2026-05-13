import Input from './admin/src/components/Input';

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
                name: 'options.pairs',
                type: 'text',
                intlLabel: {
                  id: 'numeric-enum.options.pairs.label',
                  defaultMessage: 'Label/value pairs (JSON)',
                },
                description: {
                  id: 'numeric-enum.options.pairs.description',
                  defaultMessage:
                    'Use JSON array: [{"label":"Draft","value":0},{"label":"Published","value":1}]',
                },
              },
            ],
          },
        ],
        validator: () => ({}),
      },
    });
  },
};

export default plugin;
