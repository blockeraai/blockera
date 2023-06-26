/**
 * Publisher Storybook dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { BackgroundField } from '../field';
import { extensionConfig } from '@publisher/extensions';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Fields/Background',
	component: BackgroundField,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		config: extensionConfig,
		attribute: 'publisherBackground',
		label: 'Background Field',
		className: 'publisher-background-field',
		blockContextValue: {
			publisherBackground: [],
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};
