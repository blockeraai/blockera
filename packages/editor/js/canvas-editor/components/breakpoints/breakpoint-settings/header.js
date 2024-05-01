// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { BreakpointIcon } from '@blockera/editor-extensions/js/libs/block-states/helpers';

export default function ({
	item,
	itemId,
	onClick,
}: {
	item: Object,
	itemId: number,
	onClick: (device: string) => void,
}): MixedElement {
	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			aria-label={sprintf(
				// translators: it's the aria label for repeater item
				__('Item %d', 'blockera'),
				itemId + 1
			)}
		>
			<span className={controlInnerClassNames('header-icon')}>
				<BreakpointIcon
					name={item.type}
					onClick={(event) => {
						event.stopPropagation();

						onClick(item.type);
					}}
				/>
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
