/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher Storybook dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import { default as SelectControl } from '../index';
import { default as InheritIcon } from './icons/inherit';
import { WithPlaygroundStyles } from '../../../../../.storybook/preview';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/SelectControl',
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
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="30px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Native → Normal</h2>
					<SelectControl {...args} />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Native → Hover</h2>
					<SelectControl {...args} className="is-hovered" />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Native → Focus</h2>
					<SelectControl {...args} className="is-focused" />
				</Flex>
			</Flex>
		);
	},
};

export const CustomSelect = {
	args: {
		type: 'custom',
		options: selectOptions,
		value: 'all',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="30px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Custom → Normal</h2>
					<SelectControl {...args} />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Custom → Hover</h2>
					<SelectControl {...args} className="is-hovered" />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Custom → Focus</h2>
					<SelectControl {...args} className="is-focused" />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Custom → noBorder</h2>
					<SelectControl {...args} noBorder={true} />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Custom → noBorder → Focus</h2>
					<SelectControl
						{...args}
						noBorder={true}
						className="is-focused"
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Custom → Menu Position Top
					</h2>
					<SelectControl {...args} customMenuPosition="top" />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Custom → customHideInputIcon
					</h2>
					<SelectControl {...args} customHideInputIcon={true} />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Custom → customHideInputLabel
					</h2>
					<SelectControl {...args} customHideInputLabel={true} />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Custom → customHideInputCaret
					</h2>
					<SelectControl {...args} customHideInputCaret={true} />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Custom → customInputCenterContent
					</h2>
					<SelectControl {...args} customInputCenterContent={true} />
				</Flex>
			</Flex>
		);
	},
};

export const Screenshot = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => {
		return (
			<Flex direction="column" gap="50px">
				<NativeSelect.render {...NativeSelect.args} />

				<CustomSelect.render {...CustomSelect.args} />
			</Flex>
		);
	},
};
