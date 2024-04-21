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
import type { AttributesControlProps } from './types';

export default function AttributesControl({
	id,
	defaultRepeaterItemValue = {
		key: '',
		__key: '',
		value: '',
		isVisible: true,
	},
	popoverTitle,
	label,
	labelPopoverTitle,
	labelDescription,
	attributeElement = 'a',
	defaultValue = [],
	//
	className,
	...props
}: AttributesControlProps): MixedElement {
	return (
		<RepeaterControl
			id={id}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			popoverTitle={
				popoverTitle || __('HTML Attributes', 'blockera-core')
			}
			label={label || __('HTML Attributes', 'blockera-core')}
			labelPopoverTitle={
				labelPopoverTitle ||
				__('Custom HTML Attributes', 'blockera-core')
			}
			labelDescription={
				labelDescription || (
					<>
						<p>
							{__(
								'It enables you to add custom HTML attributes to the block.',
								'blockera-core'
							)}
						</p>
						<p>
							{__(
								'You can define key-value pairs as attributes, which are then added to the HTML markup of the block, allowing for enhanced customization and functionality.',
								'blockera-core'
							)}
						</p>
					</>
				)
			}
			addNewButtonLabel={__('Add New HTML Attribute', 'blockera-core')}
			// custom prop for this control
			className={controlClassNames('attributes', className)}
			attributeElement={attributeElement}
			defaultValue={defaultValue}
			{...props}
		/>
	);
}
