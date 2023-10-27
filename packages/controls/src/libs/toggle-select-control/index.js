// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import {
	__experimentalToggleGroupControl as WPToggleGroupControl,
	__experimentalToggleGroupControlOption as WPToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as WPToggleGroupControlOptionIcon,
} from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';
import { controlClassNames } from '@publisher/classnames';
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { BaseControl } from '../index';
import { useControlContext } from '../../context';

type IconOption = {
	label: string,
	value: string,
	icon: MixedElement,
};

type TextOption = {
	label: string,
	value: string,
};

type Option = IconOption | TextOption;

type Props = {
	isDeselectable?: boolean,
	options: Option[],
	//
	id?: string,
	label?: string,
	columns?: string,
	defaultValue?: string,
	onChange?: string,
	field?: string,
	//
	className?: string,
	children?: string,
};

export default function ToggleSelectControl({
	isDeselectable = false,
	options,
	//
	id,
	label = '',
	columns,
	defaultValue = '',
	onChange,
	field = 'toggle-select',
	//
	className,
	children,
	...props
}: Props): MixedElement {
	const { value, setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
		valueCleanup,
	});

	function valueCleanup(value: any) {
		// WPToggleGroupControl returns undefined while deselecting
		return isUndefined(value) ? '' : value;
	}

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
		>
			<div className={controlClassNames('toggle-select', className)}>
				<WPToggleGroupControl
					className={controlClassNames(
						'toggle-select-inner',
						className
					)}
					value={value}
					onChange={setValue}
					label={undefined}
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
				</WPToggleGroupControl>
			</div>
			{children}
		</BaseControl>
	);
}

ToggleSelectControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * Label for field. If you pass empty value the field will not be added and simple control will be rendered
	 *
	 * @default ""
	 */
	label: PropTypes.string,
	/**
	 * Field id for passing into child Field component
	 *
	 * @default "toggle-select"
	 */
	field: PropTypes.string,
	/**
	 * Columns setting for Field grid.
	 *
	 * @default "columns-2"
	 */
	columns: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * list of toggle select options
	 */
	options: (PropTypes.arrayOf(
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
	): any),
	/**
	 * Specifies than user can deselect active item in select or not
	 */
	isDeselectable: PropTypes.bool,
};

ToggleSelectControl.defaultProps = {
	label: '',
	defaultValue: '',
	isDeselectable: false,
	field: 'toggle-select',
};
