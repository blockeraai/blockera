// @flow
/**
 * External dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import type { THeaderItem } from '../types/layout-props';
import AutoFitIcon from '../icons/auto-fit';
import GridSizeIcon from '../icons/grid-size';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

const Header: THeaderItem = memo<THeaderItem>(
	({
		item,
		itemId,
		isOpen,
		setOpen,
		children,
		isOpenPopoverEvent,
	}: THeaderItem): Element<any> => {
		let label, icon, value;

		if (item['auto-fit']) {
			label = __('Auto', 'publisher-core');
			value = '';
			icon = <AutoFitIcon />;
		}
		if (item['auto-generated']) {
			label = item.size;
			value = __('auto generated', 'publisher-core');
			icon = <GridSizeIcon />;
		} else {
			switch (item['sizing-mode']) {
				case 'normal':
					label = item.size;
					value = '';
					icon = <GridSizeIcon />;
					break;
				case 'min/max':
					label = __('Min / Max', 'publisher-core');
					value = `${item['min-size']} ${
						item['min-size'] && item['max-size'] && '/'
					} ${item['max-size']}`;
					icon = <GridSizeIcon />;
					break;
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

export default Header;
