//@flow
/**
 * External dependencies
 */
import { PanelBody as WPPanelBody } from '@wordpress/components';
import type { MixedElement, Node } from 'react';
/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { PropTypes } from 'prop-types';

type Props = {
	title: string,
	initialOpen?: boolean,
	className?: string,
	icon?: Node,
	onToggle?: () => void,
	children: Node,
};
export default function PanelBodyControl({
	title,
	initialOpen = true,
	className,
	icon,
	children,
	onToggle,
	...props
}: Props): MixedElement {
	return (
		<WPPanelBody
			title={title}
			initialOpen={initialOpen}
			className={controlClassNames('panel-body', className)}
			icon={icon ? <span>{icon}</span> : ''} // by wrapping icon inside a tag the WPPanelBody wraps it inside a tag with components-panel__icon class
			onToggle={onToggle}
			{...props}
		>
			{children}
		</WPPanelBody>
	);
}

PanelBodyControl.propTypes = {
	/**
	 * Title of Inspect Element
	 */
	title: PropTypes.string.isRequired,
	/**
	 * Default open or close status for panel body
	 */
	initialOpen: PropTypes.bool,
	/**
	 * Icon for panel body
	 */
	icon: PropTypes.element,
	/**
	 * Function that will be fired while opening or closing of panel body
	 */
	onToggle: PropTypes.element,
};
PanelBodyControl.defaultProps = {
	initialOpen: true,
};
