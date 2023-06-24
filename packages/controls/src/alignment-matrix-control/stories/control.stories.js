/**
 * Internal dependencies
 */
import { waitFor, userEvent, within } from '@storybook/testing-library';
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
		<div data-testid="change-cell-test-id">
			<ControlWithHooks {...args} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const test = canvas.getByTestId('change-cell-test-id');

		// file all `gridcell`. There is no any custom id or value for selecting specific cell.

		for (const node of test.querySelectorAll('span[role="gridcell"]')) {
			await userEvent.click(node);

			await waitFor(
				async () => {
					await expect(
						canvas.getByTestId('current-value').innerText.trim()
					).toBe(
						node
							.querySelector('.components-visually-hidden')
							.innerText.trim()
					);
				},
				{ timeout: 1000 }
			);
		}
	},
};
