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
import FilterControl from '../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

export default {
	title: 'Controls/FilterControl',
	component: FilterControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Filters',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Fill = {
	args: {
		label: 'Filters',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Filled</h2>
					<FilterControl
						{...args}
						label="Filters"
						value={[
							{
								type: 'blur',
								blur: '10px',
								isVisible: true,
							},
							{
								type: 'drop-shadow',
								'drop-shadow-x': '20px',
								'drop-shadow-y': '20px',
								'drop-shadow-blur': '20px',
								'drop-shadow-color': '#0947eb',
								isVisible: true,
							},
							{
								type: 'brightness',
								brightness: '30%',
								isVisible: true,
							},
							{
								type: 'contrast',
								contrast: '40%',
								isVisible: true,
							},
							{
								type: 'hue-rotate',
								'hue-rotate': '50deg',
								isVisible: true,
							},
							{
								type: 'saturate',
								saturate: '60%',
								isVisible: true,
							},
							{
								type: 'grayscale',
								grayscale: '70%',
								isVisible: true,
							},
							{
								type: 'invert',
								invert: '80%',
								isVisible: true,
							},
							{
								type: 'sepia',
								sepia: '90%',
								isVisible: true,
							},
						]}
					/>
				</Flex>
			</Flex>
		);
	},
};

export const Open = {
	args: {
		label: 'Filters',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Blur</span>
					</h2>
					<FilterControl
						{...args}
						label="Filters"
						value={[
							{
								type: 'blur',
								blur: '10px',
								isVisible: true,
								isOpen: true,
							},
						]}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '300px' }}
				>
					<h2 className="story-heading">
						Open<span>Drop Shadow</span>
					</h2>
					<FilterControl
						{...args}
						label="Filters"
						value={[
							{
								type: 'drop-shadow',
								'drop-shadow-x': '20px',
								'drop-shadow-y': '20px',
								'drop-shadow-blur': '20px',
								'drop-shadow-color': '#0947eb',
								isVisible: true,
								isOpen: true,
							},
						]}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Brightness</span>
					</h2>
					<FilterControl
						{...args}
						label="Filters"
						value={[
							{
								type: 'brightness',
								brightness: '30%',
								isVisible: true,
								isOpen: true,
							},
						]}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Contrast</span>
					</h2>
					<FilterControl
						{...args}
						label="Filters"
						value={[
							{
								type: 'contrast',
								contrast: '40%',
								isVisible: true,
								isOpen: true,
							},
						]}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Hue Rotate</span>
					</h2>
					<FilterControl
						{...args}
						label="Filters"
						value={[
							{
								type: 'hue-rotate',
								'hue-rotate': '50deg',
								isVisible: true,
								isOpen: true,
							},
						]}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Saturate</span>
					</h2>
					<FilterControl
						{...args}
						label="Filters"
						value={[
							{
								type: 'saturate',
								saturate: '60%',
								isVisible: true,
								isOpen: true,
							},
						]}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Grayscale</span>
					</h2>
					<FilterControl
						{...args}
						label="Filters"
						value={[
							{
								type: 'grayscale',
								grayscale: '70%',
								isVisible: true,
								isOpen: true,
							},
						]}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Invert</span>
					</h2>
					<FilterControl
						{...args}
						label="Filters"
						value={[
							{
								type: 'invert',
								invert: '80%',
								isVisible: true,
								isOpen: true,
							},
						]}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '180px' }}
				>
					<h2 className="story-heading">
						Open<span>Sepia</span>
					</h2>
					<FilterControl
						{...args}
						label="Filters"
						value={[
							{
								type: 'sepia',
								sepia: '90%',
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
		<FilterControl {...args} onChange={setStoryValue} value={storyValue} />
	);
};

export const Play = {
	args: {
		label: 'Filters',
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
						'[ { "type": "blur", "blur": "3px", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Open Popover', async () => {
			await userEvent.click(canvas.getByLabelText('Item 1'));
		});

		await step('Change Value', async () => {
			const inputs = canvas.getAllByRole('textbox');

			fireEvent.change(inputs[0], {
				target: {
					value: 10,
				},
			});

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "type": "blur", "blur": "10px", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Change Type', async () => {
			const selects = canvas.getAllByRole('combobox', {});

			fireEvent.change(selects[0], {
				target: { value: 'brightness' },
			});

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "type": "brightness", "brightness": "200%", "isVisible": true } ]'
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
				<FilterControl {...Empty.args} />
			</Flex>

			<Fill.render />

			<Open.render />
		</Flex>
	),
};
