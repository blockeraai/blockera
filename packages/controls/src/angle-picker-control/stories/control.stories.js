/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { fireEvent, userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { default as AnglePickerControl } from '../index';
import { WithPlaygroundStyles } from '../../../../../.storybook/preview';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/AnglePickerControl',
	component: AnglePickerControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: 25,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const NoButtons = {
	args: {
		value: 25,
		rotateButtons: false,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<AnglePickerControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const Play = {
	args: {
		value: '20',
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		...SharedDecorators,
	],
	parameters: {
		jest: ['utils.spec.js'],
	},
	render: (args) => (
		<div data-testid="change-cell-test-id">
			<ControlWithHooks {...args} />
		</div>
	),
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const numberInput = canvas.getByRole('spinbutton', {
			type: 'number',
		});

		await step('Input control test', async () => {
			await expect(
				canvas.getByRole('spinbutton', {
					type: 'number',
				})
			).toBeInTheDocument();

			await expect(numberInput).toHaveValue(20);
			await expect(currentValue).toHaveTextContent(20);

			await userEvent.type(numberInput, '1{enter}');
			await expect(numberInput).toHaveValue(201);
			//await expect(numberInput).toHaveTextContent('201');

			await userEvent.type(numberInput, '{arrowdown}{enter}');
			await expect(numberInput).toHaveValue(200);
			//await expect(numberInput).toHaveTextContent('200');

			await userEvent.type(numberInput, '{arrowup}{enter}');
			await expect(numberInput).toHaveValue(201);
			//await expect(numberInput).toHaveTextContent('201');

			await userEvent.type(numberInput, '{backspace}');
			await expect(numberInput).toHaveValue(20);
			//await expect(numberInput).toHaveTextContent('20');

			await userEvent.type(numberInput, '10{enter}');
			await expect(numberInput).toHaveValue(360);
			//await expect(numberInput).toHaveTextContent('36');
		});

		await step('Rotate Buttons', async () => {
			const leftButton = canvas.getByLabelText('Rotate Left');
			await expect(leftButton).toBeInTheDocument();

			const rightButton = canvas.getByLabelText('Rotate Right');
			await expect(rightButton).toBeInTheDocument();

			await fireEvent.change(numberInput, { target: { value: 0 } });
			await fireEvent.click(leftButton);
			await fireEvent.focus(leftButton);
			await expect(numberInput).toHaveValue(315);
			//await expect(numberInput).toHaveTextContent('315');

			await fireEvent.change(numberInput, { target: { value: 0 } });
			await fireEvent.click(rightButton);
			await fireEvent.focus(rightButton);
			await expect(numberInput).toHaveValue(45);
			//await expect(numberInput).toHaveTextContent('45');
		});
	},
};

export const Screenshot = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">With Rotate Buttons</h2>
				<AnglePickerControl {...args} value="20" rotateButtons={true} />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Without Rotate Button</h2>
				<AnglePickerControl
					{...args}
					value="45"
					rotateButtons={false}
				/>
			</Flex>
		</Flex>
	),
};
