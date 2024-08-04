// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';
import { Tooltip as WPTooltip } from '@wordpress/components';
import { componentClassNames } from '@blockera/classnames';

/**
 * Int dependencies
 */
import type { TTooltipItem } from './types';

export function Tooltip({
	width = 'auto',
	hideOnClick = true,
	placement = 'top',
	position = 'top',
	delay = 600,
	children,
	className,
	text,
	...props
}: TTooltipItem): Node {
	return (
		<WPTooltip
			className={componentClassNames('tooltip', className)}
			hideOnClick={hideOnClick}
			placement={placement}
			position={position}
			text={
				<div
					className={componentClassNames('tooltip', className)}
					style={{ '--tooltip-width': width }}
				>
					{text}
				</div>
			}
			delay={delay}
			{...props}
		>
			{children}
		</WPTooltip>
	);
}
