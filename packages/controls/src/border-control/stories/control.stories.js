/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import {
	fireEvent,
	userEvent,
	waitFor,
	within,
} from '@storybook/testing-library';
import { expect } from '@storybook/jest';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { BorderControl } from '../../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

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
			<BorderControl {...args} />
			<BorderControl {...args} value={{}} />
			<BorderControl
				{...args}
				value={{ ...args.value, style: 'dashed' }}
			/>
			<BorderControl
				{...args}
				value={{ ...args.value, style: 'dotted' }}
			/>
			<BorderControl
				{...args}
				value={{ ...args.value, style: 'double' }}
			/>
			<BorderControl {...args} style={{ width: '91px' }} />
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
			<BorderControl {...args} />
			<BorderControl {...args} value={{}} />
			<BorderControl
				{...args}
				value={{ ...args.value, style: 'dashed' }}
			/>
			<BorderControl
				{...args}
				value={{ ...args.value, style: 'dotted' }}
			/>
			<BorderControl
				{...args}
				value={{ ...args.value, style: 'double' }}
			/>
			<BorderControl {...args} style={{ width: '91px' }} />
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
			<BorderControl {...args} __isWidthFocused={true} />
			<BorderControl
				{...args}
				__isWidthFocused={true}
				style={{ width: '91px' }}
			/>
			<BorderControl {...args} __isColorFocused={true} />
			<BorderControl
				{...args}
				__isColorFocused={true}
				style={{ width: '91px' }}
			/>
			<BorderControl {...args} __isStyleFocused={true} />
			<BorderControl
				{...args}
				__isStyleFocused={true}
				style={{ width: '91px' }}
			/>
		</Flex>
	),
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<BorderControl {...args} onChange={setStoryValue} value={storyValue} />
	);
};

export const Play = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
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
			await expect(numberInput).toHaveValue(20);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						"width: '20px'"
					),
				{ timeout: 1000 }
			);
		});

		await step('Test Color Picker', async () => {
			await expect(buttons[0]).toBeInTheDocument(); // color
			// Todo: write color picker tests after fixing the popover bug in Storybook
		});

		await step('Input control test', async () => {
			await expect(buttons[1]).toBeInTheDocument(); // custom select

			// change item to dashed
			await userEvent.click(buttons[1]);
			await userEvent.click(canvas.getAllByRole('option')[1]);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						"style: 'dashed'"
					),
				{ timeout: 1000 }
			);
		});
	},
};

export const Screenshot = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<HorizontalBorder.render {...HorizontalBorder.args} />
			<VerticalBorder.render {...VerticalBorder.args} />
			<FocusAndWidthChange.render {...FocusAndWidthChange.args} />
		</Flex>
	),
};
