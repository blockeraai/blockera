/**
 * External dependencies
 */
import { expect } from '@storybook/jest';
import {
	fireEvent,
	userEvent,
	waitFor,
	within,
} from '@storybook/testing-library';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import BoxSpacingControl from '../index';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const {
	WithInspectorStyles,
	WithStoryContextProvider,
	SharedDecorators,
	WithPopoverDataProvider,
} = Decorators;

SharedDecorators.push(WithPopoverDataProvider);
SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/BoxSpacingControl',
	component: BoxSpacingControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Box Spacing<span>Empty</span>
			</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					// value: {},
					value: {
						margin: {
							top: '',
							right: '',
							bottom: '',
							left: '',
						},
						padding: {
							top: '',
							right: '',
							bottom: '',
							left: '',
						},
					},
				}}
			>
				<ControlWithHooks Control={BoxSpacingControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const Filled = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Fill<span>Margin</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '10px',
									right: '20%',
									bottom: '30vh',
									left: '40dvh',
								},
								padding: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Fill<span>Margin Only PX</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '10px',
									right: '20px',
									bottom: '30px',
									left: '40px',
								},
								padding: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Fill<span>Padding</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
								padding: {
									top: '10px',
									right: '20%',
									bottom: '30vh',
									left: '40dvh',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Fill<span>All</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '10px',
									right: '20%',
									bottom: '30vh',
									left: '40dvh',
								},
								padding: {
									top: '50px',
									right: '60%',
									bottom: '70vh',
									left: '80dvh',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Open = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '100px' }}
				>
					<h2 className="story-heading">
						Open<span>Top Margin</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '10px',
									right: '',
									bottom: '',
									left: '',
								},
								padding: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
							openSide="margin-top"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '100px' }}
				>
					<h2 className="story-heading">
						Open<span>Right Margin</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '',
									right: '20%',
									bottom: '',
									left: '',
								},
								padding: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
							openSide="margin-right"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '200px' }}
				>
					<h2 className="story-heading">
						Open<span>Bottom Margin</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '',
									right: '',
									bottom: '30vh',
									left: '',
								},
								padding: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
							openSide="margin-bottom"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '100px' }}
				>
					<h2 className="story-heading">
						Open<span>Left Margin</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '',
									right: '',
									bottom: '',
									left: '40dvh',
								},
								padding: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
							openSide="margin-left"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '100px' }}
				>
					<h2 className="story-heading">
						Open<span>Top Padding</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
								padding: {
									top: '10px',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
							openSide="padding-top"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '100px' }}
				>
					<h2 className="story-heading">
						Open<span>Right Padding</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
								padding: {
									top: '',
									right: '20%',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
							openSide="padding-right"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '200px' }}
				>
					<h2 className="story-heading">
						Open<span>Bottom Padding</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
								padding: {
									top: '',
									right: '',
									bottom: '30vh',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
							openSide="padding-bottom"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '100px' }}
				>
					<h2 className="story-heading">
						Open<span>Left Padding</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
								padding: {
									top: '',
									right: '',
									bottom: '',
									left: '40dvh',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxSpacingControl}
							{...args}
							openSide="padding-left"
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const Field = {
	args: {
		label: 'Box Spacing',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">With Field</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {
						margin: {
							top: '',
							right: '',
							bottom: '',
							left: '',
						},
						padding: {
							top: '',
							right: '',
							bottom: '',
							left: '',
						},
					},
				}}
			>
				<ControlWithHooks Control={BoxSpacingControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const Play = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: {
				margin: {
					top: '',
					right: '',
					bottom: '',
					left: '',
				},
				padding: {
					top: '',
					right: '',
					bottom: '',
					left: '',
				},
			},
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithPopoverDataProvider,
		WithControlDataProvider,
		WithInspectorStyles,
		...SharedDecorators,
	],
	render: (args) => (
		<ControlWithHooks Control={BoxSpacingControl} {...args} />
	),
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');

		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toHaveTextContent(
				'{ "margin": { "top": "", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
			);
		});

		await step('Top Margin', async () => {
			await expect(
				canvas.getByLabelText('Top Margin')
			).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Top Margin'));

			// change input
			await expect(canvas.getByRole('textbox')).toBeInTheDocument();
			fireEvent.change(canvas.getByRole('textbox'), {
				target: { value: '10' },
			});
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "10px", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
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
						'{ "margin": { "top": "10%", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);
			fireEvent.change(canvas.getByRole('combobox'), {
				target: { value: 'px' },
			});
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "10px", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);

			await expect(canvas.getByLabelText('Set Auto')).toBeInTheDocument();
			await userEvent.click(canvas.getByLabelText('Set Auto'));
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "0auto", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);

			await expect(canvas.getByLabelText('Set 0px')).toBeInTheDocument();
			await userEvent.click(canvas.getByLabelText('Set 0px'));
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "0px", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);

			await expect(canvas.getByLabelText('Set 10px')).toBeInTheDocument();
			await userEvent.click(canvas.getByLabelText('Set 10px'));
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "10px", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);

			await expect(canvas.getByLabelText('Set 20px')).toBeInTheDocument();
			await userEvent.click(canvas.getByLabelText('Set 20px'));
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "20px", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);

			await expect(canvas.getByLabelText('Set 30px')).toBeInTheDocument();
			await userEvent.click(canvas.getByLabelText('Set 30px'));
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "30px", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);

			await expect(canvas.getByLabelText('Set 60px')).toBeInTheDocument();
			await userEvent.click(canvas.getByLabelText('Set 60px'));
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "60px", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);

			await expect(canvas.getByLabelText('Set 80px')).toBeInTheDocument();
			await userEvent.click(canvas.getByLabelText('Set 80px'));
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "80px", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
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
						'{ "margin": { "top": "100px", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
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
						'{ "margin": { "top": "120px", "right": "", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Right Margin', async () => {
			await expect(
				canvas.getByLabelText('Right Margin')
			).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Right Margin'));

			// change input
			await expect(canvas.getByRole('textbox')).toBeInTheDocument();
			fireEvent.change(canvas.getByRole('textbox'), {
				target: { value: '10' },
			});
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "120px", "right": "10px", "bottom": "", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Bottom Margin', async () => {
			await expect(
				canvas.getByLabelText('Bottom Margin')
			).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Bottom Margin'));

			// change input
			await expect(canvas.getByRole('textbox')).toBeInTheDocument();
			fireEvent.change(canvas.getByRole('textbox'), {
				target: { value: '10' },
			});
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "120px", "right": "10px", "bottom": "10px", "left": "" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Left Margin', async () => {
			await expect(
				canvas.getByLabelText('Left Margin')
			).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Left Margin'));

			// change input
			await expect(canvas.getByRole('textbox')).toBeInTheDocument();
			fireEvent.change(canvas.getByRole('textbox'), {
				target: { value: '10' },
			});
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "120px", "right": "10px", "bottom": "10px", "left": "10px" }, "padding": { "top": "", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Top Padding', async () => {
			await expect(
				canvas.getByLabelText('Top Padding')
			).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Top Padding'));

			// change input
			await expect(canvas.getByRole('textbox')).toBeInTheDocument();
			fireEvent.change(canvas.getByRole('textbox'), {
				target: { value: '10' },
			});
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "120px", "right": "10px", "bottom": "10px", "left": "10px" }, "padding": { "top": "10px", "right": "", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Right Padding', async () => {
			await expect(
				canvas.getByLabelText('Right Padding')
			).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Right Padding'));

			// change input
			await expect(canvas.getByRole('textbox')).toBeInTheDocument();
			fireEvent.change(canvas.getByRole('textbox'), {
				target: { value: '10' },
			});
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "120px", "right": "10px", "bottom": "10px", "left": "10px" }, "padding": { "top": "10px", "right": "10px", "bottom": "", "left": "" } }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Bottom Padding', async () => {
			await expect(
				canvas.getByLabelText('Bottom Padding')
			).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Bottom Padding'));

			// change input
			await expect(canvas.getByRole('textbox')).toBeInTheDocument();
			fireEvent.change(canvas.getByRole('textbox'), {
				target: { value: '10' },
			});
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "120px", "right": "10px", "bottom": "10px", "left": "10px" }, "padding": { "top": "10px", "right": "10px", "bottom": "10px", "left": "" } }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Left Padding', async () => {
			await expect(
				canvas.getByLabelText('Left Padding')
			).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Left Padding'));

			// change input
			await expect(canvas.getByRole('textbox')).toBeInTheDocument();
			fireEvent.change(canvas.getByRole('textbox'), {
				target: { value: '10' },
			});
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "margin": { "top": "120px", "right": "10px", "bottom": "10px", "left": "10px" }, "padding": { "top": "10px", "right": "10px", "bottom": "10px", "left": "10px" } }'
					),
				{ timeout: 1000 }
			);
		});
	},
};

export const All = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="50px">
			<Empty.render {...Empty.args} />

			<Filled.render {...Filled.args} />

			<Open.render {...Open.args} />

			<Field.render {...Field.args} />
		</Flex>
	),
};
