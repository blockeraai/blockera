/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { BoxShadowFieldStyle } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import { BlockEditContext } from '../../hooks/context';

export function BorderAndShadowStyles({
	borderAndShadowConfig: { publisherBoxShadow },
}) {
	const { attributes: _attributes } = useContext(BlockEditContext);
	const generators = [];

	if (
		isActiveField(publisherBoxShadow) &&
		!arrayEquals(
			attributes.publisherBoxShadow.default,
			_attributes.publisherBoxShadow
		)
	) {
		generators.push(BoxShadowFieldStyle(publisherBoxShadow));
	}

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
