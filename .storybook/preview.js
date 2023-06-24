/**
 * Storybook dependencies
 */
import { withTests } from '@storybook/addon-jest';
import {
	Title,
	Subtitle,
	Description,
	Primary,
	Controls,
	Stories,
} from '@storybook/blocks';

/**
 * Internal dependencies
 */
import results from '../.jest-test-results.json';
import { WithRTL } from './decorators/with-rtl';
import { WithTheme } from './decorators/with-theme';
import { WithGlobalCSS } from './decorators/with-global-css';
import { WithMarginChecker } from './decorators/with-margin-checker';
import { WithMaxWidthWrapper } from './decorators/with-max-width-wrapper';
import { WithInspectorStyles } from './decorators/with-inspector-styles';
import WithBlockEditContext from './decorators/with-block-edit-context';

export const globalTypes = {
	direction: {
		name: 'RTL',
		description: 'Simulate an RTL language.',
		defaultValue: 'ltr',
		toolbar: {
			icon: 'globe',
			items: [
				{ value: 'ltr', title: 'LTR' },
				{ value: 'rtl', title: 'RTL' },
			],
		},
	},
	componentsTheme: {
		name: 'Theme',
		description: 'Change the components theme. (Work in progress)',
		defaultValue: 'default',
		toolbar: {
			icon: 'paintbrush',
			items: [
				{ value: 'default', title: 'Default' },
				{ value: 'darkBg', title: 'Dark (background)' },
				{
					value: 'lightGrayBg',
					title: 'Light gray (background)',
				},
				{ value: 'classic', title: 'Classic (accent)' },
			],
		},
	},
	css: {
		name: 'Global CSS',
		description:
			'Inject global CSS that may be loaded in certain contexts.',
		defaultValue: 'basic',
		toolbar: {
			icon: 'document',
			items: [
				{ value: 'none', title: 'None' },
				{ value: 'basic', title: 'Font only' },
				{
					value: 'wordpress',
					title: 'WordPress (common, forms, dashicons)',
				},
			],
		},
	},
	marginChecker: {
		name: 'Margin Checker',
		description:
			'Show a div before and after the component to check for unwanted margins.',
		defaultValue: 'hide',
		toolbar: {
			icon: 'collapse',
			items: [
				{ value: 'hide', title: 'Hide' },
				{ value: 'show', title: 'Show' },
			],
		},
	},
	maxWidthWrapper: {
		name: 'Max-Width Wrapper',
		description: 'Wrap the component in a div with a max-width.',
		defaultValue: 'none',
		toolbar: {
			icon: 'outline',
			items: [
				{ value: 'none', title: 'None' },
				{ value: 'wordpress-sidebar', title: 'WP Sidebar' },
			],
		},
	},
};

export const decorators = [
	WithRTL,
	WithTheme,
	WithGlobalCSS,
	WithMarginChecker,
	WithMaxWidthWrapper,
	WithBlockEditContext,
	withTests({
		results,
	}),
];

export { StoryDataContext } from './decorators/with-story-data/context';
export { default as StoryDataDecorator } from './decorators/with-story-data/with-story-data-decorator';

export const inspectDecorator = WithInspectorStyles;

// eslint-disable-next-line jsdoc/valid-types
/** @type { import('@storybook/react').Preview } */
const preview = {
	parameters: {
		options: {
			storySort: {
				order: ['Components', 'Controls', 'Extensions', '*'],
			},
		},
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
			expanded: true,
		},
		docs: {
			page: () => (
				<>
					<Title />
					<Subtitle />
					<Description />
					<Primary />
					<Controls />
					<Stories />
				</>
			),
		},
		sourceLinkPrefix:
			'https://gitlab.com/better-projects/publisher-fse/publisher-core',
	},
	argTypes: {
		children: {
			table: {
				disable: true,
			},
		},
	},
};

export default preview;
