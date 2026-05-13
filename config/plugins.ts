import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
	'numeric-enum': {
		enabled: true,
		resolve: './src/plugins/numeric-enum',
		config: {},
	},
});

export default config;
