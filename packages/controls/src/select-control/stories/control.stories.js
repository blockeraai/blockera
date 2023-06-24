/**
 * Internal dependencies
 */
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';
import { default as SelectControl } from '../index';
import { __ } from '@wordpress/i18n';

import { default as InheritIcon } from './icons/inherit';

export default {
	title: 'Controls/Select',
	component: SelectControl,
	tags: ['autodocs'],
};

const selectOptions = [
	{
		label: __('All Properties', 'publisher-core'),
		value: 'all',
		icon: <InheritIcon />,
	},
	{
		type: 'optgroup',
		label: __('Common Transitions', 'publisher-core'),
		options: [
			{
				label: __('Opacity', 'publisher-core'),
				value: 'opacity',
				icon: <InheritIcon />,
			},
			{
				label: __('Margin', 'publisher-core'),
				value: 'margin',
				icon: <InheritIcon />,
			},
			{
				label: __('Padding', 'publisher-core'),
				value: 'padding',
				icon: <InheritIcon />,
			},
			{
				label: __('Border', 'publisher-core'),
				value: 'border',
				icon: <InheritIcon />,
			},
			{
				label: __('Transform', 'publisher-core'),
				value: 'transform',
				icon: <InheritIcon />,
			},
			{
				label: __('Flex', 'publisher-core'),
				value: 'flex',
				icon: <InheritIcon />,
			},
			{
				label: __('Filter (Disabled)', 'publisher-core'),
				value: 'filter',
				icon: <InheritIcon />,
				disabled: true,
			},
		],
	},
	{
		label: __('Other', 'publisher-core'),
		value: 'other',
		icon: <InheritIcon />,
	},
];

export const NativeSelect = {
	args: {
		type: 'native',
		options: selectOptions,
		value: 'all',
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => {
		return (
			<>
				<h2 className="story-heading">Native → Normal</h2>
				<SelectControl {...args} />

				<h2 className="story-heading">Native → Hover</h2>
				<SelectControl {...args} className="is-hovered" />

				<h2 className="story-heading">Native → Focus</h2>
				<SelectControl {...args} className="is-focused" />
			</>
		);
	},
};

export const CustomSelect = {
	args: {
		type: 'custom',
		options: selectOptions,
		value: 'all',
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => {
		return (
			<>
				<h2 className="story-heading">Custom → Normal</h2>
				<SelectControl {...args} />

				<h2 className="story-heading">Custom → Hover</h2>
				<SelectControl {...args} className="is-hovered" />

				<h2 className="story-heading">Custom → Focus</h2>
				<SelectControl {...args} className="is-focused" />

				<h2 className="story-heading">Custom → noBorder</h2>
				<SelectControl {...args} noBorder={true} />

				<h2 className="story-heading">Custom → noBorder → Focus</h2>
				<SelectControl
					{...args}
					noBorder={true}
					className="is-focused"
				/>

				<h2 className="story-heading">Custom → Menu Position Top</h2>
				<SelectControl {...args} customMenuPosition="top" />

				<h2 className="story-heading">Custom → customHideInputIcon</h2>
				<SelectControl {...args} customHideInputIcon={true} />

				<h2 className="story-heading">Custom → customHideInputLabel</h2>
				<SelectControl {...args} customHideInputLabel={true} />

				<h2 className="story-heading">Custom → customHideInputCaret</h2>
				<SelectControl {...args} customHideInputCaret={true} />

				<h2 className="story-heading">
					Custom → customInputCenterContent
				</h2>
				<SelectControl {...args} customInputCenterContent={true} />
			</>
		);
	},
};
