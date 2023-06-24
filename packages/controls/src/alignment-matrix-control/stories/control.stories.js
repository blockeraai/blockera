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
import { useContext } from '@wordpress/element';

const Component = (args) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<AlignmentMatrixControl
			onValueChange={(newValue) => {
				setStoryValue(newValue);
			}}
			{...{ ...args, value: storyValue }}
		/>
	);
};

export default {
	title: 'Controls/Alignment Matrix',
	component: Component,
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

export const Playground = {
	args: {
		value: 'center center',
	},
	decorators: [StoryDataDecorator, inspectDecorator, ...decorators],
};
