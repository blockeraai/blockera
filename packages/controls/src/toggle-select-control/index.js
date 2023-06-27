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
import { isUndefined, useValue } from '@publisher/utils';
import PropTypes from 'prop-types';

export default function ToggleSelectControl({
	isDeselectable = false,
	options,
	//
	defaultValue = '',
	value: initialValue,
	onChange,
	//
	className,
	children,
	...props
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
		valueCleanup,
	});

	function valueCleanup(value) {
		// WPToggleGroupControl returns undefined while deselecting
		return isUndefined(value) ? '' : value;
	}

	return (
		<>
			<WPToggleGroupControl
				className={controlClassNames('toggle-select', className)}
				value={value}
				onChange={setValue}
				label=""
				hideLabelFromVision={true}
				isBlock={true}
				isDeselectable={isDeselectable}
				__nextHasNoMarginBottom={false}
				{...props}
			>
				{options?.map((item) => {
					if (!isUndefined(item.icon)) {
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
}

ToggleSelectControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * The current value.
	 */
	value: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * list of toggle select options
	 */
	options: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.shape({
				label: PropTypes.string,
				value: PropTypes.string,
				icon: PropTypes.element,
			}),
			PropTypes.shape({
				label: PropTypes.string,
				value: PropTypes.string,
			}),
		])
	),
	/**
	 * Specifies than user can deselect active item in select or not
	 */
	isDeselectable: PropTypes.bool,
};

ToggleSelectControl.defaultProps = {
	value: '',
	isDeselectable: false,
};
