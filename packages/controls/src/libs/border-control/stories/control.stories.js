/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/storybook/decorators';

/**
 * Internal dependencies
 */
import { BorderControl } from '../../index';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { ControlContextProvider } from '../../../context';

const { WithInspectorStyles, SharedDecorators } = Decorators;
SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/BorderControl',
	component: BorderControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<h2 className="story-heading">
				Border<span>Default</span>
			</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const HorizontalBorder = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
		linesDirection: 'horizontal',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<h2 className="story-heading">Horizontal Border Control</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {},
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'dashed' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'dotted' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'double' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					style={{ width: '91px' }}
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const VerticalBorder = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
		linesDirection: 'vertical',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<h2 className="story-heading">Vertical Border Control</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: {},
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'dashed' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'dotted' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: { ...args.value, style: 'double' },
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					style={{ width: '91px' }}
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const FocusAndWidthChange = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<h2 className="story-heading">Focus And Width Change</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isWidthFocused={true}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isWidthFocused={true}
					style={{ width: '91px' }}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isColorFocused={true}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isColorFocused={true}
					style={{ width: '91px' }}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isStyleFocused={true}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={BorderControl}
					{...args}
					__isStyleFocused={true}
					style={{ width: '91px' }}
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const Field = {
	args: {
		value: {
			width: '10px',
			style: 'solid',
			color: '#0947eb',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<h2 className="story-heading">With Field</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={BorderControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render {...Default.args} />

			<HorizontalBorder.render {...HorizontalBorder.args} />

			<VerticalBorder.render {...VerticalBorder.args} />

			<FocusAndWidthChange.render {...FocusAndWidthChange.args} />

			<Field.render {...Field.args} />
		</Flex>
	),
};
