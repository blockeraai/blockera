// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useEffect, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import RepeaterItemHeader from './components/header';
import Fields from './components/fields';
import RepeaterControl from '../repeater-control';
import type { TDividerControlProps } from './types';
import { useControlContext } from '../../context';
import { RepeaterContext } from '../repeater-control/context';

export default function DividerControl({
	id,
	defaultValue = [],
	value = [],
	defaultRepeaterItemValue = {
		position: 'top',
		shape: { type: 'shape', id: 'wave-opacity' },
		color: '',
		size: { width: '100%', height: '100px' },
		animate: false,
		duration: '',
		flip: false,
		onFront: false,
		isVisible: true,
	},
	popoverTitle,
	label,
	labelPopoverTitle,
	labelDescription,
	className,
	...props
}: TDividerControlProps): MixedElement {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId } = useContext(RepeaterContext);

	useEffect(() => {
		if (value.length < 2) return;
		if (value.length === 2 && value[0].position === 'top') {
			changeRepeaterItem({
				controlId,
				repeaterId,
				itemId: 1,
				value: { ...value[1], position: 'bottom' },
			});
		} else if (value.length === 2 && value[0].position === 'bottom') {
			changeRepeaterItem({
				controlId,
				repeaterId,
				itemId: 1,
				value: { ...value[1], position: 'top' },
			});
		}
	}, [value.length]);

	return (
		<RepeaterControl
			id={id}
			className={controlClassNames('divider', className)}
			popoverTitle={
				popoverTitle || __('Block Shape Divider', 'blockera-core')
			}
			label={label || __('Shape Dividers', 'blockera-core')}
			labelPopoverTitle={
				labelPopoverTitle || __('Block Shape Dividers', 'blockera-core')
			}
			labelDescription={
				labelDescription || (
					<>
						<p>
							{__(
								'Block Shape Dividers are design elements used to visually separate different sections or blocks of content on a webpage.',
								'blockera-core'
							)}
						</p>
						<p>
							{__(
								'Dividers are essential for breaking up long stretches of content, making web pages easier to navigate and read.',
								'blockera-core'
							)}
						</p>
						<p>
							{__(
								"They help in guiding the user's eye through the content and can be used to highlight key sections or create a rhythm in the page layout.",
								'blockera-core'
							)}
						</p>
					</>
				)
			}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			defaultValue={defaultValue}
			{...props}
		/>
	);
}
