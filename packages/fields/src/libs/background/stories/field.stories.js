/**
 * Internal dependencies
 */
import { BackgroundField } from '../field';
import { extensionConfig } from '@publisher/extensions';
import {
	decorators,
	inspectDecorator,
} from '../../../../../../.storybook/preview';

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
	decorators: [inspectDecorator, ...decorators],
};
