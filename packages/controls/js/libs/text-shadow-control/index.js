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
import type { TTextShadowControlProps } from './types';

export default function TextShadowControl({
	defaultRepeaterItemValue = {
		x: '1px',
		y: '1px',
		blur: '1px',
		color: '#000000ab',
		isVisible: true,
	},
	popoverTitle = __('Text Shadow', 'blockera'),
	label = __('Text Shadow', 'blockera'),
	labelDescription = (
		<>
			<p>
				{__(
					'It adds shadow effect to text, enhancing its visual depth and emphasis.',
					'blockera'
				)}
			</p>
			<p>
				{__(
					'It is ideal for creating visually striking text effects, improving legibility over contrasting backgrounds, and adding a layer of sophistication to web typography.',
					'blockera'
				)}
			</p>
			<p>
				{__(
					'You can add multiple shadows for advanced effects.',
					'blockera'
				)}
			</p>
		</>
	),
	className,
	...props
}: TTextShadowControlProps): MixedElement {
	return (
		<RepeaterControl
			className={controlClassNames('text-shadow', className)}
			popoverTitle={popoverTitle}
			addNewButtonLabel={__('Add New Text Shadow', 'blockera')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			label={label}
			labelDescription={labelDescription}
			{...props}
		/>
	);
}
