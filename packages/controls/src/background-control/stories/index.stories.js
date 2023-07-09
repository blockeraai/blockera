/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
import { expect } from '@storybook/jest';
import { useContext } from '@wordpress/element';
import { userEvent, waitFor, within } from '@storybook/testing-library';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { BackgroundControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../.storybook/decorators/with-control-data-provider';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
	WithPopoverDataProvider,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);

export default {
	title: 'Controls/BackgroundControl',
	component: BackgroundControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Background',
		controlInfo: {
			name: nanoid(),
			value: [],
		},
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
};

export const Filled = {
	args: {
		label: 'Background',
		controlInfo: {
			name: nanoid(),
			value: {
				backgroundImage: [
					{
						type: 'image',
						image: 'https://betterstudio.com/wp-content/uploads/2022/09/publisher-theme.svg',
						isVisible: true,
					},
					{
						type: 'image',
						isVisible: true,
					},
					{
						type: 'image',
						image: 'https://betterstudio.com/wp-content/uploads/2022/09/publisher-theme.svg',
						isVisible: true,
						isOpen: true,
					},
				],
				backgroundLinearGradient: [
					{
						type: 'linear-gradient',
						'linear-gradient':
							'linear-gradient(90deg,rgb(25,0,255) 10%,rgb(230,134,0) 90%)',
						isVisible: true,
					},
					{
						type: 'linear-gradient',
						'linear-gradient':
							'linear-gradient(90deg,rgb(30,183,0) 7%,rgb(0,205,205) 90%)',
						isVisible: true,
						isOpen: true,
					},
				],
				backgroundRadialGradient: [
					{
						type: 'radial-gradient',
						'radial-gradient':
							'radial-gradient(rgb(250,0,247) 0%,rgb(255,213,0) 64%)',
						isVisible: true,
					},
					{
						type: 'radial-gradient',
						'radial-gradient':
							'radial-gradient(rgb(74,0,250) 0%,rgb(145,0,230) 100%)',
						isVisible: true,
						isOpen: true,
					},
				],
				backgroundMeshGradient: [
					{
						type: 'mesh-gradient',
						'mesh-gradient':
							'radial-gradient(at 0% 0%, var(--c0) 0px, transparent 47%),radial-gradient(at 85% 28%, var(--c1) 0px, transparent 45%),radial-gradient(at 95% 37%, var(--c2) 0px, transparent 66%),radial-gradient(at 97% 79%, var(--c3) 0px, transparent 59%)',
						'mesh-gradient-colors': [
							{
								isVisible: true,
								color: '#af4dff',
							},
							{
								isVisible: true,
								color: '#ff51f6',
							},
							{
								isVisible: true,
								color: '#3590ff',
							},
							{
								isVisible: true,
								color: '#f7ff65',
							},
						],
						isVisible: true,
					},
					{
						type: 'mesh-gradient',
						'mesh-gradient':
							'radial-gradient(at 0% 0%, var(--c0) 0px, transparent 63%),radial-gradient(at 53% 44%, var(--c1) 0px, transparent 58%),radial-gradient(at 14% 76%, var(--c2) 0px, transparent 66%),radial-gradient(at 90% 51%, var(--c3) 0px, transparent 68%),radial-gradient(at 44% 62%, var(--c4) 0px, transparent 49%),radial-gradient(at 3% 4%, var(--c5) 0px, transparent 53%)',
						'mesh-gradient-colors': [
							{
								isVisible: true,
								color: '#4d61ff',
							},
							{
								isVisible: true,
								color: '#9451ff',
							},
							{
								isVisible: true,
								color: '#35ffe7',
							},
							{
								isVisible: true,
								color: '#ffa065',
							},
							{
								isVisible: true,
								color: '#6c37ff',
							},
							{
								isVisible: true,
								color: '#73b9ff',
							},
						],
						isVisible: true,
						isOpen: true,
					},
				],
			},
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '550px' }}
				>
					<h2 className="story-heading">
						Background<span>Image</span>
					</h2>
					<BackgroundControl
						{...args}
						label="Background"
						repeaterId={'backgroundImage'}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '350px' }}
				>
					<h2 className="story-heading">
						Background<span>Linear Gradient</span>
					</h2>
					<BackgroundControl
						{...args}
						label="Background"
						repeaterId={'backgroundLinearGradient'}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '450px' }}
				>
					<h2 className="story-heading">
						Background<span>Radial Gradient</span>
					</h2>
					<BackgroundControl
						{...args}
						label="Background"
						repeaterId={'backgroundRadialGradient'}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '550px' }}
				>
					<h2 className="story-heading">
						Background<span>Mesh Gradient</span>
					</h2>
					<BackgroundControl
						{...args}
						label="Background"
						repeaterId={'backgroundMeshGradient'}
					/>
				</Flex>
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<BackgroundControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const PlayImage = {
	args: {
		label: 'Image',
	},
	decorators: [
		WithStoryContextProvider,
		WithPopoverDataProvider,
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
						'[ { "type": "image", "image": "", "image-size": "custom", "image-size-width": "auto", "image-size-height": "auto", "image-position-top": "50%", "image-position-left": "50%", "image-repeat": "repeat", "image-attachment": "scroll", "linear-gradient": "linear-gradient(90deg,#009efa 10%,#e52e00 90%)", "linear-gradient-repeat": "no-repeat", "linear-gradient-attachment": "scroll", "radial-gradient": "radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)", "radial-gradient-position-top": "50%", "radial-gradient-position-left": "50%", "radial-gradient-size": "farthest-corner", "radial-gradient-repeat": "no-repeat", "radial-gradient-attachment": "scroll", "mesh-gradient": "", "mesh-gradient-colors": [], "mesh-gradient-attachment": "scroll", "isVisible": true } ]'
					),
				{ timeout: 1000 }
			);
		});

		await step('Open Popover', async () => {
			await userEvent.click(canvas.getByLabelText('Item 1'));
		});

		await step('Change Input', async () => {
			await expect(canvas.getAllByRole('textbox')[0]).toBeInTheDocument();

			await userEvent.type(
				canvas.getAllByRole('textbox')[0],
				'{backspace}{backspace}60{enter}'
			);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'[ { "type": "image", "image": "", "image-size": "custom", "image-size-width": "auto", "image-size-height": "auto", "image-position-top": "60%", "image-repeat": "repeat", "image-attachment": "scroll", "isVisible": true } ]'
					),
				{ timeout: 2000 }
			);
		});
	},
};
PlayImage.storyName = 'Play → Image';

export const Screenshot = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty</h2>
				<BackgroundControl {...Empty.args} />
			</Flex>

			<Filled.render />
		</Flex>
	),
};
