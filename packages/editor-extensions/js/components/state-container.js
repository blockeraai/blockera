// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { Element } from 'react';
import { useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { isInnerBlock, isNormalState } from './utils';
import { settings } from '../libs/block-states/config';

export default function StateContainer({ children }: Object): Element<any> {
	const {
		currentBlock = 'master',
		currentInnerBlockState = 'normal',
		masterBlockState = 'normal',
	} = useSelect((select) => {
		const {
			getExtensionCurrentBlock,
			getExtensionInnerBlockState,
			getExtensionCurrentBlockState,
		} = select('blockera-core/extensions');

		return {
			currentBlock: getExtensionCurrentBlock(),
			currentInnerBlockState: getExtensionInnerBlockState(),
			masterBlockState: getExtensionCurrentBlockState(),
		};
	});

	let activeColor = settings[masterBlockState].color;

	if (isInnerBlock(currentBlock) && isNormalState(currentInnerBlockState)) {
		activeColor = '#cc0000';
	} else if (isInnerBlock(currentBlock)) {
		activeColor = settings[currentInnerBlockState].color;
	}

	return (
		<div
			className={getClassNames('state-container')}
			aria-label={__('Blockera Block State Container', 'blockera')}
			style={{
				color: 'inherit',
				'--blockera-controls-primary-color': activeColor,
				'--blockera-tab-panel-active-color': activeColor,
			}}
		>
			{children}
		</div>
	);
}
