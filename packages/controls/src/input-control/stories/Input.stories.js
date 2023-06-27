/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';

/**
 * Publisher Storybook dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { InputControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../.storybook/decorators/with-playground-styles';

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
		defaultValue: '10',
		value: '20',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
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
			<InputControl type="text" {...args} />
			<InputControl type="text" className="is-hovered" {...args} />
			<InputControl type="text" className="is-focused" {...args} />
			<InputControl type="text" noBorder={true} {...args} />
			<InputControl
				type="text"
				className="is-focused"
				noBorder={true}
				{...args}
			/>
		</Flex>
	),
};

export const NumberInput = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Number Input</h2>
				<InputControl {...args} type="number" value="20" />
				<InputControl
					{...args}
					type="number"
					value="20"
					className="is-hovered"
				/>
				<InputControl
					{...args}
					type="number"
					value="20"
					className="is-focused"
				/>
				<InputControl
					{...args}
					type="number"
					value="20"
					noBorder={true}
				/>
				<InputControl
					{...args}
					type="number"
					className="is-focused"
					value="20"
					noBorder={true}
				/>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Range Number Input</h2>
				<InputControl {...args} range={true} type="number" value="20" />
				<InputControl
					{...args}
					range={true}
					type="number"
					value="20"
					className="is-hovered"
				/>
				<InputControl
					{...args}
					range={true}
					type="number"
					value="20"
					className="is-focused"
				/>
				<InputControl
					{...args}
					range={true}
					type="number"
					value="20"
					noBorder={true}
				/>
				<InputControl
					{...args}
					range={true}
					type="number"
					className="is-focused"
					value="20"
					noBorder={true}
				/>
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
				<InputControl {...args} units={units} type="number" />
				<InputControl
					{...args}
					units={units}
					type="number"
					className="is-hovered"
				/>
				<InputControl
					{...args}
					units={units}
					type="number"
					className="is-focused"
				/>
				<InputControl
					{...args}
					units={units}
					type="number"
					noBorder={true}
				/>
				<InputControl
					{...args}
					units={units}
					type="number"
					className="is-focused"
					noBorder={true}
				/>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Range Units Input</h2>
				<InputControl
					{...args}
					range={true}
					units={units}
					type="number"
				/>
				<InputControl
					{...args}
					range={true}
					units={units}
					type="number"
					className="is-hovered"
				/>
				<InputControl
					{...args}
					range={true}
					units={units}
					type="number"
					className="is-focused"
				/>
				<InputControl
					{...args}
					range={true}
					units={units}
					type="number"
					noBorder={true}
				/>
				<InputControl
					{...args}
					range={true}
					units={units}
					type="number"
					className="is-focused"
					noBorder={true}
				/>
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
			<InputControl {...args} unitType="general" />
			<InputControl {...args} unitType="general" value="1auto" />
			<InputControl {...args} range={true} unitType="general" />
			<InputControl
				{...args}
				range={true}
				unitType="general"
				value="1auto"
			/>
		</Flex>
	),
};

export const Screenshot = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="50px">
			<TextInput.render {...args} />

			<NumberInput.render {...args} />

			<UnitsInput.render {...args} />

			<CssInput.render {...args} />
		</Flex>
	),
};
