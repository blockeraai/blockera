/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { InputControl, ControlContextProvider } from '@blockera/controls';
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
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
			controlAddonTypes={['variable', 'dynamic-value']}
			variableTypes={['font-size']}
			dynamicValueTypes={['all']}
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
						value: '',
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Variable + Dynamic Value"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable', 'dynamic-value']}
						variableTypes={['font-size']}
						dynamicValueTypes={['all']}
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

export const DynamicValue = {
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
						label="Only Dynamic Value"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['all']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: '',
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Dynamic Value + Variable"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value', 'variable']}
						variableTypes={['font-size']}
						dynamicValueTypes={['all']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Title',
								id: 'post-title',
								reference: {
									type: 'core',
								},
								category: 'post',
								type: 'text',
							},
							id: 'post-title',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Post Title"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['text']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Title',
								id: 'post-title',
								reference: {
									type: 'core',
								},
								category: 'post',
								type: 'text',
							},
							id: 'post-title',
							isValueAddon: true,
							valueType: 'dynamic-value',
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
							controlAddonTypes={['variable', 'dynamic-value']}
							variableTypes={[
								'font-size',
								'width-size',
								'spacing',
								'gradient',
							]}
							dynamicValueTypes={['text']}
							size="small"
						/>
					</div>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Value Addon<span>Types</span>
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
						label="All Types"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['all']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Title',
								id: 'post-title',
								reference: {
									type: 'core',
								},
								category: 'post',
								type: 'text',
							},
							id: 'post-title',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Text Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['text']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Site URL',
								id: 'site-url',
								reference: {
									type: 'core',
								},
								category: 'site',
								type: 'link',
							},
							id: 'site-url',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Link Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['link']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Image URL',
								id: 'featured-image-url',
								reference: {
									type: 'core',
								},
								category: 'featured-image',
								type: 'image',
							},
							id: 'featured-image-url',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Image Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['image']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post ID',
								id: 'post-id',
								reference: {
									type: 'core',
								},
								category: 'post',
								type: 'id',
							},
							id: 'post-id',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="ID Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['id']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Current Date',
								id: 'date',
								reference: {
									type: 'core',
								},
								category: 'other',
								type: 'date',
							},
							id: 'date',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Date Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['date']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Meta',
								id: 'post-meta',
								reference: {
									type: 'core-pro',
								},
								category: 'post',
								type: 'meta',
							},
							id: 'post-meta',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Meta Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['meta']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'User Email',
								id: 'user-email',
								reference: {
									type: 'core-pro',
								},
								category: 'user',
								type: 'email',
							},
							id: 'user-email',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Email Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['email']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Shortcode',
								id: 'shortcode',
								reference: {
									type: 'core-pro',
								},
								category: 'other',
								type: 'shortcode',
							},
							id: 'shortcode',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Email Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['shortcode']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Categories',
								id: 'post-cats',
								reference: {
									type: 'core-pro',
								},
								category: 'post',
								type: 'category',
							},
							id: 'post-cats',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Category Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['category']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Tags',
								id: 'post-tags',
								reference: {
									type: 'core-pro',
								},
								category: 'post',
								type: 'tag',
							},
							id: 'post-tags',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Tags Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['tag']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Terms',
								id: 'post-terms',
								reference: {
									type: 'core-pro',
								},
								category: 'post',
								type: 'term',
							},
							id: 'post-terms',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Terms Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['term']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Comments',
								id: 'post-comments',
								reference: {
									type: 'core-pro',
								},
								category: 'post',
								type: 'comment',
							},
							id: 'post-comments',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Comments Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['comment']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Reading Time',
								id: 'post-reading-time',
								reference: {
									type: 'core-pro',
								},
								category: 'post',
								type: 'time',
							},
							id: 'post-reading-time',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Time Type"
						{...args}
						defaultValue=""
						controlAddonTypes={['dynamic-value']}
						dynamicValueTypes={['time']}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Deleted DV</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Title',
								id: 'not-found',
								reference: {
									type: 'core',
								},
								category: 'post',
								type: 'text',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Core Reference"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable', 'dynamic-value']}
						variableTypes={[
							'font-size',
							'width-size',
							'spacing',
							'gradient',
						]}
						dynamicValueTypes={['text']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Title',
								id: 'not-found',
								reference: {
									type: 'core-pro',
								},
								category: 'post',
								type: 'text',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Core Pro Reference"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable', 'dynamic-value']}
						variableTypes={[
							'font-size',
							'width-size',
							'spacing',
							'gradient',
						]}
						dynamicValueTypes={['text']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Title',
								id: 'not-found',
								reference: {
									type: 'theme',
									theme: 'Blockera SE',
								},
								category: 'post',
								type: 'text',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Theme Reference"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable', 'dynamic-value']}
						variableTypes={[
							'font-size',
							'width-size',
							'spacing',
							'gradient',
						]}
						dynamicValueTypes={['text']}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: {
							settings: {
								name: 'Post Title',
								id: 'not-found',
								reference: {
									type: 'custom',
								},
								category: 'post',
								type: 'text',
							},
							id: 'not-found',
							isValueAddon: true,
							valueType: 'dynamic-value',
						},
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						type="text"
						label="Custom Reference"
						{...args}
						defaultValue=""
						controlAddonTypes={['variable', 'dynamic-value']}
						variableTypes={[
							'font-size',
							'width-size',
							'spacing',
							'gradient',
						]}
						dynamicValueTypes={['text']}
					/>
				</ControlContextProvider>
			</Flex>
		</Flex>
	),
};
