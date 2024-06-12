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

		const {
			repeaterId,
			getControlId,
			customProps,
			onChange,
			valueCleanup,
		} = useContext(RepeaterContext);

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

		function handleOnChange(newValue: string, ref?: Object) {
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
					ref,
					onChange,
					valueCleanup,
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
					ref,
					onChange,
					valueCleanup,
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
					ref,
					onChange,
					valueCleanup,
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
							label={__('Attribute', 'blockera')}
							labelDescription={
								<>
									<p>
										{__(
											'HTML Attribute provides additional information about the block and the code.',
											'blockera'
										)}
									</p>
									<p>
										{__(
											'You can select an attribute from the list for current block or use Custom Attribute.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={keyFieldOptions}
							id={getControlId(itemId, '__key')}
							repeaterItem={itemId}
							singularId={'__key'}
							defaultValue=""
							onChange={(newValue: string) => {
								handleOnChange(newValue);
							}}
						/>

						{!customMode && (
							<>
								{item.key !== '' && valueFieldOptions.length ? (
									<SelectControl
										label={__('Value', 'blockera')}
										labelPopoverTitle={__(
											'Attribute Value',
											'blockera'
										)}
										labelDescription={
											<>
												<p>
													{__(
														'Value for HTML Attribute.',
														'blockera'
													)}
												</p>
											</>
										}
										columns="columns-2"
										options={valueFieldOptions}
										id={getControlId(itemId, 'value')}
										repeaterItem={itemId}
										singularId={'value'}
										defaultValue=""
										onChange={(newValue, ref) => {
											changeRepeaterItem({
												ref,
												controlId,
												repeaterId,
												itemId,
												value: {
													...item,
													value: newValue,
												},
												onChange,
												valueCleanup,
											});
										}}
									/>
								) : (
									<>
										{item.key !== '' && (
											<InputControl
												label={__('Value', 'blockera')}
												labelPopoverTitle={__(
													'Attribute Value',
													'blockera'
												)}
												labelDescription={
													<>
														<p>
															{__(
																'Value for HTML Attribute.',
																'blockera'
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
												repeaterItem={itemId}
												singularId={'value'}
												defaultValue=""
												onChange={(newValue, ref) => {
													changeRepeaterItem({
														ref,
														controlId,
														repeaterId,
														itemId,
														value: {
															...item,
															value: newValue,
														},
														onChange,
														valueCleanup,
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
							label={__('Key', 'blockera')}
							labelPopoverTitle={__('Attribute Key', 'blockera')}
							labelDescription={
								<>
									<p>
										{__(
											'Key for HTML Attribute.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="columns-2"
							type="text"
							id={getControlId(itemId, 'key')}
							repeaterItem={itemId}
							singularId={'key'}
							defaultValue=""
							onChange={(newValue, ref) => {
								changeRepeaterItem({
									ref,
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										key: newValue,
									},
									onChange,
									valueCleanup,
								});
							}}
						>
							{!item?.key && (
								<NoticeControl
									type="error"
									style={{ marginTop: '10px' }}
								>
									{__('Key is required.', 'blockera')}
								</NoticeControl>
							)}
						</InputControl>

						<InputControl
							label={__('Value', 'blockera')}
							labelPopoverTitle={__(
								'Attribute Value',
								'blockera'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'Value for HTML Attribute.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="columns-2"
							id={getControlId(itemId, 'value')}
							repeaterItem={itemId}
							singularId={'value'}
							type="text"
							defaultValue=""
							onChange={(newValue, ref) => {
								changeRepeaterItem({
									ref,
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										value: newValue,
									},
									onChange,
									valueCleanup,
								});
							}}
						>
							{!item?.value && (
								<NoticeControl
									type="error"
									style={{ marginTop: '10px' }}
								>
									{__('Value is required.', 'blockera')}
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
