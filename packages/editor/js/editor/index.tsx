/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import './store-persistence';
import BlocksUI from './blocks-ui';
import HeaderUI from './header-ui';
import StyleBook from './style-book';
import GlobalStylesNavigation from './navigation';
import GlobalStylesheet from './global-stylesheet';
import PrimarySidebarController from './primary-sidebar';
import SecondarySidebarInjector from './secondary-sidebar';
import GlobalStylesActionsForBlock from './global-styles-actions-for-blocks';
import AdditionalCssContextmenuObserver from './additional-css-contextmenu-observer';
import GlobalStyles, {
	registration as globalStylesRegistration,
} from './global-styles';

export const getSetupHeaderRequirements = () => {
	const allowedUsers = applyFilters(
		'blockera.editor.extensions.hooks.withBlockSettings.allowedUsers',
		[]
	);
	const allowedPostTypes = applyFilters(
		'blockera.editor.extensions.hooks.withBlockSettings.allowedPostTypes',
		[]
	);
	const currentUser = applyFilters('blockera.editor.extensions.currentUser', {
		roles: ['administrator'],
	});

	return {
		currentUser,
		allowedUsers,
		allowedPostTypes,
		blockeraCurrentPostType: window?.blockeraCurrentPostType,
	};
};

const needToShowCanvasEditor = ({
	allowedUsers,
	allowedPostTypes,
	currentUser,
	blockeraCurrentPostType,
}) => {
	// If no restrictions, block is available
	if (!allowedUsers.length && !allowedPostTypes.length) {
		return true;
	}

	// Build user roles set for O(1) lookups (performance optimization)
	const userRolesSet = new Set(currentUser.roles);

	// Check user role match (if user restrictions exist)
	let hasAllowedUser = true;
	if (allowedUsers.length) {
		hasAllowedUser = false;
		// Use for...of instead of filter to avoid intermediate array allocation
		for (const role of allowedUsers) {
			if (userRolesSet.has(role)) {
				hasAllowedUser = true;
				break;
			}
		}
	}

	// Check post type match (if post type restrictions exist)
	let hasAllowedPostType = true;
	if (allowedPostTypes.length && blockeraCurrentPostType) {
		hasAllowedPostType = allowedPostTypes.includes(blockeraCurrentPostType);
	}

	// Both conditions must be met if both restrictions exist
	return hasAllowedUser && hasAllowedPostType;
};

/**
 * Plugin configurations for the editor package.
 * Add new plugin configurations here as the package grows.
 */
const editorPlugins = [
	{
		name: 'blockera-combined-sidebar',
		render: SecondarySidebarInjector,
		icon: null,
	},
	{
		name: 'blockera-primary-sidebar-controller',
		render: PrimarySidebarController,
		icon: null,
	},
	{
		name: 'blockera-header-ui',
		render: HeaderUI,
		icon: null,
	},
	{
		name: 'blockera-additional-css-contextmenu-observer',
		render: AdditionalCssContextmenuObserver,
		icon: null,
	},
	{
		name: 'blockera-global-styles-navigation',
		render: GlobalStylesNavigation,
		icon: null,
	},
	{
		name: 'blockera-global-styles-panel',
		render: GlobalStyles,
		icon: null,
	},
	{
		name: 'blockera-global-styles-actions-for-blocks',
		render: GlobalStylesActionsForBlock,
		icon: null,
	},
	{
		name: 'blockera-global-stylesheet',
		render: GlobalStylesheet,
		icon: null,
	},
	{
		name: 'blockera-style-book',
		render: StyleBook,
		icon: null,
	},
	{
		name: 'blockera-blocks-ui',
		render: BlocksUI,
		icon: null,
	},
];

/**
 * Register all editor plugins.
 */
editorPlugins.forEach((plugin) => {
	// Skip registration and rendering blockera header ui components while not needs to that.
	if (
		'blockera-header-ui' === plugin.name &&
		!needToShowCanvasEditor(getSetupHeaderRequirements())
	) {
		return;
	}

	if ('blockera-global-styles-panel' === plugin.name) {
		globalStylesRegistration();
	}

	registerPlugin(plugin.name, {
		render: plugin.render,
		icon: plugin.icon,
	});
});

// Export bootstrap function
export { bootstrapEditor } from './bootstrap';
export {
	isBaseBreakpoint,
	getBaseBreakpoint,
	BreakpointsSettings,
	setupCanvasSettings,
	unstableBootstrapServerSideBreakpointDefinitions,
} from './header-ui';
