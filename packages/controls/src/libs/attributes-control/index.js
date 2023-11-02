/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import RepeaterItemHeader from './components/header';
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';
import type { TAttributesControlProps } from './index';

export default function AttributesControl({
	id,
	defaultRepeaterItemValue,
	popoverLabel,
	attributeElement,
	//
	className,
	...props
}: TAttributesControlProps): MixedElement {
	return (
		<RepeaterControl
			id={id}
			popoverLabel={popoverLabel}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			// custom prop for this control
			attributeElement={attributeElement}
			className={controlClassNames('attributes', className)}
			{...props}
		/>
	);
}

AttributesControl.propTypes = {
	/**
	 * The control identifier
	 */
	id: PropTypes.string,
	/**
	 * Specifies the attributes for a specific tag. It adds better UX for field.
	 */
	attributeElement: PropTypes.oneOf(['a', 'button', 'ol', 'general'])
		.isRequired,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.array,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Default value of each repeater item
	 */
	defaultRepeaterItemValue: PropTypes.shape({
		key: PropTypes.string,
		__key: PropTypes.string,
		value: PropTypes.string,
		isVisible: PropTypes.bool,
	}),
	/**
	 * Label for popover
	 */
	popoverLabel: PropTypes.string,
};

AttributesControl.defaultProps = {
	attributeElement: 'general',
	defaultValue: [],
	defaultRepeaterItemValue: {
		key: '',
		__key: '',
		value: '',
		isVisible: true,
	},
	popoverLabel: __('HTML Attribute', 'publisher-core'),
};
