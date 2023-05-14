/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import boxShadow from './box-shadow/edit';

const controlsExtensions = applyFilters('publisher.core.extensions.controls', {
	boxShadow,
});

export default controlsExtensions;
