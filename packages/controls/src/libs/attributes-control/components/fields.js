// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext, useState, useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../repeater-control/context';
import {
	getAttributeFieldValueOptions,
	getAttributeFieldKeyOptions,
} from '../utils';
import { useControlContext } from '../../../context';
import { InputControl, NoticeControl, SelectControl } from '../../index';
import type { TFieldItem } from '../types';

const Fields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();

		const { repeaterId, getControlId, customProps } =
			useContext(RepeaterContext);

		const [valueFieldOptions, setValueFieldOptions] = useState(
			getAttributeFieldValueOptions({
				element: customProps.attributeElement,
				attribute: item.key,
			})
		);

		const [keyFieldOptions] = useState(
			getAttributeFieldKeyOptions({
				element: customProps.attributeElement,
			})
		);

		const [customMode, setCustomMode] = useState(checkInitCustomMode());

		// disable customProps mode if current key is inside key select field options
		function checkInitCustomMode() {
			if (item.key !== '') {
				if (keyFieldOptions.length)
					for (const option in keyFieldOptions) {
						if (keyFieldOptions[option]?.options) {
							for (const _option in keyFieldOptions[option]
								.options) {
								if (
									keyFieldOptions[option].options[_option]
										.value === item.key
								) {
									return false;
								}
							}
						} else if (
							keyFieldOptions[option]?.value === item.key
						) {
							return false;
						}
					}
			}

			return true;
		}

		function handleOnChange(newValue: string) {
			// update key
			if (newValue !== '' && newValue !== 'custom') {
				changeRepeaterItem({
					controlId,
					repeaterId,
					itemId,
					value: {
						...item,
						__key: newValue,
						key: newValue,
						value: '', // clear value to prevent issue
					},
				});

				setCustomMode(false);

				setValueFieldOptions(
					getAttributeFieldValueOptions({
						element: customProps.attributeElement,
						attribute: newValue,
					})
				);
			}

			if (newValue === '') {
				setValueFieldOptions([]);

				setCustomMode(false);

				changeRepeaterItem({
					controlId,
					repeaterId,
					itemId,
					value: {
						...item,
						__key: '',
						key: '',
						value: '',
					},
				});
			} else if (newValue === 'custom') {
				setValueFieldOptions([]);

				setCustomMode(true);

				changeRepeaterItem({
					controlId,
					repeaterId,
					itemId,
					value: {
						...item,
						__key: newValue,
						key: '',
						value: '',
					},
				});
			}
		}

		useEffect(() => {
			if (
				customProps.attributeElement &&
				item.value === '' &&
				item.key === ''
			) {
				handleOnChange('');
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<div id={`repeater-item-${itemId}`}>
				{keyFieldOptions.length > 0 && (
					<>
						<SelectControl
							label={__('Attribute', 'publisher-core')}
							labelDescription={
								<>
									<p>
										{__(
											'HTML Attribute provides additional information about the block and the code.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'You can select an attribute from the list for current block or use Custom Attribute.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={keyFieldOptions}
							id={getControlId(itemId, '__key')}
							defaultValue=""
							onChange={(newValue: string) => {
								handleOnChange(newValue);
							}}
						/>

						{!customMode && (
							<>
								{item.key !== '' && valueFieldOptions.length ? (
									<SelectControl
										label={__('Value', 'publisher-core')}
										labelPopoverTitle={__(
											'Attribute Value',
											'publisher-core'
										)}
										labelDescription={
											<>
												<p>
													{__(
														'Value for HTML Attribute.',
														'publisher-core'
													)}
												</p>
											</>
										}
										columns="columns-2"
										options={valueFieldOptions}
										id={getControlId(itemId, 'value')}
										defaultValue=""
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
									/>
								) : (
									<>
										{item.key !== '' && (
											<InputControl
												label={__(
													'Value',
													'publisher-core'
												)}
												labelPopoverTitle={__(
													'Attribute Value',
													'publisher-core'
												)}
												labelDescription={
													<>
														<p>
															{__(
																'Value for HTML Attribute.',
																'publisher-core'
															)}
														</p>
													</>
												}
												columns="columns-2"
												type="text"
												id={getControlId(
													itemId,
													'value'
												)}
												defaultValue=""
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
											/>
										)}
									</>
								)}
							</>
						)}
					</>
				)}

				{customMode && (
					<>
						<InputControl
							label={__('Key', 'publisher-core')}
							labelPopoverTitle={__(
								'Attribute Key',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'Key for HTML Attribute.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							type="text"
							id={getControlId(itemId, 'key')}
							defaultValue=""
							onChange={(newValue) => {
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										key: newValue,
									},
								});
							}}
						>
							{!item?.key && (
								<NoticeControl
									type="error"
									style={{ marginTop: '10px' }}
								>
									{__('Key is required.', 'publisher-core')}
								</NoticeControl>
							)}
						</InputControl>

						<InputControl
							label={__('Value', 'publisher-core')}
							labelPopoverTitle={__(
								'Attribute Value',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'Value for HTML Attribute.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							id={getControlId(itemId, 'value')}
							type="text"
							defaultValue=""
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
					</>
				)}
			</div>
		);
	}
);

export default Fields;
