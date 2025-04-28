// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { Element, ComponentType } from 'react';
import { memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omit, isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import Picker from './picker';
import { useStatesManagerUtils } from '../hooks';
import type { StatesManagerProps } from '../types';
import { InnerBlocksExtension } from '../../inner-blocks';

const StatesManager: ComponentType<any> = memo(
	(props: StatesManagerProps): Element<any> => {
		const { currentBlock, innerBlocksProps } = props;
		const utils = useStatesManagerUtils(props);

		return (
			<div
				data-test={'blockera-block-state-container'}
				// className={getClassNames('state-container')}
				aria-label={__('Blockera Block State Container', 'blockera')}
			>
				<Picker
					{...{
						...utils,
						currentBlock,
						...(innerBlocksProps || {}),
					}}
				>
					{innerBlocksProps && (
						<InnerBlocksExtension
							values={innerBlocksProps.values}
							innerBlocks={innerBlocksProps.innerBlocks}
							block={innerBlocksProps.block}
							onChange={innerBlocksProps.onChange}
						/>
					)}
				</Picker>
			</div>
		);
	},
	(prev, next) => {
		return isEquals(
			omit(prev, ['onChange', 'children']),
			omit(next, ['onChange', 'children'])
		);
	}
);

export default StatesManager;
