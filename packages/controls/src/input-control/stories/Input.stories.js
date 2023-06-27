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

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { InputControl } from '../../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

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
			<InputControl type="text" {...args} />
			<InputControl type="text" className="is-hovered" {...args} />
			<InputControl type="text" className="is-focused" {...args} />
			<InputControl type="text" noBorder={true} {...args} />
			<InputControl
				type="text"
				className="is-focused"
				noBorder={true}
				{...args}
			/>
		</Flex>
	),
};

export const NumberInput = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Number Input</h2>
				<InputControl {...args} type="number" value="20" />
				<InputControl
					{...args}
					type="number"
					value="20"
					className="is-hovered"
				/>
				<InputControl
					{...args}
					type="number"
					value="20"
					className="is-focused"
				/>
				<InputControl
					{...args}
					type="number"
					value="20"
					noBorder={true}
				/>
				<InputControl
					{...args}
					type="number"
					className="is-focused"
					value="20"
					noBorder={true}
				/>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Range Number Input</h2>
				<InputControl {...args} range={true} type="number" value="20" />
				<InputControl
					{...args}
					range={true}
					type="number"
					value="20"
					className="is-hovered"
				/>
				<InputControl
					{...args}
					range={true}
					type="number"
					value="20"
					className="is-focused"
				/>
				<InputControl
					{...args}
					range={true}
					type="number"
					value="20"
					noBorder={true}
				/>
				<InputControl
					{...args}
					range={true}
					type="number"
					className="is-focused"
					value="20"
					noBorder={true}
				/>
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
				<InputControl {...args} units={units} type="number" />
				<InputControl
					{...args}
					units={units}
					type="number"
					className="is-hovered"
				/>
				<InputControl
					{...args}
					units={units}
					type="number"
					className="is-focused"
				/>
				<InputControl
					{...args}
					units={units}
					type="number"
					noBorder={true}
				/>
				<InputControl
					{...args}
					units={units}
					type="number"
					className="is-focused"
					noBorder={true}
				/>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Range Units Input</h2>
				<InputControl
					{...args}
					range={true}
					units={units}
					type="number"
				/>
				<InputControl
					{...args}
					range={true}
					units={units}
					type="number"
					className="is-hovered"
				/>
				<InputControl
					{...args}
					range={true}
					units={units}
					type="number"
					className="is-focused"
				/>
				<InputControl
					{...args}
					range={true}
					units={units}
					type="number"
					noBorder={true}
				/>
				<InputControl
					{...args}
					range={true}
					units={units}
					type="number"
					className="is-focused"
					noBorder={true}
				/>
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
			<InputControl {...args} unitType="general" />
			<InputControl {...args} unitType="general" value="1auto" />
			<InputControl {...args} range={true} unitType="general" />
			<InputControl
				{...args}
				range={true}
				unitType="general"
				value="1auto"
			/>
		</Flex>
	),
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<InputControl {...args} onChange={setStoryValue} value={storyValue} />
	);
};

export const PlayText = {
	args: {
		value: '20px',
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
		value: '20',
		type: 'number',
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
		value: '20px',
		type: 'css',
		unitType: 'general',
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
