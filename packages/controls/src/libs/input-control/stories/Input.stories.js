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
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider, InputControl } from '../../../index';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

const units = [
	{ value: 'px', label: 'px', default: 0 },
	{ value: '%', label: '%', default: 10 },
	{ value: 'em', label: 'em', default: 0 },
];

export default {
	title: 'Controls/InputControl',
	component: InputControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '20',
		},
		defaultValue: '10',
	},
	render: (args) => <ControlWithHooks Control={InputControl} {...args} />,
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	parameters: {
		jest: ['input.spec.js'],
	},
};

export const TextInput = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Text Input</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					type="text"
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					type="text"
					className="is-hovered"
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					type="text"
					className="is-focused"
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					type="text"
					noBorder={true}
					{...args}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					type="text"
					className="is-focused"
					noBorder={true}
					{...args}
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const NumberInput = {
	args: {
		defaultValue: '10px',
		value: '20',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Number Input</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 0,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						type="number"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 10,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						type="number"
						className="is-hovered"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 20,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						type="number"
						className="is-focused"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 30,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						type="number"
						noBorder={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 40,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						type="number"
						className="is-focused"
						noBorder={true}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Range Number Input</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 50,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						type="number"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 60,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						type="number"
						className="is-hovered"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 70,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						type="number"
						className="is-focused"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 80,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						type="number"
						noBorder={true}
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 90,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						type="number"
						className="is-focused"
						noBorder={true}
					/>
				</ControlContextProvider>
			</Flex>
		</Flex>
	),
};

export const UnitsInput = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Units Input</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						units={units}
						type="number"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						units={units}
						type="number"
						className="is-hovered"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						units={units}
						type="number"
						className="is-focused"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						units={units}
						type="number"
						noBorder={true}
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						units={units}
						type="number"
						className="is-focused"
						noBorder={true}
					/>
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Range Units Input</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						units={units}
						type="number"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						units={units}
						type="number"
						className="is-hovered"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						units={units}
						type="number"
						className="is-focused"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						units={units}
						type="number"
						noBorder={true}
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={InputControl}
						{...args}
						range={true}
						units={units}
						type="number"
						className="is-focused"
						noBorder={true}
					/>
				</ControlContextProvider>
			</Flex>
		</Flex>
	),
};

export const CssInput = {
	args: {
		unitType: 'general',
		defaultValue: '10px',
		className: 'publisher-input',
		value: '20px',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">CSS Input</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					{...args}
					unitType="general"
				/>
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					{...args}
					unitType="general"
					value="1auto"
				/>
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					{...args}
					range={true}
					unitType="general"
				/>
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '1auto',
				}}
			>
				<ControlWithHooks
					Control={InputControl}
					{...args}
					range={true}
					unitType="general"
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const Field = {
	args: {
		label: 'Field',
		type: 'number',
		value: '20',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">With Field</h2>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks Control={InputControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const All = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<TextInput.render {...TextInput.args} />

			<NumberInput.render {...NumberInput.args} />

			<UnitsInput.render {...UnitsInput.args} />

			<CssInput.render {...CssInput.args} />

			<Field.render {...Field.args} />
		</Flex>
	),
};
