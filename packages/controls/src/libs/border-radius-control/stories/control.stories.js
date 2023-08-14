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
import { BorderRadiusControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;
SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/BorderRadiusControl',
	component: BorderRadiusControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		label: 'Border Radius',
		value: {
			type: 'all',
			all: '5px',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Border Radius<span>Empty</span>
			</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={BorderRadiusControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const AllCorners = {
	args: {
		label: 'Border Radius',
		value: {
			type: 'all',
			all: '10px',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">All Borders</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderRadiusControl}
					{...args}
					label="All"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {},
				}}
			>
				<ControlWithHooks
					Control={BorderRadiusControl}
					{...args}
					label="Empty"
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const CustomCorners = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Custom Corners</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {
						type: 'custom',
						all: '10px',
						topLeft: '10px',
						topRight: '10px',
						bottomRight: '10px',
						bottomLeft: '10px',
					},
				}}
			>
				<ControlWithHooks
					Control={BorderRadiusControl}
					{...args}
					label="All Same"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {
						type: 'custom',
						all: '10%',
						topLeft: '10%',
						topRight: '50%',
						bottomRight: '10%',
						bottomLeft: '50%',
					},
				}}
			>
				<ControlWithHooks
					Control={BorderRadiusControl}
					{...args}
					label="Customized"
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const PlayAll = {
	args: {
		label: 'Border Radius',
		controlInfo: {
			name: nanoid(),
			value: {
				type: 'all',
				all: '10px',
			},
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<ControlWithHooks Control={BorderRadiusControl} {...args} />
	),
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const numberInput = canvas.getByRole('textbox', {
			type: 'css',
		});
		const buttons = canvas.getAllByRole('button'); // color picker +  custom select

		await step('Story data is available', async () => {
			await expect(currentValue).toBeInTheDocument();
		});

		await step('Input control test', async () => {
			await expect(numberInput).toBeInTheDocument();

			await expect(numberInput).toHaveValue('10');
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "all", "all": "10px" }'
					),
				{ timeout: 1000 }
			);

			fireEvent.change(numberInput, { target: { value: 20 } });
			await expect(numberInput).toHaveValue('20');
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "all", "all": "20px" }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Change to custom corner', async () => {
			await expect(buttons[1]).toBeInTheDocument(); // custom select

			await userEvent.click(buttons[1]);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "custom", "all": "20px", "topLeft": "20px", "topRight": "20px", "bottomLeft": "20px", "bottomRight": "20px" }'
					),
				{ timeout: 1000 }
			);

			// change item to all corners
			await userEvent.click(buttons[0]);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "all", "all": "20px" }'
					),
				{ timeout: 1000 }
			);
		});
	},
};
PlayAll.storyName = 'Play → All Corners';

export const PlayCorner = {
	args: {
		label: 'Border Line',
		controlInfo: {
			name: nanoid(),
			value: {
				type: 'custom',
				all: '10px',
				topLeft: '10px',
				topRight: '10px',
				bottomRight: '10px',
				bottomLeft: '10px',
			},
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<ControlWithHooks Control={BorderRadiusControl} {...args} />
	),
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const numberInput = canvas.getAllByRole('textbox', {
			type: 'css',
		});
		const buttons = canvas.getAllByRole('button');

		await step('Story data is available', async () => {
			await expect(currentValue).toBeInTheDocument();
		});

		await step('Check default value', async () => {
			await expect(numberInput[1]).toBeInTheDocument();

			await expect(numberInput[1]).toHaveValue('10');
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "custom", "all": "10px", "topLeft": "10px", "topRight": "10px", "bottomRight": "10px", "bottomLeft": "10px" }'
					),
				{ timeout: 1000 }
			);

			fireEvent.change(numberInput[1], { target: { value: 20 } });
			await expect(numberInput[1]).toHaveValue('20');
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "custom", "all": "10px", "topLeft": "10px", "topRight": "20px", "bottomLeft": "10px", "bottomRight": "10px" }'
					),
				{ timeout: 1000 }
			);

			fireEvent.change(numberInput[2], { target: { value: '50' } });
			fireEvent.change(canvas.getAllByLabelText('Select unit')[2], {
				target: { value: '%' },
			});
			await expect(numberInput[2]).toHaveValue('50');
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "custom", "all": "10px", "topLeft": "10px", "topRight": "20px", "bottomLeft": "50%", "bottomRight": "10px" }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Change back to all corners', async () => {
			// change item to all corners
			await userEvent.click(buttons[0]);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "all", "all": "10px" }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Change back to custom corners', async () => {
			// change item to all corners
			await userEvent.click(buttons[1]);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "custom", "all": "10px", "topLeft": "10px", "topRight": "10px", "bottomLeft": "10px", "bottomRight": "10px" }'
					),
				{ timeout: 1000 }
			);
		});
	},
};
PlayCorner.storyName = 'Play → Custom Corners';

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<AllCorners.render {...AllCorners.args} />

			<CustomCorners.render {...CustomCorners.args} />
		</Flex>
	),
};
