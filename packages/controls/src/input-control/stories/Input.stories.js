/**
 * Storybook dependencies
 */
import { within, userEvent } from '@storybook/testing-library';

/**
 * Internal dependencies
 */
import { InputControl } from '../input';
import { BlockEditContext } from '@publisher/extensions';
import { useState } from '@wordpress/element';

let _value = {
	publisherInput: '20',
};
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

const onValueChange = (newValue) => {
	_value = newValue;
};

const WithMockBlockEditContext = (story) => {
	const [value, setValue] = useState(_value);

	return (
		<BlockEditContext.Provider
			value={{
				attributes: {
					publisherInput: value,
				},
				setAttributes: setValue,
			}}
		>
			{story()}
		</BlockEditContext.Provider>
	);
};

export const Default = {
	args: {
		range: false,
		onValueChange,
		initValue: '10px',
		className: 'publisher-input',
		value: _value.publisherInput,
	},
	decorators: [WithMockBlockEditContext],
};

export const InputWithUnit = {
	args: {
		units,
		range: false,
		onValueChange,
		initValue: '10px',
		className: 'publisher-input',
		value: _value.publisherInput,
	},
	decorators: [WithMockBlockEditContext],
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
		onValueChange,
		initValue: '10px',
		className: 'publisher-input',
		value: _value.publisherInput,
	},
	decorators: [WithMockBlockEditContext],
};

export const InputWithUnitAndSlider = {
	args: {
		units,
		range: true,
		onValueChange,
		initValue: '10px',
		className: 'publisher-input',
		value: _value.publisherInput,
	},
	decorators: [WithMockBlockEditContext],
};
