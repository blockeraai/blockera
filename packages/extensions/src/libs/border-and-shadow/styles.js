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
	borderAndShadowConfig: { boxShadow },
}) {
	const { attributes: _attributes } = useContext(BlockEditContext);
	const generators = [];

	if (
		isActiveField(boxShadow) &&
		!arrayEquals(
			attributes.publisherBoxShadowItems.default,
			_attributes.publisherBoxShadowItems
		)
	) {
		generators.push(BoxShadowFieldStyle(boxShadow));
	}

	//TODO: Please, implements publisherTransition and publisherBorder css generators!

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
