/**
 * External dependencies
 */
import { fireEvent, waitFor, within } from '@storybook/testing-library';
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
import { SearchControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

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
	render: (args) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Search<span>Empty</span>
			</h2>

			<ControlContextProvider
				value={{
					name: nanoid(),
					value: '',
				}}
			>
				<ControlWithHooks Control={SearchControl} {...args} />
			</ControlContextProvider>
		</Flex>
	),
};

export const States = {
	args: {
		placeholder: 'Enter to search...',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">
					Search<span>States</span>
				</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: '',
					}}
				>
					<ControlWithHooks Control={SearchControl} {...args} />
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: '',
					}}
				>
					<ControlWithHooks
						Control={SearchControl}
						{...args}
						className="is-hovered"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: '',
					}}
				>
					<ControlWithHooks
						Control={SearchControl}
						{...args}
						className="is-focused"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: nanoid(),
						value: 'publisher',
					}}
				>
					<ControlWithHooks Control={SearchControl} {...args} />
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const Play = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: '',
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={SearchControl} {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const currentValue = canvas.getByTestId('current-value');
		const input = canvas.getByRole('searchbox');

		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toHaveTextContent('""');
		});

		await step('Search for term', async () => {
			fireEvent.change(input, { target: { value: 'publisher' } });
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent('"publisher"'),
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

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render {...Default.args} />

			<States.render {...States.args} />
		</Flex>
	),
};
