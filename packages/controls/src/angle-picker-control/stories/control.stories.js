/**
 * Internal dependencies
 */
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';
import { default as AnglePickerControl } from '../index';

export default {
	title: 'Controls/Angle Picker',
	component: AnglePickerControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: 25,
	},
	decorators: [inspectDecorator, ...decorators],
};

export const NoButtons = {
	args: {
		value: 25,
		rotateButtons: false,
	},
	decorators: [inspectDecorator, ...decorators],
};
