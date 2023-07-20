/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { expect } from '@storybook/jest';
import { waitFor, userEvent, within } from '@storybook/testing-library';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { default as AlignmentMatrixControl } from '../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { ControlContextProvider } from '../../../context';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);

export default {
	title: 'Controls/AlignmentMatrixControl',
	component: AlignmentMatrixControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		inputFields: false,
		controlInfo: {
			name: nanoid(),
			value: {
				top: '50%',
				left: '50%',
			},
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const CustomSize = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: {
				top: '50%',
				left: '50%',
			},
		},
		size: 100,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<AlignmentMatrixControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const Play = {
	args: {
		inputFields: true,
		controlInfo: {
			name: nanoid(),
			value: {
				top: '50%',
				left: '50%',
			},
		},
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

		const cells = canvas.getByTestId('change-cell-test-id');

		await step('change grid cells', async () => {
			// Top Left
			await userEvent.click(
				cells.querySelectorAll('span[role="gridcell"]')[0]
			);
			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value')
					).toHaveTextContent('{ "top": "0%", "left": "0%" }');
				},
				{ timeout: 1000 }
			);

			// Top Center
			await userEvent.click(
				cells.querySelectorAll('span[role="gridcell"]')[1]
			);
			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value')
					).toHaveTextContent('{ "top": "0%", "left": "50%" }');
				},
				{ timeout: 1000 }
			);

			// Top Right
			await userEvent.click(
				cells.querySelectorAll('span[role="gridcell"]')[2]
			);
			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value')
					).toHaveTextContent('{ "top": "0%", "left": "100%" }');
				},
				{ timeout: 1000 }
			);

			// Center Left
			await userEvent.click(
				cells.querySelectorAll('span[role="gridcell"]')[3]
			);
			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value')
					).toHaveTextContent('{ "top": "50%", "left": "0%" }');
				},
				{ timeout: 1000 }
			);

			// Center, Center
			await userEvent.click(
				cells.querySelectorAll('span[role="gridcell"]')[4]
			);
			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value')
					).toHaveTextContent('{ "top": "50%", "left": "50%" }');
				},
				{ timeout: 1000 }
			);

			// Center, Right
			await userEvent.click(
				cells.querySelectorAll('span[role="gridcell"]')[5]
			);
			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value')
					).toHaveTextContent('{ "top": "50%", "left": "100%" }');
				},
				{ timeout: 1000 }
			);

			// Bottom Left
			await userEvent.click(
				cells.querySelectorAll('span[role="gridcell"]')[6]
			);
			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value')
					).toHaveTextContent('{ "top": "100%", "left": "0%" }');
				},
				{ timeout: 1000 }
			);

			// Bottom Center
			await userEvent.click(
				cells.querySelectorAll('span[role="gridcell"]')[7]
			);
			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value')
					).toHaveTextContent('{ "top": "100%", "left": "50%" }');
				},
				{ timeout: 1000 }
			);

			// Bottom Right
			await userEvent.click(
				cells.querySelectorAll('span[role="gridcell"]')[8]
			);
			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value')
					).toHaveTextContent('{ "top": "100%", "left": "100%" }');
				},
				{ timeout: 1000 }
			);
		});

		await step('Change Top Input', async () => {
			// Top Left
			await userEvent.type(
				canvas.getAllByRole('textbox')[0],
				'{backspace}5'
			);
			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value')
					).toHaveTextContent('{ "top": "55%", "left": "50%" }');
				},
				{ timeout: 1000 }
			);
		});

		await step('Change Left Input', async () => {
			// Top Left
			await userEvent.type(
				canvas.getAllByRole('textbox')[1],
				'{backspace}5'
			);
			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value')
					).toHaveTextContent('{ "top": "55%", "left": "55%" }');
				},
				{ timeout: 1000 }
			);
		});
	},
};

export const Screenshot = {
	args: {
		value: 'center center',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">With Input</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '50%' },
					}}
				>
					<AlignmentMatrixControl {...args} inputFields={true} />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">With Field</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '50%' },
					}}
				>
					<AlignmentMatrixControl
						{...args}
						inputFields={true}
						label="Position"
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Custom Size</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '50%' },
					}}
				>
					<AlignmentMatrixControl {...args} size="50" />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Top Left</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '0%', left: '0%' },
					}}
				>
					<AlignmentMatrixControl {...args} />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Top Center</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '0%', left: '50%' },
					}}
				>
					<AlignmentMatrixControl {...args} value="top center" />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Top Right</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '0%', left: '100%' },
					}}
				>
					<AlignmentMatrixControl {...args} value="top right" />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Center Left</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '0%' },
					}}
				>
					<AlignmentMatrixControl {...args} value="center left" />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Center Center</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '50%' },
					}}
				>
					<AlignmentMatrixControl {...args} value="center center" />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Center Right</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '50%', left: '100%' },
					}}
				>
					<AlignmentMatrixControl {...args} value="center right" />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Bottom Left</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '100%', left: '0%' },
					}}
				>
					<AlignmentMatrixControl {...args} value="bottom left" />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Bottom Center</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '100%', left: '50%' },
					}}
				>
					<AlignmentMatrixControl {...args} value="bottom center" />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Bottom Right</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: { top: '100%', left: '100%' },
					}}
				>
					<AlignmentMatrixControl {...args} value="bottom right" />
				</ControlContextProvider>
			</Flex>
		</Flex>
	),
};
