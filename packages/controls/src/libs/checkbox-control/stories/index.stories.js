/**
 * External dependencies
 */
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { CheckboxControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;

export default {
	title: 'Controls/CheckboxControl',
	component: CheckboxControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		value: false,
		label: 'Checkbox',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Checkbox</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks
						Control={CheckboxControl}
						checkboxLabel="Not Checked"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const States = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">Checkbox</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: false,
					}}
				>
					<ControlWithHooks
						Control={CheckboxControl}
						checkboxLabel="Not Checked"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: true,
					}}
				>
					<ControlWithHooks
						Control={CheckboxControl}
						checkboxLabel="Checked"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const Field = {
	args: {
		value: true,
		label: 'Enable',
		checkboxLabel: 'Feature Name',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">With Field</h2>
				<ControlContextProvider
					value={{
						name: nanoid(),
						value: args.value,
					}}
				>
					<ControlWithHooks Control={CheckboxControl} {...args} />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const Play = {
	args: {
		checkboxLabel: 'Checkbox',
		controlInfo: {
			name: nanoid(),
			value: false,
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={CheckboxControl} {...args} />,
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
			<Default.render {...Default.args} />

			<States.render {...States.args} />

			<Field.render {...Field.args} />
		</Flex>
	),
};
