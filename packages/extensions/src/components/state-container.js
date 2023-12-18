// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { getClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { settings } from '../libs/block-states/config';

export default function StateContainer({
	children,
	currentState,
}: Object): Element<any> {
	const activeColor = settings[currentState.type].color;

	return (
		<div
			className={getClassNames('state-container')}
			aria-label={__('Publisher Block State Container', 'publisher-core')}
			style={{
				color: 'inherit',
				'--publisher-controls-primary-color': activeColor,
				'--publisher-tab-panel-active-color': activeColor,
				'--publisher-controls-border-color-focus': activeColor,
				'--publisher-controls-border-color-hover': activeColor,
			}}
		>
			{children}
		</div>
	);
}
