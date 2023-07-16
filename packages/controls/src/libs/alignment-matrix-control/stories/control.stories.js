/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { expect } from '@storybook/jest';
import { waitFor, userEvent, within } from '@storybook/testing-library';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { default as AlignmentMatrixControl } from '../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

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

export const Play = {
	args: {
		value: 'center center',
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		...SharedDecorators,
	],
	parameters: {
		jest: ['utils.spec.js'],
	},
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
						canvas.getByTestId('current-value')
					).toHaveTextContent(
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

export const Screenshot = {
	args: {
		value: 'center center',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Custom Size</h2>
				<AlignmentMatrixControl
					{...args}
					size="50"
					value="center center"
				/>
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Top Left</h2>
				<AlignmentMatrixControl {...args} value="top left" />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Top Center</h2>
				<AlignmentMatrixControl {...args} value="top center" />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Top Right</h2>
				<AlignmentMatrixControl {...args} value="top right" />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Center Left</h2>
				<AlignmentMatrixControl {...args} value="center left" />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Center Center</h2>
				<AlignmentMatrixControl {...args} value="center center" />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Center Right</h2>
				<AlignmentMatrixControl {...args} value="center right" />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Bottom Left</h2>
				<AlignmentMatrixControl {...args} value="bottom left" />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Bottom Center</h2>
				<AlignmentMatrixControl {...args} value="bottom center" />
			</Flex>

			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Bottom Right</h2>
				<AlignmentMatrixControl {...args} value="bottom right" />
			</Flex>
		</Flex>
	),
};
