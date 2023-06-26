/**
 * Publisher Storybook dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { default as AnglePickerControl } from '../index';
import { WithPlaygroundStyles } from '../../../../../.storybook/preview';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/AnglePickerControl',
	component: AnglePickerControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: 25,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const NoButtons = {
	args: {
		value: 25,
		rotateButtons: false,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};
