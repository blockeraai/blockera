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
	decorators: [inspectDecorator, ...decorators],
};
