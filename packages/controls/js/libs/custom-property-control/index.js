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
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import RepeaterItemHeader from './components/header';
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';
import type { CustomPropertyControlProps } from './types';

export default function CustomPropertyControl({
	id,
	defaultRepeaterItemValue = {
		name: '',
		value: '',
		isVisible: true,
	},
	popoverTitle,
	label,
	labelPopoverTitle,
	labelDescription,
	defaultValue = [],
	//
	className,
	...props
}: CustomPropertyControlProps): MixedElement {
	return (
		<RepeaterControl
			id={id}
			addNewButtonLabel={__('Add New CSS Property', 'blockera')}
			popoverTitle={
				popoverTitle || (
					<>
						<Icon icon="css-3" size="24" />
						{__('CSS Property', 'blockera')}
					</>
				)
			}
			label={label || __('CSS Properties', 'blockera')}
			labelPopoverTitle={
				labelPopoverTitle || __('CSS Properties', 'blockera')
			}
			labelDescription={
				labelDescription || (
					<>
						<p>
							{__(
								'It enables you to directly apply custom CSS properties to block by defining key-value pairs.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								"It's ideal for implementing unique styling that goes beyond the standard options offered and its easy to use for responsive customization and block states.",
								'blockera'
							)}
						</p>
					</>
				)
			}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			className={controlClassNames('custom-property', className)}
			defaultValue={defaultValue}
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
	popoverTitle: PropTypes.string,
};
