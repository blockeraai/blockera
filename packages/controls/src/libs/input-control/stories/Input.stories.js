/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
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
import {
	ControlContextProvider,
	InputControl,
	useControlContext,
} from '../../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

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
		defaultValue: '10',
		value: '20',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
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
				<ControlWithHooks type="text" {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
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
				<ControlWithHooks type="text" noBorder={true} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
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
					<ControlWithHooks {...args} type="number" />
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 10,
					}}
				>
					<ControlWithHooks
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
					<ControlWithHooks {...args} type="number" noBorder={true} />
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 40,
					}}
				>
					<ControlWithHooks
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
					<ControlWithHooks {...args} range={true} type="number" />
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 60,
					}}
				>
					<ControlWithHooks
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
					<ControlWithHooks {...args} units={units} type="number" />
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
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
				<ControlWithHooks {...args} unitType="general" />
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks {...args} unitType="general" value="1auto" />
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks {...args} range={true} unitType="general" />
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '1auto',
				}}
			>
				<ControlWithHooks {...args} range={true} unitType="general" />
			</ControlContextProvider>
		</Flex>
	),
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);
	const {
		value,
		controlInfo: { name: controlId },
		dispatch: { modifyControlValue },
		// eslint-disable-next-line
	} = useControlContext();

	return (
		<InputControl
			{...args}
			value={storyValue ? storyValue : value}
			onChange={(newValue) => {
				setStoryValue(newValue);
				modifyControlValue({
					controlId,
					value: newValue,
				});
			}}
		/>
	);
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
	render: (args) => <ControlWithHooks {...args} />,
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
			await expect(input).toHaveValue('30px');
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
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks {...args} />,
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

			// type 30px, control should not accept strings
			userEvent.type(input, '{backspace}{backspace}30px{enter}');
			await expect(input).toHaveValue(30);
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('30'),
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
	render: (args) => <ControlWithHooks {...args} />,
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
	render: (args) => (
		<Flex direction="column" gap="50px">
			<TextInput.render {...args} />

			<NumberInput.render {...args} />

			<UnitsInput.render {...args} />

			<CssInput.render {...args} />
		</Flex>
	),
};
