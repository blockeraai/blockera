/**
 * External dependencies
 */
import { expect } from '@storybook/jest';
import {
	fireEvent,
	userEvent,
	waitFor,
	within,
} from '@storybook/testing-library';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { ControlContextProvider, InputControl } from '../../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

const units = [
	{ value: 'px', label: 'px', default: 0 },
	{ value: '%', label: '%', default: 10 },
	{ value: 'em', label: 'em', default: 0 },
];

export default {
	title: 'Controls/InputControl',
	component: InputControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '20',
		},
		defaultValue: '10',
	},
	render: (args) => <ControlWithHooks Control={InputControl} {...args} />,
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	parameters: {
		jest: ['input.spec.js'],
	},
};

export const TextInput = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Text Input</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					type="text"
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					type="text"
					className="is-hovered"
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					type="text"
					className="is-focused"
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					type="text"
					noBorder={true}
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					type="text"
					className="is-focused"
					noBorder={true}
					{...args}
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const NumberInput = {
	args: {
		defaultValue: '10px',
		value: '20',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Number Input</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 0,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						type="number"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 10,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						type="number"
						className="is-hovered"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 20,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						type="number"
						className="is-focused"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 30,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						type="number"
						noBorder={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 40,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						type="number"
						className="is-focused"
						noBorder={true}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Range Number Input</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 50,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						type="number"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 60,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						type="number"
						className="is-hovered"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 70,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						type="number"
						className="is-focused"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 80,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						type="number"
						noBorder={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 90,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						type="number"
						className="is-focused"
						noBorder={true}
					/>
				</ControlContextProvider>
			</Flex>
		</Flex>
	),
};

export const UnitsInput = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Units Input</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						units={units}
						type="number"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						units={units}
						type="number"
						className="is-hovered"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						units={units}
						type="number"
						className="is-focused"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						units={units}
						type="number"
						noBorder={true}
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						units={units}
						type="number"
						className="is-focused"
						noBorder={true}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Range Units Input</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						units={units}
						type="number"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						units={units}
						type="number"
						className="is-hovered"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						units={units}
						type="number"
						className="is-focused"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						units={units}
						type="number"
						noBorder={true}
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						units={units}
						type="number"
						className="is-focused"
						noBorder={true}
					/>
				</ControlContextProvider>
			</Flex>
		</Flex>
	),
};

export const CssInput = {
	args: {
		unitType: 'general',
		defaultValue: '10px',
		className: 'publisher-input',
		value: '20px',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">CSS Input</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					{...args}
					unitType="general"
				/>
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					{...args}
					unitType="general"
					value="1auto"
				/>
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					{...args}
					range={true}
					unitType="general"
				/>
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '1auto',
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					{...args}
					range={true}
					unitType="general"
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const Field = {
	args: {
		label: 'Field',
		type: 'number',
		value: '20',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">With Field</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={InputControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const PlayText = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '20px',
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithControlDataProvider,
		WithInspectorStyles,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={InputControl} {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const input = canvas.getByRole('textbox', {
			type: 'text',
		});

		await step('Story data is available', async () => {
			await expect(currentValue).toBeInTheDocument();
		});

		await step('Input control test', async () => {
			await expect(input).toBeInTheDocument();

			await expect(input).toHaveValue('20px');
			await expect(currentValue).toHaveTextContent('20px');

			fireEvent.change(input, { target: { value: '30px' } });
			await waitFor(async () => await expect(input).toHaveValue('30px'), {
				timeout: 1000,
			});
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('30px'),
				{ timeout: 1000 }
			);
		});
	},
};
PlayText.storyName = 'Play → Text';

export const PlayNumber = {
	args: {
		type: 'number',
		controlInfo: {
			name: nanoid(),
			value: '20',
		},
	},
	decorators: [
		WithInspectorStyles,
		WithStoryContextProvider,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={InputControl} {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const input = canvas.getByRole('spinbutton', {
			type: 'number',
		});

		await step('Story data is available', async () => {
			await expect(currentValue).toBeInTheDocument();
		});

		await step('Input control test', async () => {
			await expect(input).toBeInTheDocument();

			await expect(input).toHaveValue(20);
			await expect(currentValue).toHaveTextContent('20');

			// type 30
			fireEvent.change(input, {
				target: {
					value: '30',
				},
			});
			await waitFor(
				async () => {
					await expect(input).toHaveValue(30);
					await expect(currentValue).toHaveTextContent('30');
				},
				{ timeout: 1000 }
			);
		});
	},
};
PlayNumber.storyName = 'Play → Number';

export const PlayUnits = {
	args: {
		type: 'css',
		unitType: 'general',
		controlInfo: {
			name: nanoid(),
			value: '20px',
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={InputControl} {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const input = canvas.getByRole('textbox', {
			type: 'number',
		});
		const select = canvas.getByRole('combobox', {});

		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
		});

		await step('Input Change', async () => {
			await expect(input).toBeInTheDocument();

			await expect(input).toHaveValue('20');
			await expect(currentValue).toHaveTextContent('20px');

			// type 30px, control should not accept strings
			userEvent.type(input, '{backspace}{backspace}30{enter}');
			await expect(input).toHaveValue('30');
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('30px'),
				{ timeout: 1000 }
			);

			// reset value
			fireEvent.change(input, { target: { value: '20' } });
			await expect(input).toHaveValue('20');
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('20px'),
				{ timeout: 1000 }
			);
		});

		await step('Change Unit', async () => {
			await expect(select).toBeInTheDocument();

			// change unit to %
			fireEvent.change(select, {
				target: { value: '%' },
			});
			await expect(input).toHaveValue('20');
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('20%'),
				{ timeout: 1000 }
			);

			// change unit to Auto
			fireEvent.change(select, {
				target: { value: 'auto' },
			});
			await expect(input).toHaveValue('20');
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('20auto'),
				{ timeout: 1000 }
			);

			// back to px
			fireEvent.change(select, {
				target: { value: 'px' },
			});
			await expect(input).toHaveValue('20');
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('20px'),
				{ timeout: 1000 }
			);
		});
	},
};
PlayUnits.storyName = 'Play → Units';

export const Screenshot = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<TextInput.render {...TextInput.args} />

			<NumberInput.render {...NumberInput.args} />

			<UnitsInput.render {...UnitsInput.args} />

			<CssInput.render {...CssInput.args} />

			<Field.render {...Field.args} />
		</Flex>
	),
};
