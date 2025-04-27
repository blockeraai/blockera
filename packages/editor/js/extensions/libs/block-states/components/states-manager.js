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
import { ControlContextProvider } from '@blockera/controls';

/**
 * Internal dependencies
 */
import CombineRepeater from './combine-repeater';
import { useStatesManagerUtils } from '../hooks';
import type { StatesManagerProps } from '../types';

const StatesManager: ComponentType<any> = memo(
	(props: StatesManagerProps): Element<any> => {
		const { children, currentBlock, id = 'master-block-states' } = props;
		const utils = useStatesManagerUtils(props);

		return (
			<ControlContextProvider
				value={utils.contextValue}
				storeName={'blockera/controls/repeater'}
			>
				<div
					data-test={'blockera-block-state-container'}
					// className={getClassNames('state-container')}
					aria-label={__(
						'Blockera Block State Container',
						'blockera'
					)}
				>
					<CombineRepeater
						{...{
							...utils,
							id,
							currentBlock,
						}}
					>
						{children}
					</CombineRepeater>
				</div>
			</ControlContextProvider>
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
