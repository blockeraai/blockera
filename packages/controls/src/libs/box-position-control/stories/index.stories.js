/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider } from '../../../context';
import BoxPositionControl from '../index';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;

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
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Box Position<span>Empty</span>
			</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {},
				}}
			>
				<ControlWithHooks Control={BoxPositionControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
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

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'relative',
								position: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Relative<span>All PX</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'relative',
								position: {
									top: '10px',
									right: '20px',
									bottom: '30px',
									left: '40px',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Relative<span>Custom Units</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'relative',
								position: {
									top: '10px',
									right: '20%',
									bottom: '30vh',
									left: '40dvh',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Relative<span>Open Top</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'relative',
								position: {
									top: '10px',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="top"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Relative<span>Open Right</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'relative',
								position: {
									top: '',
									right: '10px',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="right"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Relative<span>Open Bottom</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'relative',
								position: {
									top: '',
									right: '',
									bottom: '10px',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="bottom"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Relative<span>Open Left</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'relative',
								position: {
									top: '',
									right: '',
									bottom: '',
									left: '10px',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="left"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Relative<span>CSS Func Value</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'relative',
								position: {
									top: 'calc(10px + 10px)func',
									right: 'calc(10px + 10px)func',
									bottom: 'calc(10px + 10px)func',
									left: 'calc(10px + 10px)func',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="left"
						/>
					</ControlContextProvider>
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

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'absolute',
								position: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Absolute<span>All PX</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'absolute',
								position: {
									top: '10px',
									right: '20px',
									bottom: '30px',
									left: '40px',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Absolute<span>Custom Units</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'absolute',
								position: {
									top: '10px',
									right: '20%',
									bottom: '30vh',
									left: '40dvh',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Absolute<span>Open Top</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'absolute',
								position: {
									top: '10px',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="top"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Absolute<span>Open Right</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'absolute',
								position: {
									top: '',
									right: '10px',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="right"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Absolute<span>Open Bottom</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'absolute',
								position: {
									top: '',
									right: '',
									bottom: '10px',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="bottom"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Absolute<span>Open Left</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'absolute',
								position: {
									top: '',
									right: '',
									bottom: '',
									left: '10px',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="left"
						/>
					</ControlContextProvider>
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

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'fixed',
								position: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Fixed<span>All PX</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'fixed',
								position: {
									top: '10px',
									right: '20px',
									bottom: '30px',
									left: '40px',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Fixed<span>Custom Units</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'fixed',
								position: {
									top: '10px',
									right: '20%',
									bottom: '30vh',
									left: '40dvh',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Fixed<span>Open Top</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'fixed',
								position: {
									top: '10px',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="top"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Fixed<span>Open Right</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'fixed',
								position: {
									top: '',
									right: '10px',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="right"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Fixed<span>Open Bottom</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'fixed',
								position: {
									top: '',
									right: '',
									bottom: '10px',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="bottom"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Fixed<span>Open Left</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'fixed',
								position: {
									top: '',
									right: '',
									bottom: '',
									left: '10px',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="left"
						/>
					</ControlContextProvider>
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

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'sticky',
								position: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Sticky<span>All PX</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'sticky',
								position: {
									top: '10px',
									right: '20px',
									bottom: '30px',
									left: '40px',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Sticky<span>Custom Units</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'sticky',
								position: {
									top: '10px',
									right: '20%',
									bottom: '30vh',
									left: '40dvh',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Sticky<span>Open Top</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'sticky',
								position: {
									top: '10px',
									right: '',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="top"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Sticky<span>Open Right</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'sticky',
								position: {
									top: '',
									right: '10px',
									bottom: '',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="right"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Sticky<span>Open Bottom</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'sticky',
								position: {
									top: '',
									right: '',
									bottom: '10px',
									left: '',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="bottom"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '150px' }}
				>
					<h2 className="story-heading">
						Sticky<span>Open Left</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								type: 'sticky',
								position: {
									top: '',
									right: '',
									bottom: '',
									left: '10px',
								},
							},
						}}
					>
						<ControlWithHooks
							Control={BoxPositionControl}
							{...args}
							openSide="left"
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
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

			<FilledRelative.render {...FilledRelative.args} />

			<FilledAbsolute.render {...FilledAbsolute.args} />

			<FilledFixed.render {...FilledFixed.args} />

			<FilledSticky.render {...FilledSticky.args} />
		</Flex>
	),
};
