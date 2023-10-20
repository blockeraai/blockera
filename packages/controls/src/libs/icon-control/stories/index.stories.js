/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
import {
	fireEvent,
	userEvent,
	waitFor,
	within,
} from '@storybook/testing-library';
import { expect } from '@storybook/jest';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { IconControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/IconControl',
	component: IconControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		defaultValue: '',
		controlInfo: {
			name: nanoid(),
			value: '',
		},
	},
	render: (args) => <ControlWithHooks Control={IconControl} {...args} />,
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
};

export const WithIcon = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: {
				icon: 'home',
				library: 'wp',
				uploadSVG: '',
			},
		},
	},
	render: (args) => <ControlWithHooks Control={IconControl} {...args} />,
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
};

export const CustomURLIcon = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: {
				icon: 'home',
				library: 'custom',
				uploadSVG: {
					url: 'https://betterstudio.com/wp-content/uploads/2022/09/publisher-theme.svg',
					title: 'Publisher logo',
				},
			},
		},
	},
	render: (args) => <ControlWithHooks Control={IconControl} {...args} />,
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
};

export const WithSuggestions = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: {
				icon: 'pullLeft',
				library: 'wp',
				uploadSVG: '',
			},
		},
		suggestionsQuery: 'left',
	},
	render: (args) => <ControlWithHooks Control={IconControl} {...args} />,
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
};

export const Play = {
	args: {
		controlInfo: {
			name: nanoid(),
			value: {
				icon: '',
				library: '',
				uploadSVG: '',
			},
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks Control={IconControl} {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const chooseButton = canvas.getByLabelText('Choose Icon…');

		await step('Story data is available', async () => {
			await expect(currentValue).toBeInTheDocument();
		});

		await step('Click choose', async () => {
			await expect(chooseButton).toBeInTheDocument();

			await userEvent.click(chooseButton);

			await expect(canvas.getByRole('searchbox')).toBeInTheDocument();
		});

		await step('Search for icon', async () => {
			fireEvent.change(canvas.getByRole('searchbox'), {
				target: {
					value: 'music',
				},
			});

			await expect(
				canvas.getByLabelText('audio Icon')
			).toBeInTheDocument();
		});

		await step('choose icon', async () => {
			fireEvent.click(canvas.getByLabelText('audio Icon'));
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "icon": "audio", "library": "wp", "uploadSVG": "" }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Remove icon', async () => {
			fireEvent.click(canvas.getByLabelText('Remove Icon'));
			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "icon": "", "library": "", "uploadSVG": "" }'
					),
				{ timeout: 1000 }
			);
		});
	},
};

export const All = {
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Empty</h2>
				<ControlContextProvider value={Default.args.controlInfo}>
					<Default.render {...Default.args} />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Selected Icon</h2>
				<ControlContextProvider value={WithIcon.args.controlInfo}>
					<WithIcon.render {...WithIcon.args} />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Custom Uploaded Icon</h2>
				<ControlContextProvider value={CustomURLIcon.args.controlInfo}>
					<CustomURLIcon.render {...CustomURLIcon.args} />
				</ControlContextProvider>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">With Suggestion Icons</h2>
				<ControlContextProvider
					value={WithSuggestions.args.controlInfo}
				>
					<WithSuggestions.render {...WithSuggestions.args} />
				</ControlContextProvider>
			</Flex>
		</Flex>
	),
};
