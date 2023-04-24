/**
 * External dependencies
 */
import ExternalClassNames from 'classnames';

/**
 * Internal dependencies
 */
import DEFAULTS from './defaults';

export default function classnames(...names) {
	return ExternalClassNames(DEFAULTS, names);
}
