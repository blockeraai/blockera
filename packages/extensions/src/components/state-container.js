// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { Element } from 'react';
import { useSelect } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { getClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isInnerBlock, isNormalState } from './utils';
import { settings } from '../libs/block-states/config';

export default function StateContainer({ children }: Object): Element<any> {
	const {
		currentBlock = 'master',
		innerBlockState = 'normal',
		masterBlockState = 'normal',
	} = useSelect((select) => {
		const {
			getExtensionCurrentBlock,
			getExtensionInnerBlockState,
			getExtensionCurrentBlockState,
		} = select('publisher-core/extensions');

		return {
			currentBlock: getExtensionCurrentBlock(),
			innerBlockState: getExtensionInnerBlockState(),
			masterBlockState: getExtensionCurrentBlockState(),
		};
	});

	let activeColor = settings[masterBlockState].color;

	if (isInnerBlock(currentBlock) && isNormalState(innerBlockState)) {
		activeColor = '#cc0000';
	} else if (isInnerBlock(currentBlock)) {
		activeColor = settings[innerBlockState].color;
	}

	return (
		<div
			className={getClassNames('state-container')}
			aria-label={__('Publisher Block State Container', 'publisher-core')}
			style={{
				color: 'inherit',
				'--publisher-controls-primary-color': activeColor,
				'--publisher-tab-panel-active-color': activeColor,
			}}
		>
			{children}
		</div>
	);
}
