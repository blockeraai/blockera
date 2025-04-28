// @flow

/**
 * External dependencies
 */
import { memo } from '@wordpress/element';
import type { ComponentType, Element } from 'react';

/**
 * Blockera dependencies
 */
// import { isEquals, omit } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { useBlockComposite } from '../hooks';
import type { BlockCompositeProps } from '../types';
import { BlockCompositeInserter } from './block-composite-inserter';

export const BlockComposite: ComponentType<BlockCompositeProps> = memo(
	(props: BlockCompositeProps): Element<any> => {
		const compositeProps = useBlockComposite(props);

		return <BlockCompositeInserter {...compositeProps} />;
	}
	// (prev, next) => {
	// 	return isEquals(
	// 		omit(prev, ['onChange', 'children']),
	// 		omit(next, ['onChange', 'children'])
	// 	);
	// }
);
