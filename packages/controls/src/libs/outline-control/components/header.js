// @flow
/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { ColorIndicator } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

import CloneIcon from './../icons/outline';
import BorderStyleHSolidIcon from '../../border-control/icons/style-h-solid';
import BorderStyleHDashedIcon from '../../border-control/icons/style-h-dashed';
import BorderStyleHDottedIcon from '../../border-control/icons/style-h-dotted';
import BorderStyleHDoubleIcon from '../../border-control/icons/style-h-double';

/**
 * External dependencies
 */
import type { Element } from 'react';
/**
 * Internal dependencies
 */
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
					__('Item %d', 'publisher-core'),
					itemId + 1
				)}
			>
				<span className={controlInnerClassNames('header-icon')}>
					<CloneIcon />
				</span>

				<span className={controlInnerClassNames('header-label')}>
					{__('Outline', 'publisher-core')}
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
