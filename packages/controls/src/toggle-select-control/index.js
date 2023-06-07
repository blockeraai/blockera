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

/**
 * Internal dependencies
 */
import './style.scss';

const ToggleSelectControl = ({
	initValue = '',
	options,
	children,
	//
	value,
	attribute,
	//
	className,
	onValueChange = () => {},
	...props
}) => {
	return (
		<>
			<WPToggleGroupControl
				className={controlClassNames('toggle-select', className)}
				value={value || initValue}
				onChange={onValueChange}
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
