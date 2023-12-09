// @flow

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
import type { TCustomPropertyControlProps } from './types';
import PropertyIcon from './icons/property';

export default function CustomPropertyControl({
	id,
	defaultRepeaterItemValue,
	popoverLabel,
	//
	className,
	...props
}: TCustomPropertyControlProps): MixedElement {
	return (
		<RepeaterControl
			id={id}
			popoverLabel={popoverLabel}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			className={controlClassNames('custom-property', className)}
			{...props}
		/>
	);
}

CustomPropertyControl.propTypes = {
	/**
	 * The control identifier
	 */
	id: PropTypes.string,
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
	defaultRepeaterItemValue: (PropTypes.shape({
		name: PropTypes.string,
		value: PropTypes.string,
		isVisible: PropTypes.bool,
	}): any),
	/**
	 * Label for popover
	 */
	popoverLabel: PropTypes.string,
};

CustomPropertyControl.defaultProps = {
	defaultValue: ([]: any),
	defaultRepeaterItemValue: {
		name: '',
		value: '',
		isVisible: true,
	},
	popoverLabel: ((
		<>
			<PropertyIcon />
			{__('CSS Property', 'publisher-core')}
		</>
	): any),
};
