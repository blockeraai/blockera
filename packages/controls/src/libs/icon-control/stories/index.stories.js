/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { expect } from '@storybook/jest';
import {
	fireEvent,
	userEvent,
	waitFor,
	within,
} from '@storybook/testing-library';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { IconControl } from '../../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
} = Decorators;

export default {
	title: 'Controls/IconControl',
	component: IconControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		defaultValue: '',
		value: '',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const WithIcon = {
	args: {
		value: {
			icon: 'home',
			library: 'wp',
			uploadSVG: '',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const CustomURLIcon = {
	args: {
		value: {
			icon: 'home',
			library: 'custom',
			uploadSVG: {
				url: 'https://betterstudio.com/wp-content/uploads/2022/09/publisher-theme.svg',
				title: 'Publisher logo',
			},
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const WithSuggestions = {
	args: {
		value: {
			icon: 'pullLeft',
			library: 'wp',
			uploadSVG: '',
		},
		suggestionsQuery: 'left',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<IconControl {...args} onChange={setStoryValue} value={storyValue} />
	);
};

export const Play = {
	args: {},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks {...args} />,
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

export const Screenshot = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Empty</h2>
				<IconControl {...Default.args} />
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Selected Icon</h2>
				<IconControl {...WithIcon.args} />
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Custom Uploaded Icon</h2>
				<IconControl {...CustomURLIcon.args} />
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">With Suggestion Icons</h2>
				<IconControl {...WithSuggestions.args} />
			</Flex>
		</Flex>
	),
};
