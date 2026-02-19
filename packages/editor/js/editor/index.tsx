/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { registerPlugin } from '@wordpress/plugins';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store } from '../store';
import './store-persistence';
import BlocksUI from './blocks-ui';
import HeaderUI from './header-ui';
import StyleBook from './style-book';
import GlobalStylesNavigation from './navigation';
import GlobalStylesheet from './global-stylesheet';
import PrimarySidebarController from './primary-sidebar';
import SecondarySidebarInjector from './secondary-sidebar';
import GlobalStylesActionsForBlocks from './global-styles-actions-for-blocks';
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
		blockeraCurrentPostType: (window as any)?.blockeraCurrentPostType,
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

const bodyAdditionalClassnameForGlobalStyles = 'has-blockera-global-styles-ui';

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
		render: () => (
			<GlobalStylesNavigation
				className={bodyAdditionalClassnameForGlobalStyles}
			/>
		),
		icon: null,
	},
	{
		name: 'blockera-global-styles-panel',
		render: () => (
			<GlobalStyles className={bodyAdditionalClassnameForGlobalStyles} />
		),
		icon: null,
	},
	{
		name: 'blockera-global-styles-actions-for-blocks',
		render: () => (
			<GlobalStylesActionsForBlocks
				className={bodyAdditionalClassnameForGlobalStyles}
			/>
		),
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

export const registerBlockeraEditorInternalPlugins = () => {
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
};

export const registerBlockeraStyleVariationBlocks = () => {
	const setStyleVariationBlocks = (
		dispatch('blockera/editor') as {
			setStyleVariationBlocks: (
				styleName: string,
				blockNames: string[]
			) => void;
		}
	).setStyleVariationBlocks;
	const getStyleVariationBlocks = (
		select('blockera/editor') as {
			getStyleVariationBlocks: (styleName: string) => string[];
		}
	).getStyleVariationBlocks;
	const { getBlockTypes, getBlockStyles } = select('core/blocks') as {
		getBlockTypes: () => Array<{ name: string }>;
		getBlockStyles: (blockName: string) => Array<{ name: string }>;
	};

	// All Registered blocks.
	const blockTypes = getBlockTypes();

	// Set up listeners for each block type
	blockTypes.forEach((blockType) => {
		// Safety guard: ensure blockType exists
		if (!blockType) {
		}

		// Use cached select function instead of calling select() repeatedly
		const blockStyles = getBlockStyles(blockType.name) || [];

		// Register style variations for this block type
		blockStyles.forEach((blockStyle) => {
			// Safety guard: ensure blockStyle exists
			if (
				!blockStyle ||
				getStyleVariationBlocks(blockStyle.name).includes(
					blockType.name
				)
			) {
				return;
			}

			setStyleVariationBlocks(blockStyle.name, [blockType.name]);
		});
	});
};

/**
 * Registration API for initializing blockera global styles metadata.
 * Call this during editor bootstrap to sync metadata from PHP (e.g. from window or passed directly).
 * When metaData is omitted, reads from window.blockeraGlobalStylesMetaData as fallback for backward compatibility.
 *
 * @param {Object} [metaData] - The blockera global styles metadata. If omitted, reads from window.
 */
export const registerBlockeraGlobalStylesMetaData = (
	metaData?: Record<string, unknown>
): void => {
	const data =
		metaData ??
		(typeof window !== 'undefined' &&
		typeof (window as any).blockeraGlobalStylesMetaData === 'object'
			? (window as any).blockeraGlobalStylesMetaData
			: {});
	(dispatch(store.name) as any).setBlockeraGlobalStylesMetaData(data);
};

// Export bootstrap function
export { bootstrapEditor } from './bootstrap';
export {
	isBaseBreakpoint,
	getBaseBreakpoint,
	BreakpointsSettings,
	setupCanvasSettings,
	unstableBootstrapServerSideBreakpointDefinitions,
} from './header-ui';
