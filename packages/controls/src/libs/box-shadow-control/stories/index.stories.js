/**
 * External dependencies
 */
import { expect } from '@storybook/jest';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { BoxShadowControl } from '../../index';
import { STORE_NAME } from '../../repeater-control/store';
import { ControlContextProvider } from '../../../context';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const {
	WithInspectorStyles,
	WithStoryContextProvider,
	SharedDecorators,
	WithPopoverDataProvider,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/BoxShadowControl',
	component: BoxShadowControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Box Shadows',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Box Shadow<span>Empty</span>
			</h2>

			<ControlContextProvider
				storeName={STORE_NAME}
				value={{
					name: nanoid(),
					value: [],
				}}
			>
				<ControlWithHooks Control={BoxShadowControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const Fill = {
	args: {
		label: 'Box Shadows',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Outer</span>
					</h2>

					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'outer',
									x: '2px',
									y: '2px',
									blur: '2px',
									spread: '2px',
									color: '#0947eb',
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks
							Control={BoxShadowControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Inner</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'inner',
									x: '5px',
									y: '5px',
									blur: '5px',
									spread: '0px',
									color: '#dedede',
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks
							Control={BoxShadowControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Multiple</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'outer',
									x: '2px',
									y: '2px',
									blur: '2px',
									spread: '2px',
									color: '#0947eb',
									isVisible: true,
								},
								{
									type: 'outer',
									x: '-2px',
									y: '-2px',
									blur: '2px',
									spread: '0px',
									color: '#00762a',
									isVisible: true,
								},
								{
									type: 'inner',
									x: '5px',
									y: '5px',
									blur: '5px',
									spread: '0px',
									color: '#dedede',
									isVisible: true,
								},
							],
						}}
					>
						<ControlWithHooks
							Control={BoxShadowControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Box Shadows',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="15px"
				style={{ marginBottom: '400px' }}
			>
				<h2 className="story-heading">
					Filled<span>Open Item</span>
				</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [
							{
								type: 'outer',
								x: '2px',
								y: '2px',
								blur: '2px',
								spread: '2px',
								color: '#0947eb',
								isVisible: true,
								isOpen: true,
							},
						],
					}}
				>
					<ControlWithHooks Control={BoxShadowControl} {...args} />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const Play = {
	args: {
		label: 'Box Shadows',
		controlInfo: {
			name: nanoid(),
			value: [],
		},
		storeName: STORE_NAME,
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={BoxShadowControl} {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const button = canvas.getByLabelText('Add New');
		//
		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toHaveTextContent('[]');
		});

		await step('Click Add Button', async () => {
			await expect(button).toBeInTheDocument();

			await userEvent.click(button);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "type": "outer", "x": "0px", "y": "0px", "blur": "0px", "spread": "0px", "color": "", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Open Popover', async () => {
			await userEvent.click(canvas.getByLabelText('Item 1'));
		});

		await step('Change Input', async () => {
			const inputs = canvas.getAllByRole('textbox');

			userEvent.type(inputs[0], '{backspace}5{enter}');

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "type": "outer", "x": "5px", "y": "0px", "blur": "0px", "spread": "0px", "color": "", "isVisible": true } ]'
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
			<Empty.render {...Empty.args} />

			<Fill.render {...Fill.args} />

			<Open.render {...Open.args} />
		</Flex>
	),
};
