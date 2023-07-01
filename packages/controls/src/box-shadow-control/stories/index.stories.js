/**
 * External dependencies
 */
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
import { BoxShadowControl } from '../../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

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
					<BoxShadowControl
						{...args}
						value={[
							{
								type: 'outer',
								x: '2px',
								y: '2px',
								blur: '2px',
								spread: '2px',
								color: '#0947eb',
								isVisible: true,
							},
						]}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Inner</span>
					</h2>
					<BoxShadowControl
						{...args}
						value={[
							{
								type: 'inner',
								x: '5px',
								y: '5px',
								blur: '5px',
								spread: '0px',
								color: '#dedede',
								isVisible: true,
							},
						]}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Multiple</span>
					</h2>
					<BoxShadowControl
						{...args}
						value={[
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
						]}
					/>
				</Flex>
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<BoxShadowControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const Play = {
	args: {
		label: 'Box Shadows',
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

export const Screenshot = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty</h2>
				<BoxShadowControl {...Empty.args} />
			</Flex>

			<Fill.render />
		</Flex>
	),
};
