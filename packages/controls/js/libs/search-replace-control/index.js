// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
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
import type { TSearchReplaceControlProps } from './types';

export default function SearchReplaceControl({
	id,
	defaultRepeaterItemValue = {
		search: '',
		replace: '',
		isVisible: true,
	},
	popoverTitle = (
		<>
			<Icon icon="search" iconSize="24" />
			{__('Search and Replace', 'blockera')}
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
			addNewButtonLabel={__('Add New Search and Replace', 'blockera')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			className={controlClassNames('search-replace', className)}
			{...props}
		/>
	);
}
