// @flow
/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { THeaderItem } from '../types';
import { prepValueForHeader } from '../../repeater-control/utils';

const RepeaterItemHeader: THeaderItem = memo<THeaderItem>(
	({
		item,
		itemId,
		isOpen,
		setOpen,
		children,
		isOpenPopoverEvent,
	}: THeaderItem): Element<any> => {
		let label, icon, value;

		switch (item.type) {
			case 'blur':
				label = __('Blur', 'blockera');
				value = prepValueForHeader(item.blur);
				icon = <Icon icon="filter-blur" iconSize="18" />;
				break;

			case 'drop-shadow':
				label = __('Drop Shadow', 'blockera');
				value = (
					<>
						{prepValueForHeader(item['drop-shadow-x'])}
						{prepValueForHeader(item['drop-shadow-y'])}
						{prepValueForHeader(item['drop-shadow-blur'])}
					</>
				);
				icon = <Icon icon="filter-drop-shadow" iconSize="18" />;
				break;

			case 'brightness':
				label = __('Brightness', 'blockera');
				value = prepValueForHeader(item.brightness);
				icon = <Icon icon="filter-brightness" iconSize="18" />;
				break;

			case 'contrast':
				label = __('Contrast', 'blockera');
				value = prepValueForHeader(item.contrast);
				icon = <Icon icon="filter-contrast" iconSize="18" />;
				break;

			case 'hue-rotate':
				label = __('Hue Rotate', 'blockera');
				value = prepValueForHeader(item['hue-rotate']);
				icon = <Icon icon="filter-hue-rotate" iconSize="18" />;
				break;

			case 'saturate':
				label = __('Saturation', 'blockera');
				value = prepValueForHeader(item.saturate);
				icon = <Icon icon="filter-saturate" iconSize="18" />;
				break;

			case 'grayscale':
				label = __('Grayscale', 'blockera');
				value = prepValueForHeader(item.grayscale);
				icon = <Icon icon="filter-grayscale" iconSize="18" />;
				break;

			case 'invert':
				label = __('Invert', 'blockera');
				value = prepValueForHeader(item.invert);
				icon = <Icon icon="filter-invert" iconSize="18" />;
				break;

			case 'sepia':
				label = __('Sepia', 'blockera');
				value = prepValueForHeader(item.sepia);
				icon = <Icon icon="filter-sepia" iconSize="18" />;
				break;
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
					{icon}
				</span>

				<span className={controlInnerClassNames('header-label')}>
					{label}
				</span>

				<span className={controlInnerClassNames('header-values')}>
					{value}
				</span>

				{children}
			</div>
		);
	}
);
export default RepeaterItemHeader;
