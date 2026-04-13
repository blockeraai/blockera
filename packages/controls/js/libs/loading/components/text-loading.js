// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';

export default function TextLoading({
	text = __('Loading', 'blockera'),
	className = '',
	align = 'start',
	...props
}: {
	text?: string,
	className?: string,
	align?: 'start' | 'center' | 'end',
	props?: Object,
}): MixedElement {
	return (
		<div
			{...props}
			className={componentClassNames(
				'text-loading',
				'align-' + align,
				className
			)}
		>
			{text}
			<span className={componentInnerClassNames('text-loading__dots')}>
				<span>.</span>
				<span>.</span>
				<span>.</span>
			</span>
		</div>
	);
}
