/**
 * WordPress dependencies
 */
import {
	__experimentalToggleGroupControl as WPToggleGroupControl,
	__experimentalToggleGroupControlOption as WPToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as WPToggleGroupControlOptionIcon,
} from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

const ToggleSelectControl = ({
	initValue = '',
	options,
	children,
	isDeselectable = false,
	//
	value,
	attribute,
	//
	className,
	onChange = (newValue) => {
		return newValue;
	},
	onValueChange = () => {},
	...props
}) => {
	return (
		<>
			<WPToggleGroupControl
				className={controlClassNames('toggle-select', className)}
				value={value || initValue}
				onChange={(newValue) => {
					newValue = onChange(newValue);
					onValueChange(newValue);
					return newValue;
				}}
				label=""
				hideLabelFromVision={true}
				isBlock={true}
				isDeselectable={isDeselectable}
				__nextHasNoMarginBottom={false}
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
