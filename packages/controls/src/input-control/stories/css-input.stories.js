/**
 * Internal dependencies
 */
import { CssInputControl } from '../../index';
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';

export default {
	title: 'Controls/CSS Input Control',
	component: CssInputControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		unitType: 'essential',
		className: 'publisher-input',
		value: '20px',
	},
	decorators: [inspectDecorator, ...decorators],
};

export const Screenshot = {
	args: {
		unitType: 'essential',
		className: 'publisher-input',
		value: '20px',
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => (
		<>
			<h2 className="story-heading">Essential CSS Unit</h2>
			<CssInputControl {...args} />

			<h2 className="story-heading">Special Value</h2>
			<CssInputControl {...args} value="1auto" unitType="general" />
		</>
	),
};
