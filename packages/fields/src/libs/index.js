/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import Input from './input';
import BoxShadow from './box-shadow';
import Transition from './transition';

export function getFields() {
	return applyFilters('publisher.core.fields.libs', [
		Input,
		BoxShadow,
		Transition,
	]);
}
