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
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import BoxPositionControl from '../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
	WithPopoverDataProvider,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/BoxPositionControl',
	component: BoxPositionControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Position',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
};

export const FilledRelative = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Relative<span>Empty</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'relative',
							position: {
								top: '',
								right: '',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Relative<span>All PX</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'relative',
							position: {
								top: '10px',
								right: '20px',
								bottom: '30px',
								left: '40px',
							},
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Relative<span>Custom Units</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'relative',
							position: {
								top: '10px',
								right: '20%',
								bottom: '30vh',
								left: '40dvh',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Relative<span>Open Top</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="top"
						value={{
							type: 'relative',
							position: {
								top: '10px',
								right: '',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Relative<span>Open Right</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="right"
						value={{
							type: 'relative',
							position: {
								top: '',
								right: '10px',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Relative<span>Open Bottom</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="bottom"
						value={{
							type: 'relative',
							position: {
								top: '',
								right: '',
								bottom: '10px',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Relative<span>Open Left</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="left"
						value={{
							type: 'relative',
							position: {
								top: '',
								right: '',
								bottom: '',
								left: '10px',
							},
						}}
					/>
				</Flex>
			</Flex>
		);
	},
};

export const FilledAbsolute = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Absolute<span>Empty</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'absolute',
							position: {
								top: '',
								right: '',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Absolute<span>All PX</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'absolute',
							position: {
								top: '10px',
								right: '20px',
								bottom: '30px',
								left: '40px',
							},
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Absolute<span>Custom Units</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'absolute',
							position: {
								top: '10px',
								right: '20%',
								bottom: '30vh',
								left: '40dvh',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Absolute<span>Open Top</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="top"
						value={{
							type: 'absolute',
							position: {
								top: '10px',
								right: '',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Absolute<span>Open Right</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="right"
						value={{
							type: 'absolute',
							position: {
								top: '',
								right: '10px',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Absolute<span>Open Bottom</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="bottom"
						value={{
							type: 'absolute',
							position: {
								top: '',
								right: '',
								bottom: '10px',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Absolute<span>Open Left</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="left"
						value={{
							type: 'absolute',
							position: {
								top: '',
								right: '',
								bottom: '',
								left: '10px',
							},
						}}
					/>
				</Flex>
			</Flex>
		);
	},
};

export const FilledFixed = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Fixed<span>Empty</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'fixed',
							position: {
								top: '',
								right: '',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Fixed<span>All PX</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'fixed',
							position: {
								top: '10px',
								right: '20px',
								bottom: '30px',
								left: '40px',
							},
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Fixed<span>Custom Units</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'fixed',
							position: {
								top: '10px',
								right: '20%',
								bottom: '30vh',
								left: '40dvh',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Fixed<span>Open Top</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="top"
						value={{
							type: 'fixed',
							position: {
								top: '10px',
								right: '',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Fixed<span>Open Right</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="right"
						value={{
							type: 'fixed',
							position: {
								top: '',
								right: '10px',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Fixed<span>Open Bottom</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="bottom"
						value={{
							type: 'fixed',
							position: {
								top: '',
								right: '',
								bottom: '10px',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Fixed<span>Open Left</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="left"
						value={{
							type: 'fixed',
							position: {
								top: '',
								right: '',
								bottom: '',
								left: '10px',
							},
						}}
					/>
				</Flex>
			</Flex>
		);
	},
};

export const FilledSticky = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Sticky<span>Empty</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'sticky',
							position: {
								top: '',
								right: '',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Sticky<span>All PX</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'sticky',
							position: {
								top: '10px',
								right: '20px',
								bottom: '30px',
								left: '40px',
							},
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Sticky<span>Custom Units</span>
					</h2>
					<BoxPositionControl
						{...args}
						value={{
							type: 'sticky',
							position: {
								top: '10px',
								right: '20%',
								bottom: '30vh',
								left: '40dvh',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Sticky<span>Open Top</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="top"
						value={{
							type: 'sticky',
							position: {
								top: '10px',
								right: '',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Sticky<span>Open Right</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="right"
						value={{
							type: 'sticky',
							position: {
								top: '',
								right: '10px',
								bottom: '',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Sticky<span>Open Bottom</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="bottom"
						value={{
							type: 'sticky',
							position: {
								top: '',
								right: '',
								bottom: '10px',
								left: '',
							},
						}}
					/>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Sticky<span>Open Left</span>
					</h2>
					<BoxPositionControl
						{...args}
						openSide="left"
						value={{
							type: 'sticky',
							position: {
								top: '',
								right: '',
								bottom: '',
								left: '10px',
							},
						}}
					/>
				</Flex>
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<BoxPositionControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const Play = {
	args: {},
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

		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toBeEmptyDOMElement();
		});

		await step('Relative', async () => {
			await expect(canvas.getAllByRole('button')[0]).toBeInTheDocument();

			// open select and choose option
			await userEvent.click(canvas.getAllByRole('button')[0]);
			await userEvent.click(canvas.getAllByRole('option')[1]);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "relative", "position": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);

			await step('Top Position', async () => {
				await userEvent.click(canvas.getByLabelText('Top Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '10' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "10px", "right": "", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await expect(canvas.getByRole('combobox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('combobox'), {
					target: { value: '%' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "10%", "right": "", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);
				fireEvent.change(canvas.getByRole('combobox'), {
					target: { value: 'px' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "10px", "right": "", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await expect(
					canvas.getByLabelText('Set 0px')
				).toBeInTheDocument();
				await userEvent.click(canvas.getByLabelText('Set 0px'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "0px", "right": "", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await expect(
					canvas.getByLabelText('Set 10px')
				).toBeInTheDocument();
				await userEvent.click(canvas.getByLabelText('Set 10px'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "10px", "right": "", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await expect(
					canvas.getByLabelText('Set 20px')
				).toBeInTheDocument();
				await userEvent.click(canvas.getByLabelText('Set 20px'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "20px", "right": "", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await expect(
					canvas.getByLabelText('Set 30px')
				).toBeInTheDocument();
				await userEvent.click(canvas.getByLabelText('Set 30px'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "30px", "right": "", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await expect(
					canvas.getByLabelText('Set 60px')
				).toBeInTheDocument();
				await userEvent.click(canvas.getByLabelText('Set 60px'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "60px", "right": "", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await expect(
					canvas.getByLabelText('Set 80px')
				).toBeInTheDocument();
				await userEvent.click(canvas.getByLabelText('Set 80px'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "80px", "right": "", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await expect(
					canvas.getByLabelText('Set 100px')
				).toBeInTheDocument();
				await userEvent.click(canvas.getByLabelText('Set 100px'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "100px", "right": "", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await expect(
					canvas.getByLabelText('Set 120px')
				).toBeInTheDocument();
				await userEvent.click(canvas.getByLabelText('Set 120px'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "120px", "right": "", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Right Position', async () => {
				await userEvent.click(canvas.getByLabelText('Right Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '10' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "120px", "right": "10px", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Bottom Position', async () => {
				await userEvent.click(canvas.getByLabelText('Bottom Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '10' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "120px", "right": "10px", "bottom": "10px", "left": "" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Left Position', async () => {
				await userEvent.click(canvas.getByLabelText('Left Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '10' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "relative", "position": { "top": "120px", "right": "10px", "bottom": "10px", "left": "10px" } }'
						),
					{ timeout: 1000 }
				);
			});
		});

		await step('Absolute', async () => {
			await expect(canvas.getAllByRole('button')[0]).toBeInTheDocument();

			// open select and choose option
			await userEvent.click(canvas.getAllByRole('button')[0]);
			await userEvent.click(canvas.getAllByRole('option')[2]);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "absolute", "position": { "top": "120px", "right": "10px", "bottom": "10px", "left": "10px" } }'
					),
				{ timeout: 1000 }
			);

			await step('Top Position', async () => {
				await userEvent.click(canvas.getByLabelText('Top Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '20' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "20px", "right": "10px", "bottom": "10px", "left": "10px" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Right Position', async () => {
				await userEvent.click(canvas.getByLabelText('Right Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '20' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "20px", "right": "20px", "bottom": "10px", "left": "10px" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Bottom Position', async () => {
				await userEvent.click(canvas.getByLabelText('Bottom Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '20' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "20px", "right": "20px", "bottom": "20px", "left": "10px" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Left Position', async () => {
				await userEvent.click(canvas.getByLabelText('Left Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '20' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "20px", "right": "20px", "bottom": "20px", "left": "20px" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Absolute Buttons', async () => {
				await userEvent.click(canvas.getByLabelText('Top Left'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "0px", "right": "", "bottom": "", "left": "0px" } }'
						),
					{ timeout: 1000 }
				);

				await userEvent.click(canvas.getByLabelText('Top Right'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "0px", "right": "0px", "bottom": "", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await userEvent.click(canvas.getByLabelText('Bottom Left'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "", "right": "", "bottom": "0px", "left": "0px" } }'
						),
					{ timeout: 1000 }
				);

				await userEvent.click(canvas.getByLabelText('Bottom Right'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "", "right": "0px", "bottom": "0px", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await userEvent.click(canvas.getByLabelText('Top'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "0px", "right": "0px", "bottom": "", "left": "0px" } }'
						),
					{ timeout: 1000 }
				);

				await userEvent.click(canvas.getByLabelText('Right'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "0px", "right": "0px", "bottom": "0px", "left": "" } }'
						),
					{ timeout: 1000 }
				);

				await userEvent.click(canvas.getByLabelText('Bottom'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "", "right": "0px", "bottom": "0px", "left": "0px" } }'
						),
					{ timeout: 1000 }
				);

				await userEvent.click(canvas.getByLabelText('Left'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "0px", "right": "", "bottom": "0px", "left": "0px" } }'
						),
					{ timeout: 1000 }
				);

				await userEvent.click(canvas.getByLabelText('Full'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "0px", "right": "0px", "bottom": "0px", "left": "0px" } }'
						),
					{ timeout: 1000 }
				);

				await userEvent.click(canvas.getByLabelText('Center'));
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "absolute", "position": { "top": "20%", "right": "20%", "bottom": "20%", "left": "20%" } }'
						),
					{ timeout: 1000 }
				);

				await step('Reset Aboslote for fix', async () => {
					await userEvent.click(
						canvas.getByLabelText('Top Position')
					);
					await expect(
						canvas.getByRole('textbox')
					).toBeInTheDocument();
					fireEvent.change(canvas.getByRole('textbox'), {
						target: { value: '30' },
					});
					fireEvent.change(canvas.getByRole('combobox'), {
						target: { value: 'px' },
					});
					await waitFor(
						async () =>
							await expect(currentValue).toHaveTextContent(
								'{ "type": "absolute", "position": { "top": "30px", "right": "20%", "bottom": "20%", "left": "20%" } }'
							),
						{ timeout: 1000 }
					);

					await userEvent.click(
						canvas.getByLabelText('Right Position')
					);
					await expect(
						canvas.getByRole('textbox')
					).toBeInTheDocument();
					fireEvent.change(canvas.getByRole('textbox'), {
						target: { value: '30' },
					});
					fireEvent.change(canvas.getByRole('combobox'), {
						target: { value: 'px' },
					});
					await waitFor(
						async () =>
							await expect(currentValue).toHaveTextContent(
								'{ "type": "absolute", "position": { "top": "30px", "right": "30px", "bottom": "20%", "left": "20%" } }'
							),
						{ timeout: 1000 }
					);

					await userEvent.click(
						canvas.getByLabelText('Bottom Position')
					);
					await expect(
						canvas.getByRole('textbox')
					).toBeInTheDocument();
					fireEvent.change(canvas.getByRole('textbox'), {
						target: { value: '30' },
					});
					fireEvent.change(canvas.getByRole('combobox'), {
						target: { value: 'px' },
					});
					await waitFor(
						async () =>
							await expect(currentValue).toHaveTextContent(
								'{ "type": "absolute", "position": { "top": "30px", "right": "30px", "bottom": "30px", "left": "20%" } }'
							),
						{ timeout: 1000 }
					);

					await userEvent.click(
						canvas.getByLabelText('Left Position')
					);
					await expect(
						canvas.getByRole('textbox')
					).toBeInTheDocument();
					fireEvent.change(canvas.getByRole('textbox'), {
						target: { value: '30' },
					});
					fireEvent.change(canvas.getByRole('combobox'), {
						target: { value: 'px' },
					});
					await waitFor(
						async () =>
							await expect(currentValue).toHaveTextContent(
								'{ "type": "absolute", "position": { "top": "30px", "right": "30px", "bottom": "30px", "left": "30px" } }'
							),
						{ timeout: 1000 }
					);
				});
			});
		});

		await step('Fixed', async () => {
			await expect(canvas.getAllByRole('button')[0]).toBeInTheDocument();

			// open select and choose option
			await userEvent.click(canvas.getAllByRole('button')[0]);
			await userEvent.click(canvas.getAllByRole('option')[3]);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "fixed", "position": { "top": "30px", "right": "30px", "bottom": "30px", "left": "30px" } }'
					),
				{ timeout: 1000 }
			);

			await step('Top Position', async () => {
				await userEvent.click(canvas.getByLabelText('Top Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '40' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "fixed", "position": { "top": "40px", "right": "30px", "bottom": "30px", "left": "30px" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Right Position', async () => {
				await userEvent.click(canvas.getByLabelText('Right Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '40' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "fixed", "position": { "top": "40px", "right": "40px", "bottom": "30px", "left": "30px" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Bottom Position', async () => {
				await userEvent.click(canvas.getByLabelText('Bottom Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '40' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "fixed", "position": { "top": "40px", "right": "40px", "bottom": "40px", "left": "30px" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Left Position', async () => {
				await userEvent.click(canvas.getByLabelText('Left Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '40' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "fixed", "position": { "top": "40px", "right": "40px", "bottom": "40px", "left": "40px" } }'
						),
					{ timeout: 1000 }
				);
			});
		});

		await step('Sticky', async () => {
			await expect(canvas.getAllByRole('button')[0]).toBeInTheDocument();

			// open select and choose option
			await userEvent.click(canvas.getAllByRole('button')[0]);
			await userEvent.click(canvas.getAllByRole('option')[4]);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "type": "sticky", "position": { "top": "40px", "right": "40px", "bottom": "40px", "left": "40px" } }'
					),
				{ timeout: 1000 }
			);

			await step('Top Position', async () => {
				await userEvent.click(canvas.getByLabelText('Top Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '50' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "sticky", "position": { "top": "50px", "right": "40px", "bottom": "40px", "left": "40px" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Right Position', async () => {
				await userEvent.click(canvas.getByLabelText('Right Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '50' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "sticky", "position": { "top": "50px", "right": "50px", "bottom": "40px", "left": "40px" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Bottom Position', async () => {
				await userEvent.click(canvas.getByLabelText('Bottom Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '50' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "sticky", "position": { "top": "50px", "right": "50px", "bottom": "50px", "left": "40px" } }'
						),
					{ timeout: 1000 }
				);
			});

			await step('Left Position', async () => {
				await userEvent.click(canvas.getByLabelText('Left Position'));

				await expect(canvas.getByRole('textbox')).toBeInTheDocument();
				fireEvent.change(canvas.getByRole('textbox'), {
					target: { value: '50' },
				});
				await waitFor(
					async () =>
						await expect(currentValue).toHaveTextContent(
							'{ "type": "sticky", "position": { "top": "50px", "right": "50px", "bottom": "50px", "left": "50px" } }'
						),
					{ timeout: 1000 }
				);
			});
		});
	},
};

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
				<BoxPositionControl {...Empty.args} />
			</Flex>

			<FilledRelative.render />

			<FilledAbsolute.render />

			<FilledFixed.render />

			<FilledSticky.render />
		</Flex>
	),
};
