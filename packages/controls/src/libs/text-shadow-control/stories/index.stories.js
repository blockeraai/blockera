/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
import { useContext } from '@wordpress/element';
import { expect } from '@storybook/jest';
import { userEvent, waitFor, within } from '@storybook/testing-library';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { TextShadowControl } from '../../index';
import { STORE_NAME } from '../../repeater-control/store';
import { ControlContextProvider } from '../../../context';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
	WithPopoverDataProvider,
} = Decorators;

SharedDecorators.push(WithPopoverDataProvider);
SharedDecorators.push(WithControlDataProvider);
SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/TextShadowControl',
	component: TextShadowControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Text Shadows',
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
		label: 'Text Shadows',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Filled</h2>

				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [
							{
								x: '2px',
								y: '3px',
								blur: '4px',
								color: '#0947eb',
								isVisible: true,
							},
						],
					}}
				>
					<TextShadowControl {...args} label="Text Shadows" />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Text Shadows',
		controlInfo: {
			name: nanoid(),
			value: [],
		},
		storeName: STORE_NAME,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex
				direction="column"
				gap="30px"
				style={{ marginBottom: '300px' }}
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
								x: '2px',
								y: '3px',
								blur: '4px',
								color: '#0947eb',
								isVisible: true,
								isOpen: true,
							},
						],
					}}
				>
					<TextShadowControl {...args} label="Text Shadows" />
				</ControlContextProvider>
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<TextShadowControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const Play = {
	args: {
		label: 'Text Shadows',
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
						'[ { "x": "1px", "y": "1px", "blur": "1px", "color": "", "isVisible": true } ]'
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
						'[ { "x": "5px", "y": "1px", "blur": "1px", "color": "", "isVisible": true } ]'
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
					<TextShadowControl {...Empty.args} />
				</ControlContextProvider>
			</Flex>

			<Fill.render />

			<Open.render />
		</Flex>
	),
};
