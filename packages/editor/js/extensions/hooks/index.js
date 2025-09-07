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

const MappedProcessedRegisterBlockType: Map<string, boolean> = new Map();

export default function applyHooks(beforeApplyHooks: () => void) {
	if ('function' === typeof beforeApplyHooks) {
		beforeApplyHooks();
	}

	addFilter(
		'blocks.registerBlockType',
		'blockera.editor.extensions.withAdvancedControlsAttributes',
		(settings: Object, name: Object): Object => {
			if (MappedProcessedRegisterBlockType.has(name)) {
				return settings;
			}

			MappedProcessedRegisterBlockType.set(name, true);

			return withBlockSettings(settings, name, {
				currentUser: applyFilters(
					'blockera.editor.extensions.currentUser',
					{
						roles: ['administrator'],
					}
				),
				allowedUsers: applyFilters(
					'blockera.editor.extensions.hooks.withBlockSettings.allowedUsers',
					[]
				),
				unsupportedBlocks: applyFilters(
					'blockera.editor.extensions.hooks.withBlockSettings.disabledBlocks',
					[]
				),
				allowedPostTypes: applyFilters(
					'blockera.editor.extensions.hooks.withBlockSettings.allowedPostTypes',
					[]
				),
			});
		},
		9e2
	);
}
export { default as withBlockSettings } from './block-settings';
