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

/**
 * Internal dependencies
 */
import { ColorIndicator } from '../../';
import CloneIcon from './../icons/outline';
import type { THeaderItem } from '../types';
import { prepValueForHeader } from '../../repeater-control/utils';
import BorderStyleHSolidIcon from '../../border-control/icons/style-h-solid';
import BorderStyleHDashedIcon from '../../border-control/icons/style-h-dashed';
import BorderStyleHDottedIcon from '../../border-control/icons/style-h-dotted';
import BorderStyleHDoubleIcon from '../../border-control/icons/style-h-double';

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
				return <BorderStyleHSolidIcon />;
			} else if (style === 'dashed') {
				return <BorderStyleHDashedIcon />;
			} else if (style === 'dotted') {
				return <BorderStyleHDottedIcon />;
			} else if (style === 'double') {
				return <BorderStyleHDoubleIcon />;
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
					<CloneIcon />
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
