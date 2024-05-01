/**
 * External dependencies
 */

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/storybook/decorators';

/**
 * Internal dependencies
 */
import { ColorPickerControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, WithPopoverDataProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/ColorPickerControl',
	component: ColorPickerControl,
	tags: ['autodocs'],
};

export const PopoverPicker = {
	args: {
		defaultValue: '',
		value: '',
		isOpen: true,
		isPopover: true,
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">
				ColorPicker<span>Popover</span>
			</h2>
			<ControlWithHooks Control={ColorPickerControl} {...args} />
		</Flex>
	),
};

export const WithoutPopover = {
	args: {
		defaultValue: '',
		value: '#0947eb',
		isPopover: false,
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">
				ColorPicker<span>Without Popover</span>
			</h2>
			<ControlWithHooks Control={ColorPickerControl} {...args} />
		</Flex>
	),
};

export const Field = {
	args: {
		label: 'ColorPicker',
		defaultValue: '',
		value: '#0947eb',
		isPopover: false,
		columns: 'columns-1',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">With Field</h2>
			<ControlWithHooks Control={ColorPickerControl} {...args} />
		</Flex>
	),
};

export const All = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex
				direction="column"
				gap="50px"
				style={{ marginBottom: '500px' }}
			>
				<PopoverPicker.render {...PopoverPicker.args} />
			</Flex>

			<WithoutPopover.render {...WithoutPopover.args} />

			<Field.render {...Field.args} />
		</Flex>
	),
};
