/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { fireEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { SearchControl } from '../../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

export default {
	title: 'Controls/SearchControl',
	component: SearchControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		placeholder: 'Enter to search...',
		value: '',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const States = {
	args: {
		placeholder: 'Enter to search...',
		value: '',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Search</h2>
				<SearchControl {...args} />
				<SearchControl {...args} className="is-hovered" />
				<SearchControl {...args} className="is-focused" />
				<SearchControl {...args} value="term" />
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<SearchControl {...args} onChange={setStoryValue} value={storyValue} />
	);
};

export const Play = {
	args: {
		value: '',
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const currentValue = canvas.getByTestId('current-value');
		const input = canvas.getByRole('searchbox');

		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toHaveTextContent('""');
		});

		await step('Search for term', async () => {
			fireEvent.change(input, { target: { value: 'term' } });
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('"term"'),
				{ timeout: 1000 }
			);

			fireEvent.change(input, { target: { value: '' } });
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('""'),
				{ timeout: 1000 }
			);
		});

		await step('Search and close', async () => {
			fireEvent.change(input, { target: { value: 'term' } });
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('"term"'),
				{ timeout: 1000 }
			);

			await canvas.getByLabelText('Reset search');
			await expect(
				canvas.getByLabelText('Reset search')
			).toBeInTheDocument();
			fireEvent.click(canvas.getByLabelText('Reset search'));

			// value should be reset to empty
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('""'),
				{ timeout: 1000 }
			);
		});
	},
};

export const Screenshot = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<States.render {...States.args} />
		</Flex>
	),
};
