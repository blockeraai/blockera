// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import RepeaterItemHeader from './components/header';
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';
import type { TOutlineControlProps } from './types';

export default function OutlineControl({
	id,
	className,
	popoverTitle = __('Outline', 'blockera'),
	defaultRepeaterItemValue = {
		border: {
			width: '2px',
			style: 'solid',
			color: '#b6b6b6',
		},
		offset: '2px',
		isVisible: true,
	},
	...props
}: TOutlineControlProps): MixedElement {
	return (
		<RepeaterControl
			id={id}
			className={controlClassNames('outline', className)}
			popoverTitle={popoverTitle}
			addNewButtonLabel={__('Add New Outline', 'blockera')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			maxItems={1}
			{...props}
		/>
	);
}

OutlineControl.propTypes = {
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
		border: PropTypes.shape({
			width: PropTypes.string,
			style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
			color: PropTypes.string,
		}),
		offset: PropTypes.string,
		isVisible: PropTypes.bool,
	}): any),
	/**
	 * Title for popover
	 */
	popoverTitle: PropTypes.string,
};