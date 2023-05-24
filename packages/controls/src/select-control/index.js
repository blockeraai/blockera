/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { SelectControl as WordPressSelectControl } from '@wordpress/components';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

const SelectControl = (
	options,
	children,
	initValue = '',
	isGrouped = false,
	disabledItemLabel = __('--- Select an item ---', 'publisher-core'),
	...props
) => {
	const [value, setValue] = useState(initValue);

	const GroupSelect = () => (
		<WordPressSelectControl
			{...props}
			value={value}
			onChange={(selection) => {
				setValue(selection);
			}}
			__nextHasNoMarginBottom
		>
			{children}
		</WordPressSelectControl>
	);

	return (
		<>
			{isGrouped && !options && <GroupSelect />}
			{!isGrouped && isObject(options) && (
				<WordPressSelectControl
					{...props}
					value={value}
					options={{
						...{
							value: '',
							label: disabledItemLabel,
							disable: true,
						},
						...options,
					}}
					onChange={(selection) => setValue(selection)}
					__nextHasNoMarginBottom
				/>
			)}
		</>
	);
};

export default SelectControl;
