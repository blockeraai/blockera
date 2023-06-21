/**
 * Internal dependencies
 */
import Button from '../button';
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';

export default {
	title: 'Components/Button Component',
	component: Button,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		children: <span>Call to Action</span>,
	},
	parameters: {
		controls: {
			sort: 'alpha',
		},
	},
	argTypes: {
		style: {
			options: ['primary', 'secondary'],
			control: { type: 'select' },
		},
		size: {
			options: ['normal', 'small', 'extra-small'],
			control: { type: 'select' },
		},
		align: {
			options: ['left', 'center', 'right'],
			control: { type: 'select' },
		},
		noBorder: {
			control: { type: 'boolean' },
		},
		children: {
			table: {
				disable: true,
			},
		},
	},
	decorators: [inspectDecorator, ...decorators],
};
