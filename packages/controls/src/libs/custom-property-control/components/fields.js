// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../repeater-control/context';
import { useControlContext } from '../../../context';
import { InputControl, NoticeControl } from '../../index';
import type { TFieldItem } from '../types';

const Fields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();

		const { repeaterId, getControlId } = useContext(RepeaterContext);

		return (
			<div id={`repeater-item-${itemId}`}>
				<InputControl
					label={__('Name', 'publisher-core')}
					aria-label={__('CSS Property Name', 'publisher-core')}
					labelPopoverTitle={__(
						'CSS Property Name',
						'publisher-core'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'The name of the CSS property.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					type="text"
					id={getControlId(itemId, 'name')}
					defaultValue={item?.name || ''}
					placeholder={__('Enter property name…', 'publisher-core')}
					onChange={(newValue) => {
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								name: newValue,
							},
						});
					}}
				>
					{!item?.name && (
						<NoticeControl
							type="error"
							style={{ marginTop: '10px' }}
						>
							{__('Name is required.', 'publisher-core')}
						</NoticeControl>
					)}
				</InputControl>

				<InputControl
					label={__('Value', 'publisher-core')}
					aria-label={__('CSS Property Value', 'publisher-core')}
					labelPopoverTitle={__(
						'CSS Property Value',
						'publisher-core'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'The value of the CSS property.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					id={getControlId(itemId, 'value')}
					type="text"
					defaultValue={item?.value || ''}
					placeholder={__('Enter property value…', 'publisher-core')}
					onChange={(newValue) => {
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								value: newValue,
							},
						});
					}}
				>
					{!item?.value && (
						<NoticeControl
							type="error"
							style={{ marginTop: '10px' }}
						>
							{__('Value is required.', 'publisher-core')}
						</NoticeControl>
					)}
				</InputControl>
			</div>
		);
	}
);

export default Fields;
