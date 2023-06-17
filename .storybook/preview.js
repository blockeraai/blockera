/**
 * Storybook dependencies
 */
import { withTests } from "@storybook/addon-jest";

/**
 * Internal dependencies
 */
import results from "../.jest-test-results.json";
import { WithRTL } from "./decorators/with-rtl";
import { WithTheme } from "./decorators/with-theme";
import { WithGlobalCSS } from "./decorators/with-global-css";
import { WithMarginChecker } from "./decorators/with-margin-checker";
import { WithMaxWidthWrapper } from "./decorators/with-max-width-wrapper";

export const globalTypes = {
	direction: {
		name: "RTL",
		description: "Simulate an RTL language.",
		defaultValue: "ltr",
		toolbar: {
			icon: "globe",
			items: [
				{ value: "ltr", title: "LTR" },
				{ value: "rtl", title: "RTL" },
			],
		},
	},
	componentsTheme: {
		name: "Theme",
		description: "Change the components theme. (Work in progress)",
		defaultValue: "default",
		toolbar: {
			icon: "paintbrush",
			items: [
				{ value: "default", title: "Default" },
				{ value: "darkBg", title: "Dark (background)" },
				{ value: "lightGrayBg", title: "Light gray (background)" },
				{ value: "classic", title: "Classic (accent)" },
			],
		},
	},
	css: {
		name: "Global CSS",
		description: "Inject global CSS that may be loaded in certain contexts.",
		defaultValue: "basic",
		toolbar: {
			icon: "document",
			items: [
				{ value: "none", title: "None" },
				{ value: "basic", title: "Font only" },
				{
					value: "wordpress",
					title: "WordPress (common, forms, dashicons)",
				},
			],
		},
	},
	marginChecker: {
		name: "Margin Checker",
		description: "Show a div before and after the component to check for unwanted margins.",
		defaultValue: "hide",
		toolbar: {
			icon: "collapse",
			items: [
				{ value: "hide", title: "Hide" },
				{ value: "show", title: "Show" },
			],
		},
	},
	maxWidthWrapper: {
		name: "Max-Width Wrapper",
		description: "Wrap the component in a div with a max-width.",
		defaultValue: "none",
		toolbar: {
			icon: "outline",
			items: [
				{ value: "none", title: "None" },
				{ value: "wordpress-sidebar", title: "WP Sidebar" },
			],
		},
	},
};

export const decorators = [
	withTests({
		results,
	}),
	WithGlobalCSS,
	WithMarginChecker,
	WithRTL,
	WithMaxWidthWrapper,
	WithTheme,
];

// eslint-disable-next-line jsdoc/valid-types
/** @type { import('@storybook/react').Preview } */
const preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
			sort: "requiredFirst",
		},
		sourceLinkPrefix: "https://gitlab.com/better-projects/publisher-fse/publisher-core",
	},
};

export default preview;
