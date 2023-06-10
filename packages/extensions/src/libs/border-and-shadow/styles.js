/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { BoxShadowFieldStyle, OutlineFieldStyle } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import { BlockEditContext } from '../../hooks/context';

export function BorderAndShadowStyles({
	borderAndShadowConfig: { publisherBoxShadow, publisherOutline },
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

	if (
		isActiveField(publisherOutline) &&
		!arrayEquals(
			attributes.publisherOutline.default,
			_attributes.publisherOutline
		)
	) {
		generators.push(OutlineFieldStyle(publisherOutline));
	}

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
