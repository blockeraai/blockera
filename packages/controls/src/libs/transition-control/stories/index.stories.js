/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
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
import TransitionControl from '../index';
import { STORE_NAME } from '../../repeater-control/store';
import { ControlContextProvider } from '../../../context';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

export default {
	title: 'Controls/TransitionControl',
	component: TransitionControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Transitions',
		controlInfo: {
			name: nanoid(),
			value: [],
		},
		storeName: STORE_NAME,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Fill = {
	args: {
		label: 'Transitions',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Filled</h2>

				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [
							{
								type: 'all',
								duration: '250ms',
								timing: 'ease',
								delay: '10ms',
								isVisible: true,
							},
							{
								type: 'opacity',
								duration: '600ms',
								timing: 'ease',
								delay: '0ms',
								isVisible: true,
							},
						],
					}}
				>
					<TransitionControl {...args} label="Transitions" />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Transitions',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="15px"
				style={{ marginBottom: '250px' }}
			>
				<h2 className="story-heading">Filled</h2>

				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [
							{
								type: 'all',
								duration: '250ms',
								timing: 'ease',
								delay: '10ms',
								isVisible: true,
								isOpen: true,
							},
							{
								type: 'opacity',
								duration: '600ms',
								timing: 'ease',
								delay: '0ms',
								isVisible: true,
							},
						],
					}}
				>
					<TransitionControl {...args} label="Transitions" />
				</ControlContextProvider>
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<TransitionControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const Play = {
	args: {
		label: 'Transitions',
		controlInfo: {
			name: nanoid(),
			value: [],
		},
		storeName: STORE_NAME,
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
		const button = canvas.getByLabelText('Add New');
		//
		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toBeEmptyDOMElement();
		});

		await step('Click Add Button', async () => {
			await expect(button).toBeInTheDocument();

			await userEvent.click(button);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "type": "all", "duration": "500ms", "timing": "ease", "delay": "0ms", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Open Popover', async () => {
			await userEvent.click(canvas.getByLabelText('Item 1'));
		});

		await step('Change Duration', async () => {
			const inputs = canvas.getAllByRole('textbox');

			userEvent.type(
				inputs[0],
				'{backspace}{backspace}{backspace}100{enter}'
			);

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "type": "all", "duration": "100ms", "timing": "ease", "delay": "0ms", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Change Type', async () => {
			const selects = canvas.getAllByRole('combobox', {});

			fireEvent.change(selects[0], {
				target: { value: 'opacity' },
			});

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "type": "opacity", "duration": "100ms", "timing": "ease", "delay": "0ms", "isVisible": true } ]'
					),
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
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [],
					}}
				>
					<TransitionControl {...Empty.args} />
				</ControlContextProvider>
			</Flex>

			<Fill.render />

			<Open.render />
		</Flex>
	),
};
