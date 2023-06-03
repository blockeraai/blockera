import ToggleControl from '../';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
	title: 'Controls/ToggleControl',
	component: ToggleControl,
	tags: ['autodocs'],
	argTypes: {
		label: '',
	},
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
	args: {
		primary: true,
		label: 'Turn ON?',
	},
};

export const Secondary = {
	args: {
		primary: false,
		label: 'Turn ON?',
		onChange: (state) => !state,
	},
};
