// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';
import { Tooltip as WPTooltip } from '@wordpress/components';
import { componentClassNames } from '@blockera/classnames';
import PropTypes from 'prop-types';

/**
 * Int dependencies
 */
import type { TTooltipItem } from './types';

export function Tooltip({
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
			text={text}
			delay={delay}
			{...props}
		>
			{children}
		</WPTooltip>
	);
}

Tooltip.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	delay: PropTypes.number,
	hideOnClick: PropTypes.func,
	//$FlowFixMe
	placement: PropTypes.oneOf([
		'top',
		'top-start',
		'top-end',
		'right',
		'right-start',
		'right-end',
		'bottom',
		'bottom-start',
		'bottom-end',
		'left',
		'left-start',
		'left-end',
	]),
	position: PropTypes.string,
	text: PropTypes.string,
};
