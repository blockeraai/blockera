// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { Icon } from '@wordpress/components';
import { memo } from '@wordpress/element';
import { blockDefault } from '@wordpress/icons';

/**
 * Blockera dependencies
 */
import { componentClassNames } from '@blockera/classnames';

function BlockIcon({
	icon,
	showColors = false,
	className,
	context,
}: {
	icon: {
		src: string,
		background?: string,
		foreground?: string,
	},
	showColors?: boolean,
	className?: string,
	context?: string,
}): MixedElement {
	if (icon?.src === 'block-default') {
		icon = {
			src: blockDefault,
		};
	}

	const renderedIcon = (
		<Icon icon={icon && icon.src ? icon.src : icon} context={context} />
	);

	const style = showColors
		? {
				backgroundColor: icon && icon.background,
				color: icon && icon.foreground,
		  }
		: {};

	return (
		<span
			style={style}
			className={componentClassNames('block-icon', className, {
				'has-colors': showColors,
			})}
		>
			{renderedIcon}
		</span>
	);
}

// $FlowFixMe
export default memo(BlockIcon);
