// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

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
import type { MixedElement } from 'react';

type RepeaterItem = {
	type: 'move' | 'scale' | 'rotate' | 'skew',
	'move-x': string,
	'move-y': string,
	'move-z': string,
	scale: string,
	'rotate-x': string,
	'rotate-y': string,
	'rotate-z': string,
	'skew-x': string,
	'skew-y': string,
	isVisible: boolean,
};

type Props = {
	popoverLabel?: string,
	className?: string,
	defaultValue?: RepeaterItem[],
	value?: RepeaterItem[],
	onChange?: () => void,
	defaultRepeaterItemValue?: RepeaterItem,
};

export default function TransformControl({
	defaultRepeaterItemValue,
	popoverLabel,
	className,
	...props
}: Props): MixedElement {
	return (
		<RepeaterControl
			className={controlClassNames('transform', className)}
			popoverLabel={popoverLabel}
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
	 * The current value.
	 */
	value: PropTypes.array,
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
	}): any),
	/**
	 * Label for popover
	 */
	popoverLabel: PropTypes.string,
};

TransformControl.defaultProps = {
	value: ([]: Array<empty>),
	defaultRepeaterItemValue: {
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
	popoverLabel: (__('Transform', 'publisher-core'): any),
};
