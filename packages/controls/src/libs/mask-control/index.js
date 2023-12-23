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
import type { TMaskControlProps } from './types';

export default function MaskControl({
	defaultRepeaterItemValue = {
		shape: { type: 'shape', id: 'Blob 1' },
		size: 'custom',
		'size-width': '',
		'size-height': '',
		repeat: 'no-repeat',
		position: { top: '50%', left: '50%' },
		'horizontally-flip': false,
		'vertically-flip': false,
		isVisible: true,
	},
	popoverTitle = __('Mask', 'publisher-core'),
	className,
	defaultValue = [],
	...props
}: TMaskControlProps): MixedElement {
	return (
		<RepeaterControl
			className={controlClassNames('mask', className)}
			popoverTitle={popoverTitle}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			defaultValue={defaultValue}
			maxItems={1}
			{...props}
		/>
	);
}

MaskControl.propTypes = {
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
		shape: PropTypes.shape({
			type: PropTypes.string,
			id: PropTypes.string,
		}),
		size: PropTypes.oneOf(['custom', 'cover', 'contain']),
		'size-width': PropTypes.string,
		'size-height': PropTypes.string,
		repeat: PropTypes.oneOf([
			'no-repeat',
			'repeat',
			'repeat-x',
			'repeat-y',
			'round',
			'space',
		]),
		position: PropTypes.shape({
			top: PropTypes.string,
			left: PropTypes.string,
		}),
		'horizontally-flip': PropTypes.bool,
		'vertically-flip': PropTypes.bool,
		isVisible: PropTypes.bool,
	}): any),
	/**
	 * Label for popover
	 */
	popoverTitle: PropTypes.string,
};
