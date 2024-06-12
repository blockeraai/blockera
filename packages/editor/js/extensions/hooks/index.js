// @flow
/**
 * External dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import withBlockSettings from './block-settings';

export {
	useBlockContext,
	BlockEditContext,
	BlockEditContextProvider,
} from './context';

export default function applyHooks(beforeApplyHooks: () => void) {
	if ('function' === typeof beforeApplyHooks) {
		beforeApplyHooks();
	}

	addFilter(
		'blocks.registerBlockType',
		'blockera.editor.extensions.withAdvancedControlsAttributes',
		(settings: Object, name: Object): Object =>
			withBlockSettings(settings, name, {
				currentUser: applyFilters(
					'blockera.editor.extensions.currentUser',
					{
						roles: [],
					}
				),
				notAllowedUsers: applyFilters(
					'blockera.editor.extensions.hooks.withBlockSettings.notAllowedUsers',
					[]
				),
				unsupportedBlocks: applyFilters(
					'blockera.editor.extensions.hooks.withBlockSettings.disabledBlocks',
					[]
				),
			})
	);
}
export { default as withBlockSettings } from './block-settings';
