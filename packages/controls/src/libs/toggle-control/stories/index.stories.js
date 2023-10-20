/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { ToggleControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/ToggleControl',
	component: ToggleControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: false,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const States = {
	args: {
		label: 'test',
		value: false,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Toggle</h2>
				<ToggleControl label="Not Checked" value={false} />
				<ToggleControl label="Checked" value={true} />
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<ToggleControl {...args} onChange={setStoryValue} value={storyValue} />
	);
};

export const Play = {
	args: {
		label: '',
		value: false,
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
		const checkbox = canvas.getByRole('checkbox');

		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toHaveTextContent('false');
		});

		await step('Change Test', async () => {
			await userEvent.click(checkbox);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('true'),
				{ timeout: 1000 }
			);

			await userEvent.click(checkbox);
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('false'),
				{ timeout: 1000 }
			);
		});
	},
};

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<States.render {...States.args} />
		</Flex>
	),
};
