/**
 * Internal dependencies
 */
import {
	decorators,
	inspectDecorator,
	StoryDataContext,
	StoryDataDecorator,
} from '../../../../../.storybook/preview';
import { default as AlignmentMatrixControl } from '../index';
import { useContext, useState } from '@wordpress/element';

export default {
	title: 'Controls/Alignment Matrix',
	component: AlignmentMatrixControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: 'center center',
	},
	decorators: [inspectDecorator, ...decorators],
};

export const ChangeSize = {
	args: {
		value: 'center center',
		size: 40,
	},
	decorators: [inspectDecorator, ...decorators],
};

const AlignmentMatrixControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);
	const [value, setValue] = useState(storyValue);

	const handleOnChange = (newValue) => {
		setStoryValue(newValue);
		setValue(newValue);
	};

	return (
		<AlignmentMatrixControl
			{...args}
			onChange={handleOnChange}
			value={value}
		/>
	);
};

export const Playground = {
	args: {
		value: 'center center',
	},
	decorators: [StoryDataDecorator, inspectDecorator, ...decorators],
	render: (args) => <AlignmentMatrixControlWithHooks {...args} />,
};
