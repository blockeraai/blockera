/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { expect } from '@storybook/jest';
import {
	within,
	waitFor,
	fireEvent,
	userEvent,
} from '@storybook/testing-library';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import { default as InheritIcon } from './icons/inherit';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider, SelectControl } from '../../../index';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

const timeout = 1000;

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
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex direction="column" gap="30px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Native<span>Normal</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks Control={SelectControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Native<span>Hover</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							className="is-hovered"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Native<span>Focus</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							className="is-focused"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Native<span>With Field</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							label="Field"
						/>
					</ControlContextProvider>
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
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Custom<span>Normal</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks Control={SelectControl} {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Custom<span>Hover</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							className="is-hovered"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Custom<span>Focus</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							className="is-focused"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Custom<span>noBorder</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							noBorder={true}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Custom<span>noBorder → Focus</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							noBorder={true}
							className="is-focused"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Custom<span>Menu Position Top</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							customMenuPosition="top"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Custom<span>customHideInputIcon</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							customHideInputIcon={true}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Custom<span>customHideInputLabel</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							customHideInputLabel={true}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Custom<span>customHideInputCaret</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							customHideInputCaret={true}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Custom<span>customInputCenterContent</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							customInputCenterContent={true}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="20px">
					<h2 className="story-heading">
						Custom<span>With Field</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={SelectControl}
							{...args}
							label="Field"
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const PlayNative = {
	args: {
		type: 'native',
		options: selectOptions,
		value: 'all',
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={SelectControl} {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const selectControl = canvas.getByRole('combobox');
		const currentValue = canvas.getByTestId('current-value');

		await expect(currentValue).toBeInTheDocument();
		await expect(selectControl).toBeInTheDocument();

		await waitFor(
			async () => await expect(currentValue).toHaveTextContent('all'),
			{ timeout }
		);
		await waitFor(
			async () => await expect(selectControl).toHaveValue('all'),
			{ timeout }
		);

		fireEvent.change(selectControl, {
			target: { value: 'opacity' },
		});

		await waitFor(
			async () => await expect(selectControl).toHaveValue('opacity'),
			{ timeout }
		);
		await waitFor(
			async () => await expect(currentValue).toHaveTextContent('opacity'),
			{ timeout }
		);
	},
};
PlayNative.storyName = 'Play → Native';

export const PlayCustom = {
	args: {
		type: 'custom',
		options: selectOptions,
		value: 'all',
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={SelectControl} {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const selectControl = canvas.getByRole('button');
		const currentValue = canvas.getByTestId('current-value');

		await expect(currentValue).toBeInTheDocument();
		await expect(selectControl).toBeInTheDocument();

		await expect(currentValue).toHaveTextContent('all');

		// change item
		await userEvent.click(selectControl);
		await userEvent.click(canvas.getAllByRole('option')[3]);
		await waitFor(
			async () => await expect(currentValue).toHaveTextContent('margin'),
			{ timeout }
		);

		// open and use esc to close
		await userEvent.click(selectControl);
		await userEvent.type(selectControl, '{esc}');

		await waitFor(
			async () => await expect(currentValue).toHaveTextContent('margin'),
			{ timeout }
		);
	},
};
PlayCustom.storyName = 'Play → Custom';

export const All = {
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
