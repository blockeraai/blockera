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
	argTypes: {
		children: {
			table: {
				disable: true,
			},
		},
	},
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
	decorators: [inspectDecorator, ...decorators],
};
