/**
 * Storybook dependencies
 */
import { within, userEvent } from '@storybook/testing-library';

/**
 * Internal dependencies
 */
import { InputControl } from '../input';
import { BlockEditContext } from '@publisher/extensions';

let attributes = {
	publisherInput: '20',
};
const setAttributes = (newAttributes) => {
	attributes = newAttributes;
};
const { publisherInput: value } = attributes;
const units = [
	{ value: 'px', label: 'px', default: 0 },
	{ value: '%', label: '%', default: 10 },
	{ value: 'em', label: 'em', default: 0 },
];
const onChange = (newValue) => {
	attributes = {
		publisherInput: newValue,
	};
};

export default {
	title: 'Controls/InputControl',
	component: InputControl,
	tags: ['autodocs'],
};

const WithMockBlockEditContext = (story) => (
	<BlockEditContext.Provider
		value={{
			attributes,
			setAttributes,
		}}
	>
		{story()}
	</BlockEditContext.Provider>
);

export const Default = {
	args: {
		range: false,
		onChange,
		initValue: '10px',
		className: 'publisher-input',
		value,
		attribute: 'publisherInput',
	},
	decorators: [WithMockBlockEditContext],
};

export const InputWithUnit = {
	args: {
		units,
		range: false,
		onChange,
		initValue: '10px',
		className: 'publisher-input',
		value,
		// repeaterAttribute: 'test',
		// repeaterAttributeIndex: 0,
		attribute: 'publisherInput',
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
		onChange,
		initValue: '10px',
		className: 'publisher-input',
		value,
		// repeaterAttribute: 'test',
		// repeaterAttributeIndex: 0,
		attribute: 'publisherInput',
	},
	decorators: [WithMockBlockEditContext],
};

export const InputWithUnitAndSlider = {
	args: {
		units,
		range: true,
		onChange,
		initValue: '10px',
		className: 'publisher-input',
		value,
		// repeaterAttribute: 'test',
		// repeaterAttributeIndex: 0,
		attribute: 'publisherInput',
	},
	decorators: [WithMockBlockEditContext],
};
