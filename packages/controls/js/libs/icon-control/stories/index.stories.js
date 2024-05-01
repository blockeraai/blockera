/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { IconControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, SharedDecorators } = Decorators;

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
					url: 'https://betterstudio.com/wp-content/uploads/2022/09/blockera-theme.svg',
					title: ' logo',
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
