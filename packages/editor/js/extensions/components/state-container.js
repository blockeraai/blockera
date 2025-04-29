// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import { adjustHexColor } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { isInnerBlock, isNormalState } from './utils';
import { settings } from '../libs/block-card/block-states/config';
import { useExtensionsStore } from '../../hooks/use-extensions-store';

export default function StateContainer({ children }: Object): Element<any> {
	const { currentBlock, currentState, currentInnerBlockState } =
		useExtensionsStore();

	let activeColor = settings[currentState].color;

	if (isInnerBlock(currentBlock) && isNormalState(currentInnerBlockState)) {
		activeColor = '#cc0000';
	} else if (isInnerBlock(currentBlock)) {
		activeColor = settings[currentInnerBlockState].color;
	}

	return (
		<div
			className="blockera-state-colors-container"
			style={{
				color: 'inherit',
				'--blockera-controls-primary-color': activeColor,
				'--blockera-tab-panel-active-color': activeColor,
				'--blockera-controls-primary-color-darker-20': adjustHexColor(
					activeColor,
					-20
				),
			}}
		>
			{children}
		</div>
	);
}
