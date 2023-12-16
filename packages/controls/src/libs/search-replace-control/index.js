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
import type { TSearchReplaceControlProps } from './types';
import SearchReplaceIcon from './icons/search-replace';

export default function SearchReplaceControl({
	id,
	defaultRepeaterItemValue = {
		search: '',
		replace: '',
		isVisible: true,
	},
	popoverTitle = (
		<>
			<SearchReplaceIcon />
			{__('Search and Replace', 'publisher-core')}
		</>
	),
	//
	className,
	defaultValue = [],
	...props
}: TSearchReplaceControlProps): MixedElement {
	return (
		<RepeaterControl
			id={id}
			popoverTitle={popoverTitle}
			defaultValue={defaultValue}
			addNewButtonLabel={__(
				'Add New Search and Replace',
				'publisher-core'
			)}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			className={controlClassNames('search-replace', className)}
			{...props}
		/>
	);
}

SearchReplaceControl.propTypes = {
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
