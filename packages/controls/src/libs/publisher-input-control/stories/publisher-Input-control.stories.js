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
import { ControlContextProvider, PublisherInputControl } from '../../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

const units = [
	{ value: 'px', label: 'px', default: 0 },
	{ value: '%', label: '%', default: 10 },
	{ value: 'em', label: 'em', default: 0 },
];

export default {
	title: 'Controls/PublisherInputControl',
	component: PublisherInputControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '20',
		},
		label: 'My Label',
	},
	render: (args) => (
		<ControlWithHooks Control={PublisherInputControl} {...args} />
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

export const TextInput = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '20px',
		},
		type: 'text',
		defaultValue: '10px',
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
					Control={PublisherInputControl}
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
					Control={PublisherInputControl}
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
					Control={PublisherInputControl}
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
					Control={PublisherInputControl}
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
					Control={PublisherInputControl}
					type="number"
					className="is-focused"
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
					Control={PublisherInputControl}
					type="number"
					disabled
					{...args}
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const NumberInput = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: 'text',
		},
	},
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
						Control={PublisherInputControl}
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
						Control={PublisherInputControl}
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
						Control={PublisherInputControl}
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
						Control={PublisherInputControl}
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
						Control={PublisherInputControl}
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
						Control={PublisherInputControl}
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
						Control={PublisherInputControl}
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
						Control={PublisherInputControl}
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
						Control={PublisherInputControl}
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
						Control={PublisherInputControl}
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
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	parameters: {
		jest: ['input.spec.js'],
	},
};

export const UnitsInput = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '20',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Units Input</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 40,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						{...args}
						unitType={'letter-spacing'}
						type="number"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 50,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						{...args}
						units={units}
						type="number"
						className="is-hovered"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 60,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						{...args}
						units={units}
						type="number"
						className="is-focused"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 70,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						{...args}
						units={units}
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
						Control={PublisherInputControl}
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
						value: 20,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
						{...args}
						range={true}
						units={units}
						type="number"
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 30,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
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
						value: 40,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
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
						value: 50,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
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
						value: 60,
					}}
				>
					<ControlWithHooks
						Control={PublisherInputControl}
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
		// defaultValue: '10px',
		className: 'publisher-input',
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
					Control={PublisherInputControl}
					{...args}
					unitType="general"
					validator={[]}
				/>
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
					value: args.value,
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
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
					Control={PublisherInputControl}
					{...args}
					range={true}
					defaultValue="10"
					unitType="general"
				/>
			</ControlContextProvider>
			<ControlContextProvider
				value={{
					name: nanoid(),
				}}
			>
				<ControlWithHooks
					Control={PublisherInputControl}
					{...args}
					range={true}
					defaultValue="auto"
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
		defaultValue: '20',
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
				<ControlWithHooks Control={PublisherInputControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const WithCssValidator = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: 'calc(50px - 20px)',
		},
		label: 'My Label',
		validator: [],
	},
	render: (args) => (
		<ControlWithHooks Control={PublisherInputControl} {...args} />
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

export const WithCustomValidator = {
	args: {
		validator: (value) => {
			if (value === 'valid') {
				return true;
			}
			return false;
		},
		controlInfo: {
			name: nanoid(),
		},
	},

	render: (args) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Valid Input</h2>
			<ControlWithHooks
				Control={PublisherInputControl}
				{...args}
				defaultValue="valid"
			/>
		</Flex>
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
