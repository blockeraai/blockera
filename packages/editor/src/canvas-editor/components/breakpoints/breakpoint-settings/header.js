// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { BreakpointIcon } from '@publisher/extensions/src/libs/block-states/helpers';

export default function ({
	item,
	itemId,
}: {
	item: Object,
	itemId: number,
}): MixedElement {
	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			aria-label={sprintf(
				// translators: it's the aria label for repeater item
				__('Item %d', 'publisher-core'),
				itemId + 1
			)}
		>
			<span className={controlInnerClassNames('header-icon')}>
				<BreakpointIcon name={item.type} />
			</span>

			<span className={controlInnerClassNames('header-label')}>
				{item.label}
			</span>

			<span className={controlInnerClassNames('header-values')}>
				{!item.settings.max && (
					<>
						{item.settings.min.replace(/[a-z]+/i, '')} {'<'}
					</>
				)}
				{item.settings.max && item.settings.min && (
					<>
						{item.settings.min.replace(/[a-z]+/i, '')} to{' '}
						{item.settings.max.replace(/[a-z]+/i, '')}
					</>
				)}
				{!item.settings.min && (
					<>
						{'< '}
						{item.settings.max.replace(/[a-z]+/i, '')}
					</>
				)}
			</span>
		</div>
	);
}
