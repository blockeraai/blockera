/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { default as InheritIcon } from './icons/inherit';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider, ToggleSelectControl } from '../../../index';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);

const options = [
	{
		label: __('Left', 'publisher-core'),
		value: 'left',
	},
	{
		label: __('Center', 'publisher-core'),
		value: 'center',
	},
	{
		label: __('right', 'publisher-core'),
		value: 'right',
	},
];

const optionsWithIcon = [
	{
		label: __('Left', 'publisher-core'),
		value: 'left',
		icon: <InheritIcon />,
	},
	{
		label: __('Center', 'publisher-core'),
		value: 'center',
		icon: <InheritIcon />,
	},
	{
		label: __('Right', 'publisher-core'),
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
			<Flex direction="column" gap="15px">
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
			<Flex direction="column" gap="15px">
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
			<Flex direction="column" gap="15px">
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
			<Flex direction="column" gap="15px">
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

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<ToggleSelectControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const Play = {
	args: {
		options,
		isDeselectable: true,
		controlInfo: {
			name: nanoid(),
			value: '',
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const currentValue = canvas.getByTestId('current-value');
		const buttons = canvas.getAllByRole('button');

		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toHaveTextContent('""');
		});

		await step('Change Test', async () => {
			await userEvent.click(buttons[0]);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('left'),
				{ timeout: 1000 }
			);

			await userEvent.click(buttons[1]);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('center'),
				{ timeout: 1000 }
			);
		});

		await step('Deselect', async () => {
			await userEvent.click(buttons[1]);
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('""'),
				{ timeout: 1000 }
			);
		});
	},
};

export const Screenshot = {
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
