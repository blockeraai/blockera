/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { Flex, InputControl, ControlContextProvider } from '../../';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Value Addon/ValueAddonControl',
	component: InputControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '20',
		},
		label: 'Input Control',
	},
	render: (args) => (
		<ControlWithHooks
			Control={InputControl}
			{...args}
			controlAddonTypes={['variable']}
			variableTypes={['font-size']}
		/>
	),
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	parameters: {
		jest: ['input.spec.js'],
	},
};

export const Variable = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: 'text',
		},
		type: 'text',
		defaultValue: 'default',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Value Addon<span>Variable</span>
				</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: '',
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Only Variable"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								value: 20,
								id: 'medium',
								reference: {
									type: 'preset',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'medium',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Font Size"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								value: 20,
								id: 'medium',
								reference: {
									type: 'preset',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'medium',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<div style={{ width: '100px' }}>
						<ControlWithHooks
							Control={InputControl}
							type="text"
							label="Small Size"
							{...args}
							defaultValue=""
							controlAddonTypes={['variable']}
							variableTypes={['font-size']}
							size="small"
						/>
					</div>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Deleted Variables</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								value: 20,
								id: 'not-found',
								reference: {
									type: 'preset',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Preset Reference (Width Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								id: 'not-found',
								reference: {
									type: 'preset',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Preset Reference (No Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								id: 'not-found',
								reference: {
									type: 'preset',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Preset Reference (No Value & Name)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Deleted Variables<span>Blockera Blocks</span>
				</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								value: 20,
								id: 'not-found',
								reference: {
									type: 'core',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Core Reference (Width Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								id: 'not-found',
								reference: {
									type: 'core',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Core Reference (No Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								id: 'not-found',
								reference: {
									type: 'core',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Core Reference (No Value & Name)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Deleted Variables<span>Blockera Blocks Pro</span>
				</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								value: 20,
								id: 'not-found',
								reference: {
									type: 'core-pro',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Core Pro Reference (Width Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								id: 'not-found',
								reference: {
									type: 'core-pro',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Core Pro Reference (No Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								id: 'not-found',
								reference: {
									type: 'core-pro',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Core Pro Ref (No Value & Name)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Deleted Variables<span>Custom Code</span>
				</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								value: 20,
								id: 'not-found',
								reference: {
									type: 'custom',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Custom Code Ref (Width Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								id: 'not-found',
								reference: {
									type: 'custom',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Custom Code Ref (No Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								id: 'not-found',
								reference: {
									type: 'custom',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Custom Code Ref (No Value & Name)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Deleted Variables<span>Theme</span>
				</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								value: 20,
								id: 'not-found',
								reference: {
									type: 'theme',
									theme: 'Blockera SE',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Theme Reference (Width Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								id: 'not-found',
								reference: {
									type: 'theme',
									theme: 'Blockera SE',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Theme Reference (No Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								id: 'not-found',
								reference: {
									type: 'theme',
									theme: 'Blockera SE',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Theme Reference (No Value & Name)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Deleted Variables<span>Plugin</span>
				</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								value: 20,
								id: 'not-found',
								reference: {
									type: 'plugin',
									plugin: 'WooCommerce',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Plugin Reference (Width Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Medium',
								id: 'not-found',
								reference: {
									type: 'plugin',
									plugin: 'WooCommerce',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Plugin Reference (No Value)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								id: 'not-found',
								reference: {
									type: 'plugin',
									plugin: 'WooCommerce',
								},
								var: '--wp--preset--font-size--medium',
								type: 'font-size',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'variable',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Plugin Reference (No Value & Name)"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable']}
						variableTypes={['font-size']}
					/>
				</ControlContextProvider>
			</Flex>
		</Flex>
	),
};
