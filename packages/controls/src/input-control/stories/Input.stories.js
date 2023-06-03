import { InputControl } from '../input';

// const units = ['px', '%', 'em'];

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
	title: 'Controls/InputControl',
	component: InputControl,
	tags: ['autodocs'],
	argTypes: {
		initValue: '',
		attribute: null,
		className: 'publisher-input',
		units: [],
		suffix: '',
		range: false,
	},
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const primary = {
	args: {
		primary: true,
		initValue: '10px',
		attribute: 'publisherInput',
		range: false,
	},
};
