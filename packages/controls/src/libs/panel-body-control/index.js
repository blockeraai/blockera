/**
 * External dependencies
 */
import { PanelBody as WPPanelBody } from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function PanelBodyControl({
	title,
	initialOpen,
	className,
	icon,
	children,
	...props
}) {
	return (
		<WPPanelBody
			title={title}
			initialOpen={initialOpen}
			className={controlClassNames('panel-body', className)}
			icon={icon ? <span>{icon}</span> : ''} // by wrapping icon inside a tag the WPPanelBody wraps it inside a tag with components-panel__icon class
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
	title: PropTypes.string,
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
