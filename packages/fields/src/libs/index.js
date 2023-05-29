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
import AnglePicker from './angle-picker';
import Select from './select';

export function getFields() {
	return applyFilters('publisher.core.fields.libs', [
		Input,
		BoxShadow,
		Transition,
		AnglePicker,
		Select,
	]);
}
