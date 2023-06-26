/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext, useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, SelectField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import BaseControl from '../../base';
import { RepeaterContext } from '../../repeater-control/context';
import {
	getAttributeFieldValueOptions,
	getAttributeFieldKeyOptions,
} from '../utils';

const Fields = ({ itemId, item }) => {
	const { changeItem, customProps } = useContext(RepeaterContext);

	const [currentKey, setCurrentKey] = useState(item.key);
	const [currentValue, setCurrentValue] = useState(item.value);

	const [valueFieldOptions, setValueFieldOptions] = useState(
		getAttributeFieldValueOptions({
			element: customProps.attributeElement,
			attribute: currentKey,
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
		if (currentKey !== '') {
			if (keyFieldOptions.length)
				for (const option in keyFieldOptions) {
					if (keyFieldOptions[option]?.options) {
						for (const _option in keyFieldOptions[option].options) {
							if (
								keyFieldOptions[option].options[_option]
									.value === currentKey
							) {
								return false;
							}
						}
					} else if (keyFieldOptions[option]?.value === currentKey) {
						return false;
					}
				}
		} else {
			return false;
		}

		return true;
	}

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			{keyFieldOptions.length && (
				<>
					<SelectField
						label={__('Attribute', 'publisher-core')}
						options={keyFieldOptions}
						// type="customProps"
						value={customMode ? 'customKey' : currentKey}
						defaultValue=""
						onChange={(newValue) => {
							// update key
							if (newValue !== '' && newValue !== 'customKey') {
								changeItem(itemId, {
									...item,
									key: newValue,
									value: '',
								});

								setCurrentKey(newValue);
								setCurrentValue('');
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
								setCurrentKey('');
								setCustomMode(false);
								setCurrentValue('');
								changeItem(itemId, {
									...item,
									key: newValue,
									value: newValue,
								});
							} else if (newValue === 'customKey') {
								setValueFieldOptions([]);
								setCustomMode(true);
								setCurrentKey('');
								setCurrentValue('');
								changeItem(itemId, {
									...item,
									key: '',
									value: '',
								});
							}
						}}
					/>

					{!customMode && (
						<>
							{valueFieldOptions.length ? (
								<SelectField
									label={__('Value', 'publisher-core')}
									options={valueFieldOptions}
									// type="customProps"
									value={currentValue}
									defaultValue=""
									onChange={(newValue) => {
										setCurrentValue(newValue);
										changeItem(itemId, {
											...item,
											key: currentKey,
											value: newValue,
										});
									}}
								/>
							) : (
								<>
									{currentKey !== '' && (
										<InputField
											label={__(
												'Value',
												'publisher-core'
											)}
											settings={{
												type: 'text',
											}}
											//
											defaultValue=""
											value={currentValue}
											onChange={(newValue) => {
												setCurrentValue(newValue);
												changeItem(itemId, {
													...item,
													key: currentKey,
													value: newValue,
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
					<InputField
						label={__('Key', 'publisher-core')}
						settings={{
							type: 'text',
						}}
						//
						defaultValue=""
						value={currentKey}
						onChange={(newValue) => {
							setCurrentKey(newValue);
							changeItem(itemId, {
								...item,
								key: newValue,
								value: currentValue,
							});
						}}
					/>

					<InputField
						label={__('Value', 'publisher-core')}
						settings={{
							type: 'text',
						}}
						//
						defaultValue=""
						value={currentValue}
						onChange={(newValue) => {
							setCurrentValue(newValue);
							changeItem(itemId, {
								...item,
								key: currentKey,
								value: newValue,
							});
						}}
					/>
				</>
			)}
		</BaseControl>
	);
};

export default memo(Fields);
