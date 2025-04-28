// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement, ComponentType } from 'react';
import { memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
// import { omit, isEquals } from '@blockera/utils';
import { getClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import UI from './ui';
import type { StatesManager as StatesManagerProps } from '../types';

const StatesManager: ComponentType<StatesManagerProps> = memo(
	(props: StatesManagerProps): MixedElement => {
		return (
			<div
				data-test={'blockera-block-state-container'}
				className={getClassNames('state-container')}
				aria-label={__('Blockera Block State Container', 'blockera')}
			>
				<UI {...props}>{props?.children}</UI>
			</div>
		);
	}
	// (prev, next) => {
	// 	return isEquals(
	// 		omit(prev, ['onChange', 'children']),
	// 		omit(next, ['onChange', 'children'])
	// 	);
	// }
);

export default StatesManager;
