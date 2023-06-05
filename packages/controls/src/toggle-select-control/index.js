/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import {
	__experimentalToggleGroupControl as WPToggleGroupControl,
	__experimentalToggleGroupControlOption as WPToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as WPToggleGroupControlOptionIcon,
} from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import { getControlValue, updateControlValue } from './../utils';
import './style.scss';

const ToggleSelectControl = ({
	initValue = '',
	options,
	children,
	//
	value,
	attribute,
	repeaterAttributeIndex = null,
	repeaterAttribute = null,
	//
	className,
	onChange = () => {},
	...props
}) => {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	let controlValue = getControlValue(
		value,
		attribute,
		repeaterAttribute,
		repeaterAttributeIndex,
		initValue,
		attributes
	);

	return (
		<>
			<WPToggleGroupControl
				className={controlClassNames('toggle-select', className)}
				value={controlValue}
				onChange={(newValue) => {
					updateControlValue(
						newValue,
						attribute,
						repeaterAttribute,
						repeaterAttributeIndex,
						attributes,
						setAttributes
					);

					onChange(newValue);
				}}
				label=""
				hideLabelFromVision={true}
				isBlock={true}
				{...props}
			>
				{options?.map((item) => {
					if (typeof item.icon !== 'undefined') {
						return (
							<WPToggleGroupControlOptionIcon
								{...item}
								key={item.value}
							/>
						);
					}

					return (
						<WPToggleGroupControlOption
							{...item}
							key={item.value}
						/>
					);
				})}
				{children}
			</WPToggleGroupControl>
		</>
	);
};

export default ToggleSelectControl;
