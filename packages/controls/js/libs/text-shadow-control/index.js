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
import { PromotionPopover } from '../';
import Fields from './components/fields';
import RepeaterControl from '../repeater-control';
import RepeaterItemHeader from './components/header';
import type { TTextShadowControlProps } from './types';
import { getRepeaterActiveItemsCount } from '../repeater-control/helpers';

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
			id={'text-shadow'}
			className={controlClassNames('text-shadow', className)}
			popoverTitle={popoverTitle}
			addNewButtonLabel={__('Add New Text Shadow', 'blockera')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			label={label}
			labelDescription={labelDescription}
			PromoComponent={({
				items,
				onClose = () => {},
				isOpen = false,
			}): MixedElement | null => {
				if (getRepeaterActiveItemsCount(items) < 1) {
					return null;
				}

				return (
					<PromotionPopover
						heading={__('Multiple Text Shadows', 'blockera')}
						featuresList={[
							__('Multiple text shadows', 'blockera'),
							__('Advanced text shadow effects', 'blockera'),
							__('Advanced features', 'blockera'),
							__('Premium blocks', 'blockera'),
						]}
						isOpen={isOpen}
						onClose={onClose}
					/>
				);
			}}
			{...props}
		/>
	);
}
