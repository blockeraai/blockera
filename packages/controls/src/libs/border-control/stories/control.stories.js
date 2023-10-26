// @flow

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
import { BorderControl } from '../../index';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { ControlContextProvider } from '../../../context';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;
SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/BorderControl',
	component: BorderControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<h2 className="story-heading">
				Border<span>Default</span>
			</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const HorizontalBorder = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
		linesDirection: 'horizontal',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<h2 className="story-heading">Horizontal Border Control</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {},
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'dashed' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'dotted' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'double' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					style={{ width: '91px' }}
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const VerticalBorder = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
		linesDirection: 'vertical',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<h2 className="story-heading">Vertical Border Control</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {},
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'dashed' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'dotted' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'double' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					style={{ width: '91px' }}
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const FocusAndWidthChange = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<h2 className="story-heading">Focus And Width Change</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isWidthFocused={true}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isWidthFocused={true}
					style={{ width: '91px' }}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isColorFocused={true}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isColorFocused={true}
					style={{ width: '91px' }}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isStyleFocused={true}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isStyleFocused={true}
					style={{ width: '91px' }}
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const Field = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<h2 className="story-heading">With Field</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const Play = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: {
				width: '10px',
				style: 'solid',
				color: '#0947eb',
			},
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithControlDataProvider,
		WithInspectorStyles,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={BorderControl} {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const numberInput = canvas.getByRole('spinbutton', {
			type: 'number',
		});
		const buttons = canvas.getAllByRole('button'); // colorpicker +  custom select

		await step('Story data is available', async () => {
			await expect(currentValue).toBeInTheDocument();
		});

		await step('Input control test', async () => {
			await expect(numberInput).toBeInTheDocument();
			await expect(numberInput).toHaveValue(10);
			await expect(currentValue).toHaveTextContent(10);

			fireEvent.change(numberInput, { target: { value: 20 } });
			await waitFor(
				async () => await expect(numberInput).toHaveValue(20),
				{ timeout: 1000 }
			);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'"width": "20px"'
					),
				{ timeout: 1000 }
			);
		});

		await step('Test Color Picker', async () => {
			await expect(buttons[0]).toBeInTheDocument(); // color

			await userEvent.click(buttons[0]);

			const input = canvas.getAllByRole('textbox')[0];

			// element shown inside popover
			await expect(input).toBeInTheDocument();

			fireEvent.change(input, { target: { value: '00B703' } });
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('"#00b703"'),
				{ timeout: 1000 }
			);

			/// Close Modal
			await expect(
				canvas.getByLabelText('Close Modal')
			).toBeInTheDocument();
			fireEvent.click(canvas.getByLabelText('Close Modal'));
			await expect(
				canvas.getByLabelText('Close Modal')
			).not.toBeVisible();
		});

		// todo add style control test in cypress implementation
	},
};

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render {...Default.args} />

			<HorizontalBorder.render {...HorizontalBorder.args} />

			<VerticalBorder.render {...VerticalBorder.args} />

			<FocusAndWidthChange.render {...FocusAndWidthChange.args} />

			<Field.render {...Field.args} />
		</Flex>
	),
};
