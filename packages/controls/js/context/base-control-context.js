// @flow

/**
 * External dependencies
 */
import { createContext } from '@wordpress/element';

export const BaseControlContext: Object = createContext({
	components: {
		EditorFeatureWrapper: null,
		EditorAdvancedLabelControl: null,
	},
});
