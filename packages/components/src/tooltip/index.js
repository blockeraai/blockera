// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';
import { Tooltip as WPTooltip } from '@wordpress/components';
import { componentClassNames } from '@publisher/classnames';
import PropTypes from 'prop-types';

/**
 * Int dependencies
 */
import type { TTooltipItem } from './types';

export default function Tooltip({
	children,
	className,
	...props
}: TTooltipItem): Node {
	return (
		<WPTooltip
			className={componentClassNames('tooltip', className)}
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
	//$FlowFixMe
	shortcut: PropTypes.oneOf(PropTypes.string, PropTypes.object),
	text: PropTypes.string,
};

Tooltip.defaultProps = {
	hideOnClick: true,
	placement: 'top',
	position: 'top',
};
