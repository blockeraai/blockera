// @flow
/**
 * External dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { ColorIndicator } from '../../';
import type { THeaderItem } from '../types';
import { prepValueForHeader } from '../../repeater-control/utils';

const RepeaterItemHeader: THeaderItem = memo<THeaderItem>(
	({
		item: {
			border: { style, width, color = '#fff' },
		},
		itemId,
		isOpen,
		setOpen,
		children,
		isOpenPopoverEvent,
	}: THeaderItem): Element<any> => {
		function getStyleIcon() {
			if (style === 'solid') {
				return <Icon icon="border-style-horizontal-solid" />;
			} else if (style === 'dashed') {
				return <Icon icon="border-style-horizontal-dashed" />;
			} else if (style === 'dotted') {
				return <Icon icon="border-style-horizontal-dotted" />;
			} else if (style === 'double') {
				return <Icon icon="border-style-horizontal-double" />;
			}
		}

		return (
			<div
				className={controlInnerClassNames('repeater-group-header')}
				onClick={(event) =>
					isOpenPopoverEvent(event) && setOpen(!isOpen)
				}
				aria-label={sprintf(
					// translators: it's the aria label for repeater item
					__('Item %d', 'blockera'),
					itemId + 1
				)}
			>
				<span className={controlInnerClassNames('header-icon')}>
					<Icon icon="outline" iconSize="18" />
				</span>

				<span className={controlInnerClassNames('header-label')}>
					{__('Outline', 'blockera')}
				</span>

				<span
					className={controlInnerClassNames('header-values')}
					style={{ gap: '10px' }}
				>
					{prepValueForHeader(width)}

					{getStyleIcon()}

					<ColorIndicator value={color} />
				</span>

				{children}
			</div>
		);
	}
);

export default RepeaterItemHeader;
