/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
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
import { OutlineControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import { STORE_NAME } from '../../repeater-control/store';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/OutlineControl',
	component: OutlineControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Outline',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Outline<span>Empty</span>
			</h2>

			<ControlContextProvider
				storeName={STORE_NAME}
				value={{
					name: nanoid(),
					value: [],
				}}
			>
				<OutlineControl {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const Fill = {
	args: {
		label: 'Outline',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Solid</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: [
								{
									width: '1px',
									style: 'solid',
									color: '#0947eb',
									offset: '1px',
									isVisible: true,
								},
							],
						}}
						storeName={STORE_NAME}
					>
						<OutlineControl {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Dashed</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: [
								{
									width: '2px',
									style: 'dashed',
									color: '#008461',
									offset: '2px',
									isVisible: true,
								},
							],
						}}
						storeName={STORE_NAME}
					>
						<OutlineControl {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Dotted</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: [
								{
									width: '3px',
									style: 'dotted',
									color: '#2b00ae',
									offset: '3px',
									isVisible: true,
								},
							],
						}}
						storeName={STORE_NAME}
					>
						<OutlineControl {...args} />
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Double</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: [
								{
									width: '4px',
									style: 'double',
									color: '#ab3a00',
									offset: '4px',
									isVisible: true,
								},
							],
						}}
						storeName={STORE_NAME}
					>
						<OutlineControl {...args} storeName={STORE_NAME} />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginTop: '50px', marginBottom: '200px' }}
				>
					<h2 className="story-heading">Open</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: [
								{
									width: '4px',
									style: 'double',
									color: '#ab3a00',
									offset: '4px',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
						storeName={STORE_NAME}
					>
						<OutlineControl {...args} />
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Play = {
	args: {
		label: 'Outline',
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
	render: (args) => <ControlWithHooks Control={OutlineControl} {...args} />,
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
						'[ { "width": "2px", "style": "solid", "color": "#b6b6b6", "offset": "2px", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Open Popover', async () => {
			// open popover
			await userEvent.click(canvas.getByLabelText('Item 1'));
		});

		await step('Edit Offset', async () => {
			await expect(
				canvas.getByRole('textbox', { type: 'number' })
			).toBeInTheDocument();

			fireEvent.change(canvas.getByRole('textbox', { type: 'number' }), {
				target: {
					value: 10,
				},
			});

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "width": "2px", "style": "solid", "color": "#b6b6b6", "offset": "10px", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Delete', async () => {
			await expect(canvas.getByLabelText('Delete 1')).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Delete 1'));

			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('[]'),
				{ timeout: 1000 }
			);
		});
	},
};

export const Screenshot = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Empty.render {...Empty.args} />

			<Fill.render {...Fill.args} />
		</Flex>
	),
};
