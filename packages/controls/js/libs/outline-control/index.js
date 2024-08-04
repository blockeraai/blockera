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
