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
import Fields from './components/fields';
import RepeaterControl from '../repeater-control';
import type { TDividerControlProps } from './types';

export default function DividerControl({
	id,
	defaultRepeaterItemValue,
	popoverTitle,
	className,
	...props
}: TDividerControlProps): MixedElement {
	return (
		<RepeaterControl
			id={id}
			className={controlClassNames('divider', className)}
			popoverTitle={popoverTitle}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			{...props}
		/>
	);
}

DividerControl.propTypes = {
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
		position: PropTypes.oneOf(['top', 'bottom']),
		shape: PropTypes.shape({
			type: PropTypes.string,
			id: PropTypes.string,
		}),
		color: PropTypes.string,
		size: PropTypes.shape({
			width: PropTypes.string,
			height: PropTypes.string,
		}),
		animate: PropTypes.bool,
		duration: PropTypes.string,
		flip: PropTypes.bool,
		onFront: PropTypes.bool,
		isVisible: PropTypes.bool,
	}): any),
	/**
	 * Label for popover
	 */
	popoverTitle: PropTypes.string,
};

DividerControl.defaultProps = {
	defaultValue: ([]: any),
	defaultRepeaterItemValue: {
		position: 'top',
		shape: { type: 'shape', id: 'wave-opacity' },
		color: '',
		size: { width: '', height: '' },
		animate: false,
		duration: '',
		flip: false,
		onFront: false,
		isVisible: true,
	},
	popoverTitle: (__('Divider', 'publisher-core'): any),
};
