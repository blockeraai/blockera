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
import { TransformControl } from '../../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

export default {
	title: 'Controls/TransformControl',
	component: TransformControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Transforms',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Fill = {
	args: {
		label: 'Transforms',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Filled</h2>
					<TransformControl
						{...args}
						value={[
							{
								type: 'move',
								'move-x': '10px',
								'move-y': '10px',
								'move-z': '10px',
								isVisible: true,
							},
							{
								type: 'scale',
								scale: '20%',
								isVisible: true,
							},
							{
								type: 'rotate',
								'rotate-x': '30deg',
								'rotate-y': '30deg',
								'rotate-z': '30deg',
								isVisible: true,
							},
							{
								type: 'skew',
								'skew-x': '40deg',
								'skew-y': '40deg',
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
		<TransformControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const Play = {
	args: {
		label: 'Transforms',
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
						'[ { "type": "move", "move-x": "0px", "move-y": "0px", "move-z": "0px", "scale": "100%", "rotate-x": "0deg", "rotate-y": "0deg", "rotate-z": "0deg", "skew-x": "0deg", "skew-y": "0deg", "isVisible": true } ]'
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
						'[ { "type": "move", "move-x": "5px", "move-y": "0px", "move-z": "0px", "scale": "100%", "rotate-x": "0deg", "rotate-y": "0deg", "rotate-z": "0deg", "skew-x": "0deg", "skew-y": "0deg", "isVisible": true } ]'
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
				<TransformControl {...Empty.args} />
			</Flex>

			<Fill.render />
		</Flex>
	),
};
