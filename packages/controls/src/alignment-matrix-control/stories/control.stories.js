/**
 * Internal dependencies
 */
import { fireEvent, userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import {
	decorators,
	inspectDecorator,
	StoryDataContext,
	StoryDataDecorator,
} from '../../../../../.storybook/preview';
import { default as AlignmentMatrixControl } from '../index';
import { useContext } from '@wordpress/element';

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

export const CustomSize = {
	args: {
		value: 'center center',
		size: 100,
	},
	decorators: [inspectDecorator, ...decorators],
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<AlignmentMatrixControl
			{...args}
			onChange={setStoryValue}
			value={storyValue}
		/>
	);
};

export const ChangeCell = {
	args: {
		value: 'center center',
	},
	decorators: [StoryDataDecorator, inspectDecorator, ...decorators],
	render: (args) => (
		<div data-testid="test">
			<ControlWithHooks {...args} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const test = canvas.getByTestId('test');
		setTimeout(() => {
			console.log(test);
		}, 1000);

		// file all `gridcell`. There is no any custom id or value for selecting specific cell.
		const cells = test.querySelecotor('span[role="gridcell"]');

		console.log(cells);
		// await userEvent.click(cells[0]);

		// console.log(canvas.getByTestId('current-value'));
		// await expect(canvas.getByTestId('current-value')).toMatchText(
		// 	'center center'
		// );
	},
};
