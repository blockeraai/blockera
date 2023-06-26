/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Storybook dependencies
 */
import { expect } from '@storybook/jest';
import { waitFor, userEvent, within } from '@storybook/testing-library';

/**
 * Publisher Storybook dependencies
 */

import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { default as AlignmentMatrixControl } from '../index';
import { WithPlaygroundStyles } from '../../../../../.storybook/preview';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/AlignmentMatrixControl',
	component: AlignmentMatrixControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: 'center center',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const CustomSize = {
	args: {
		value: 'center center',
		size: 100,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
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
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		...SharedDecorators,
	],
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
