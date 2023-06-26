/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import { InputControl } from '../../index';
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';

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
	decorators: [inspectDecorator, ...decorators],
	parameters: {
		jest: ['input.spec.js'],
	},
};

export const TextInput = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => (
		<>
			<h2 className="story-heading">Text Input</h2>
			<Flex direction="column" gap="20px">
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
		</>
	),
};

export const NumberInput = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => (
		<>
			<h2 className="story-heading">Number Input</h2>
			<Flex direction="column" gap="20px">
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

			<h2 className="story-heading">Range Number Input</h2>
			<Flex direction="column" gap="20px">
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
		</>
	),
};

export const UnitsInput = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => (
		<>
			<h2 className="story-heading">Units Input</h2>
			<Flex direction="column" gap="20px">
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

			<h2 className="story-heading">Range Units Input</h2>
			<Flex direction="column" gap="20px">
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
		</>
	),
};

export const CssInput = {
	args: {
		unitType: 'general',
		defaultValue: '10px',
		className: 'publisher-input',
		value: '20px',
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => (
		<>
			<h2 className="story-heading">CSS Input</h2>
			<Flex direction="column" gap="20px">
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
		</>
	),
};

export const Screenshot = {
	args: {
		defaultValue: '10px',
		value: '20px',
	},
	decorators: [inspectDecorator, ...decorators],
	render: (args) => (
		<>
			<TextInput.render {...args} />

			<NumberInput.render {...args} />

			<UnitsInput.render {...args} />

			<CssInput.render {...args} />
		</>
	),
};
