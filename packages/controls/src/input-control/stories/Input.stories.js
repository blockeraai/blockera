/**
 * External dependencies
 */
import { within, userEvent } from '@storybook/testing-library';

/**
 * Internal dependencies
 */
import { InputControl } from '../../index';
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';
import { Flex } from '@publisher/components';

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
		className: 'publisher-input',
		value: '20',
	},
	decorators: [inspectDecorator, ...decorators],
	parameters: {
		jest: ['input.spec.js'],
	},
};

export const InputWithUnit = {
	args: {
		units,
		defaultValue: '10px',
		className: 'publisher-input',
		value: '20px',
	},
	decorators: [inspectDecorator, ...decorators],
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Enter input value', async () => {
			await userEvent.type(canvas.getByDisplayValue('20'), '60');
		});
	},
};

export const InputWithSlider = {
	args: {
		range: true,
		defaultValue: '10px',
		className: 'publisher-input',
		value: '20px',
	},
	decorators: [inspectDecorator, ...decorators],
};

export const InputWithUnitAndSlider = {
	args: {
		units,
		range: true,
		defaultValue: '10px',
		className: 'publisher-input',
		value: '20px',
	},
	decorators: [inspectDecorator, ...decorators],
};

export const Screenshot = {
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
