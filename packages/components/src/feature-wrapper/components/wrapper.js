// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@publisher/classnames';
import WarningIcon from '@publisher/controls/src/libs/notice-control/icons/warning-icon';

export function Wrapper({
	type,
	text = '',
	children,
	className = '',
	...props
}: {
	type: 'free' | 'state' | 'breakpoint',
	text?: string | MixedElement,
	className?: string,
	children: MixedElement,
}): MixedElement {
	if (!text) {
		switch (type) {
			case 'free':
				text = __('Upgrade to PRO', 'publisher-core');
				break;
			case 'state':
				text = __('Not available in current state', 'publisher-core');
				break;
			case 'breakpoint':
				text = __(
					'Not available in current breakpoint.',
					'publisher-core'
				);
				break;
		}
	}

	return (
		<div
			className={componentClassNames(
				'feature-wrapper',
				'type-' + type,
				className
			)}
			{...props}
		>
			<div
				className={componentInnerClassNames('feature-wrapper__notice')}
			>
				<WarningIcon />

				<div
					className={componentInnerClassNames(
						'feature-wrapper__notice__text'
					)}
				>
					{text}
				</div>
			</div>

			<div
				className={componentInnerClassNames(
					'feature-wrapper__children'
				)}
			>
				{children}
			</div>
		</div>
	);
}
