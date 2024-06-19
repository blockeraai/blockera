/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { Flex } from '../../';
import { default as InheritIcon } from './icons/inherit';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider, ToggleSelectControl } from '../../../index';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);

const options = [
	{
		label: __('Left', 'blockera'),
		value: 'left',
	},
	{
		label: __('Center', 'blockera'),
		value: 'center',
	},
	{
		label: __('Right', 'blockera'),
		value: 'right',
	},
];

const optionsWithIcon = [
	{
		label: __('Left', 'blockera'),
		value: 'left',
		icon: <InheritIcon />,
	},
	{
		label: __('Center', 'blockera'),
		value: 'center',
		icon: <InheritIcon />,
	},
	{
		label: __('Right', 'blockera'),
		value: 'right',
		icon: <InheritIcon />,
	},
];

export default {
	title: 'Controls/ToggleSelectControl',
	component: ToggleSelectControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: 'left',
		},
		options,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const TextToggle = {
	args: {
		value: 'left',
		options,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">Text Toggles</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ToggleSelectControl {...args} />
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ToggleSelectControl {...args} className="is-hovered" />
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ToggleSelectControl {...args} className="is-focused" />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const IconToggle = {
	args: {
		value: 'center',
		options: optionsWithIcon,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">Icon Toggles</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ToggleSelectControl {...args} />
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ToggleSelectControl {...args} className="is-hovered" />
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ToggleSelectControl {...args} className="is-focused" />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const DeselectableToggle = {
	args: {
		options: optionsWithIcon,
		isDeselectable: true,
		controlInfo: {
			name: nanoid(),
			value: '',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">Deselectable Toggles</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ToggleSelectControl {...args} />
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ToggleSelectControl {...args} className="is-hovered" />
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ToggleSelectControl {...args} className="is-focused" />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const Field = {
	args: {
		label: 'Field',
		value: 'center',
		options: optionsWithIcon,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">With Field</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ToggleSelectControl {...args} />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<TextToggle.render {...TextToggle.args} />

			<IconToggle.render {...IconToggle.args} />

			<DeselectableToggle.render {...DeselectableToggle.args} />

			<Field.render {...Field.args} />
		</Flex>
	),
};
