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

export default function StateContainer({
	children,
	currentState,
}: Object): Element<any> {
	const { currentBlock = 'master', selectedState = 'normal' } = useSelect(
		(select) => {
			const { getExtensionCurrentBlock, getExtensionCurrentBlockState } =
				select('publisher-core/extensions');

			return {
				currentBlock: getExtensionCurrentBlock(),
				selectedState: getExtensionCurrentBlockState(),
			};
		}
	);

	const activeColor =
		isInnerBlock(currentBlock) && isNormalState(selectedState)
			? '#cc0000'
			: settings[currentState.type].color;

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
