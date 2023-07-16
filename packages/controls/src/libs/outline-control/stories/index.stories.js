/**
 * External dependencies
 */
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
import { OutlineControl } from '../../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

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
					<OutlineControl
						{...args}
						value={[
							{
								width: '1px',
								style: 'solid',
								color: '#0947eb',
								offset: '1px',
								isVisible: true,
							},
						]}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Dashed</span>
					</h2>
					<OutlineControl
						{...args}
						value={[
							{
								width: '2px',
								style: 'dashed',
								color: '#008461',
								offset: '2px',
								isVisible: true,
							},
						]}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Dotted</span>
					</h2>
					<OutlineControl
						{...args}
						value={[
							{
								width: '3px',
								style: 'dotted',
								color: '#2b00ae',
								offset: '3px',
								isVisible: true,
							},
						]}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Filled<span>Double</span>
					</h2>
					<OutlineControl
						{...args}
						value={[
							{
								width: '4px',
								style: 'double',
								color: '#ab3a00',
								offset: '4px',
								isVisible: true,
							},
						]}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginTop: '50px', marginBottom: '200px' }}
				>
					<h2 className="story-heading">Open</h2>
					<OutlineControl
						{...args}
						value={[
							{
								width: '4px',
								style: 'double',
								color: '#ab3a00',
								offset: '4px',
								isVisible: true,
								isOpen: true,
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
		<OutlineControl {...args} onChange={setStoryValue} value={storyValue} />
	);
};

export const Play = {
	args: {
		label: 'Outline',
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
			<OutlineControl {...Empty.args} />

			<Fill.render />
		</Flex>
	),
};
