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
import { RangeControl } from '../../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

export default {
	title: 'Controls/RangeControl',
	component: RangeControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: 0,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const States = {
	args: {
		value: 0,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Range Control</h2>
				<RangeControl {...args} value={10} />
				<RangeControl {...args} value={30} withInputField={false} />
				<RangeControl {...args} min={0} max={100} value={20} />
				<RangeControl {...args} />
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<div data-testid="container">
			<RangeControl
				{...args}
				onChange={setStoryValue}
				value={storyValue}
			/>
		</div>
	);
};

export const Play = {
	args: {
		value: 20,
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
		const input = canvas.getByRole('spinbutton', {
			type: 'number',
		});

		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toHaveTextContent('20');
		});

		await step('Change input value', async () => {
			fireEvent.change(input, { target: { value: '30' } });
			await waitFor(
				async () => await expect(currentValue).toHaveTextContent('30'),
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
