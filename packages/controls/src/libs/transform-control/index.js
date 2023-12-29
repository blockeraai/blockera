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
import type {
	TransformControlProps,
	TransformControlRepeaterItemValue,
} from './types';
import { LabelDescription } from './components/label-description';

export default function TransformControl({
	defaultRepeaterItemValue = {
		type: 'move',
		'move-x': '0px',
		'move-y': '0px',
		'move-z': '0px',
		scale: '100%',
		'rotate-x': '0deg',
		'rotate-y': '0deg',
		'rotate-z': '0deg',
		'skew-x': '0deg',
		'skew-y': '0deg',
		isVisible: true,
	},
	popoverTitle,
	label,
	labelDescription,
	className,
	...props
}: TransformControlProps): MixedElement {
	return (
		<RepeaterControl
			className={controlClassNames('transform', className)}
			popoverTitle={
				popoverTitle || __('2D & 3D Transforms', 'publisher-core')
			}
			label={label || __('2D & 3D Transforms', 'publisher-core')}
			labelDescription={labelDescription || <LabelDescription />}
			addNewButtonLabel={__('Add New Transform', 'publisher-core')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			{...props}
		/>
	);
}

TransformControl.propTypes = {
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
		type: PropTypes.oneOf(['move', 'scale', 'rotate', 'skew']),
		'move-x': PropTypes.string,
		'move-y': PropTypes.string,
		'move-z': PropTypes.string,
		scale: PropTypes.string,
		'rotate-x': PropTypes.string,
		'rotate-y': PropTypes.string,
		'rotate-z': PropTypes.string,
		'skew-x': PropTypes.string,
		'skew-y': PropTypes.string,
		isVisible: PropTypes.bool,
	}): TransformControlRepeaterItemValue),
	/**
	 * Label for popover
	 */
	popoverTitle: PropTypes.string,
};
