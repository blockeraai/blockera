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
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { ControlContextProvider, useControlContext } from '../../../context';
import { nanoid } from 'nanoid';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

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
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 10,
					}}
				>
					<ControlWithHooks {...args} />
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 30,
					}}
				>
					<ControlWithHooks {...args} withInputField={false} />
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 20,
					}}
				>
					<ControlWithHooks {...args} min={0} max={100} />
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks {...args} />
				</ControlContextProvider>
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);
	const {
		controlInfo: { name: controlId },
		dispatch: { modifyControlValue },
	} = useControlContext();

	return (
		<div data-testid="container">
			<RangeControl
				{...args}
				onChange={(newValue) => {
					setStoryValue(newValue);
					modifyControlValue({
						controlId,
						value: newValue,
					});
				}}
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
		WithControlDataProvider,
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
