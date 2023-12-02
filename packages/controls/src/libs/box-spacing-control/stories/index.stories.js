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
import BoxSpacingControl from '../index';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;

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
									bottom: 'auto',
									left: '40dvh',
								},
								padding: {
									top: 'calc(10px + 10px)func',
									right: 'calc(10px + 10px)func',
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
									top: '10em',
									right: '20%',
									bottom: '30vh',
									left: '40dvh',
								},
								padding: {
									top: '50em',
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

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Fill<span>All Auto</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: 'auto',
									right: 'auto',
									bottom: 'auto',
									left: 'auto',
								},
								padding: {
									top: 'auto',
									right: 'auto',
									bottom: 'auto',
									left: 'auto',
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
						Fill<span>Func Unite</span>
					</h2>

					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								margin: {
									top: 'calc(10px + 10px)func',
									right: 'calc(10px + 10px)func',
									bottom: 'calc(10px + 10px)func',
									left: 'calc(10px + 10px)func',
								},
								padding: {
									top: 'calc(10px + 10px)func',
									right: 'calc(10px + 10px)func',
									bottom: 'calc(10px + 10px)func',
									left: 'calc(10px + 10px)func',
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
