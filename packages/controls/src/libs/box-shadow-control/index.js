// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
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
import type { BoxShadowControlProps } from './types';
import { cleanupRepeaterItem } from '../repeater-control/utils';

export default function BoxShadowControl({
	id,
	popoverTitle = __('Box Shadow', 'publisher-core'),
	className,
	defaultValue = [],
	defaultRepeaterItemValue = {
		type: 'outer',
		x: '10px',
		y: '10px',
		blur: '10px',
		spread: '0px',
		color: '#000000ab',
		isVisible: true,
	},
	...props
}: BoxShadowControlProps): MixedElement {
	const valueCleanup = (value: Object): Object => {
		let clonedValue = { ...value };

		clonedValue = Object.fromEntries(
			Object.entries(clonedValue).map(([itemId, item]): Object => [
				itemId,
				cleanupRepeaterItem(item),
			])
		);

		return clonedValue;
	};

	return (
		<RepeaterControl
			id={id}
			className={controlClassNames('box-shadow', className)}
			popoverTitle={popoverTitle}
			addNewButtonLabel={__('Add New Box Shadow', 'publisher-core')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			defaultValue={defaultValue}
			valueCleanup={valueCleanup}
			{...props}
		/>
	);
}
