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

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { AnglePickerControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { nanoid } from 'nanoid';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/AnglePickerControl',
	component: AnglePickerControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: 25,
		rotateButtons: false,
	},
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">With Rotate Button</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={AnglePickerControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const NoButtons = {
	args: {
		value: 25,
		rotateButtons: false,
	},
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Without Rotate Button</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={AnglePickerControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Field = {
	args: {
		label: 'Angle Picker',
		value: 45,
		rotateButtons: true,
	},
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">With Field</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={AnglePickerControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Play = {
	args: {
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
	parameters: {
		jest: ['utils.spec.js'],
	},
	render: (args) => (
		<div data-testid="change-cell-test-id">
			<ControlWithHooks Control={AnglePickerControl} {...args} />
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
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('201'),
				{ timeout: 1000 }
			);

			await userEvent.type(numberInput, '{arrowdown}{enter}');
			await expect(numberInput).toHaveValue(200);
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('200'),
				{ timeout: 1000 }
			);

			await userEvent.type(numberInput, '{arrowup}{enter}');
			await expect(numberInput).toHaveValue(201);
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('201'),
				{ timeout: 1000 }
			);

			await userEvent.type(numberInput, '{backspace}');
			await expect(numberInput).toHaveValue(20);
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('20'),
				{ timeout: 1000 }
			);

			await userEvent.type(numberInput, '10{enter}');
			await expect(numberInput).toHaveValue(360);
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('36'),
				{ timeout: 1000 }
			);
		});

		await step('Rotate Buttons', async () => {
			const leftButton = canvas.getByLabelText('Rotate Left');
			await expect(leftButton).toBeInTheDocument();

			const rightButton = canvas.getByLabelText('Rotate Right');
			await expect(rightButton).toBeInTheDocument();

			// noinspection ES6RedundantAwait
			await fireEvent.change(numberInput, { target: { value: 0 } });
			await userEvent.click(leftButton);
			fireEvent.focus(leftButton);
			await expect(numberInput).toHaveValue(315);
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('315'),
				{ timeout: 1000 }
			);

			// noinspection ES6RedundantAwait
			await fireEvent.change(numberInput, { target: { value: 0 } });
			await userEvent.click(rightButton);
			fireEvent.focus(rightButton);
			await expect(numberInput).toHaveValue(45);
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('45'),
				{ timeout: 1000 }
			);
		});
	},
};

export const All = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render {...Default.args} />

			<NoButtons.render {...NoButtons.args} />

			<Field.render {...Field.args} />
		</Flex>
	),
};
