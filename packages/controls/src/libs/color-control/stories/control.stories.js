/**
 * External dependencies
 */
import {
	fireEvent,
	userEvent,
	waitFor,
	within,
} from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { ColorControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const {
	WithInspectorStyles,
	WithPopoverDataProvider,
	SharedDecorators,
	WithStoryContextProvider,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/ColorControl',
	component: ColorControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		defaultValue: '',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Color<span>Empty</span>
			</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const Normal = {
	args: {
		defaultValue: '',
		value: '',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">Normal Color Control</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks
					Control={ColorControl}
					{...args}
					value=""
					placement={'left-start'}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#eeeeee',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#0947eb',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#0945EB91',
				}}
			>
				<ControlWithHooks
					Control={ColorControl}
					{...args}
					style={{ width: '100px' }}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#0947eb',
				}}
			>
				<ControlWithHooks
					Control={ColorControl}
					{...args}
					contentAlign="center"
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const Minimal = {
	args: {
		defaultValue: '',
		type: 'minimal',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">Minimal Color Control</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#eeeeee',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '#0947eb',
				}}
			>
				<ControlWithHooks Control={ColorControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const Play = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '#0947eb',
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={ColorControl} {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const button = canvas.getByRole('button', {});

		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
		});

		await step('Check Initial State', async () => {
			await expect(button).toBeInTheDocument();
			await expect(currentValue).toHaveTextContent('"#0947eb"');
		});

		await step('Change Color', async () => {
			await userEvent.click(button);

			const input = canvas.getByRole('textbox');

			// element shown inside popover
			await expect(input).toBeInTheDocument();

			fireEvent.change(input, { target: { value: '00B703' } });
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('"#00b703"'),
				{ timeout: 1000 }
			);
		});
	},
};

export const All = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render {...Default.args} />

			<Normal.render {...Normal.args} />

			<Minimal.render {...Minimal.args} />
		</Flex>
	),
};
