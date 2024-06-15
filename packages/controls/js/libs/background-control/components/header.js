// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { HeaderItem } from '../types';
import { getBackgroundItemBGProperty } from '../utils';
import { ColorIndicator, ColorIndicatorStack } from '../../';

const RepeaterItemHeader: HeaderItem = memo<HeaderItem>(
	({
		item,
		itemId,
		isOpen,
		setOpen,
		children,
		isOpenPopoverEvent,
	}: HeaderItem): Element<any> => {
		let label, icon, preview;

		const itemBGProperty = getBackgroundItemBGProperty(item);

		switch (item.type) {
			case 'image':
				label = __('Image', 'blockera');
				preview = (
					<ColorIndicator type="image" value={itemBGProperty} />
				);
				icon = <Icon icon="background-image" iconSize="18" />;
				break;

			case 'linear-gradient':
				label = __('Linear Gradient', 'blockera');
				preview = (
					<ColorIndicator type="gradient" value={itemBGProperty} />
				);
				icon = <Icon icon="background-linear-gradient" iconSize="18" />;
				break;

			case 'radial-gradient':
				label = __('Radial Gradient', 'blockera');
				preview = (
					<ColorIndicator type="gradient" value={itemBGProperty} />
				);
				icon = <Icon icon="background-radial-gradient" iconSize="18" />;
				break;

			case 'mesh-gradient':
				label = __('Mesh Gradient', 'blockera');
				preview = (
					<ColorIndicatorStack
						value={Object.values(item['mesh-gradient-colors']).map(
							(value: Object): Object => {
								return { value: value.color };
							}
						)}
					/>
				);
				icon = <Icon icon="background-mesh-gradient" iconSize="18" />;
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
					{preview}
				</span>

				{children}
			</div>
		);
	}
);

export default RepeaterItemHeader;
