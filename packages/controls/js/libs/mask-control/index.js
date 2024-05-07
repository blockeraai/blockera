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
	popoverTitle,
	label,
	labelPopoverTitle,
	labelDescription,
	className,
	defaultValue = [],
	...props
}: TMaskControlProps): MixedElement {
	return (
		<RepeaterControl
			className={controlClassNames('mask', className)}
			popoverTitle={popoverTitle || __('Block Image Mask', 'blockera')}
			label={label || __('Image Mask', 'blockera')}
			labelPopoverTitle={
				labelPopoverTitle || __('Block Image Mask', 'blockera')
			}
			labelDescription={
				labelDescription || (
					<>
						<p>
							{__(
								'It allows you to apply a mask over the block content using an image.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'The mask can be chosen from a pre-existing library or uploaded as a custom image.',
								'blockera'
							)}
						</p>
					</>
				)
			}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			defaultValue={defaultValue}
			maxItems={1}
			{...props}
		/>
	);
}