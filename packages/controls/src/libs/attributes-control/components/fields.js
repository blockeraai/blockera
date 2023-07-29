/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../repeater-control/context';
import {
	getAttributeFieldValueOptions,
	getAttributeFieldKeyOptions,
} from '../utils';
import { useControlContext } from '../../../context';
import { InputControl, SelectControl } from '../../index';

const Fields = ({ itemId, item }) => {
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
						for (const _option in keyFieldOptions[option].options) {
							if (
								keyFieldOptions[option].options[_option]
									.value === item.key
							) {
								return false;
							}
						}
					} else if (keyFieldOptions[option]?.value === item.key) {
						return false;
					}
				}
		}

		return true;
	}

	return (
		<div id={`repeater-item-${itemId}`}>
			{keyFieldOptions.length > 0 && (
				<>
					<SelectControl
						label={__('Attribute', 'publisher-core')}
						options={keyFieldOptions}
						id={getControlId(itemId, '__key')}
						defaultValue=""
						onChange={(newValue) => {
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
						}}
					/>

					{!customMode && (
						<>
							{item.key !== '' && valueFieldOptions.length ? (
								<SelectControl
									label={__('Value', 'publisher-core')}
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
											type="text"
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
					/>
					<InputControl
						label={__('Value', 'publisher-core')}
						id={getControlId(itemId, 'value')}
						type="text"
						defaultValue=""
						onChange={(newValue) => {
							// setCurrentValue(newValue);
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
				</>
			)}
		</div>
	);
};

export default memo(Fields);
