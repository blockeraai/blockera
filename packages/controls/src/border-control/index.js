/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { useValue } from '@publisher/utils';

/**
 * Publisher dependencies
 */
import { InputControl, SelectControl, ColorControl } from '../index';
import BorderStyleHSolidIcon from './icons/style-h-solid';
import BorderStyleHDashedIcon from './icons/style-h-dashed';
import BorderStyleHDottedIcon from './icons/style-h-dotted';
import BorderStyleHDoubleIcon from './icons/style-h-double';
import BorderStyleVSolidIcon from './icons/style-v-solid';
import BorderStyleVDashedIcon from './icons/style-v-dashed';
import BorderStyleVDottedIcon from './icons/style-v-dotted';
import BorderStyleVDoubleIcon from './icons/style-v-double';

export default function BorderControl({
	linesDirection,
	customMenuPosition,
	//
	defaultValue,
	value: initialValue,
	onChange = (newValue) => {
		return newValue;
	},
	style,
	//
	className,
	// internal usage for stories
	__isWidthFocused,
	__isColorFocused,
	__isStyleFocused,
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
		mergeInitialAndDefault: true,
	});

	return (
		<div className={controlClassNames('border', className)} style={style}>
			<InputControl
				min="0"
				unitType="custom"
				units={[{ value: 'px', label: 'PX', default: 0 }]}
				// type="number"
				className={controlClassNames(
					'input',
					__isWidthFocused && 'is-focused'
				)}
				noBorder={true}
				value={value.width}
				onChange={(newValue) => {
					setValue({ ...value, width: newValue });
				}}
			/>

			<ColorControl
				type="minimal"
				noBorder={true}
				value={value.color}
				onChange={(newValue) => {
					setValue({ ...value, color: newValue });
				}}
				className={__isColorFocused && 'is-focus'}
			/>

			<SelectControl
				className={__isStyleFocused && 'is-focused'}
				customMenuPosition={customMenuPosition}
				type="custom"
				customInputCenterContent={true}
				customHideInputCaret={true}
				customHideInputLabel={true}
				noBorder={true}
				value={value.style}
				options={[
					{
						label: '',
						icon:
							linesDirection === 'horizontal' ? (
								<BorderStyleHSolidIcon />
							) : (
								<BorderStyleVSolidIcon />
							),
						value: 'solid',
						className: 'align-center',
					},
					{
						label: '',
						icon:
							linesDirection === 'horizontal' ? (
								<BorderStyleHDashedIcon />
							) : (
								<BorderStyleVDashedIcon />
							),
						value: 'dashed',
						className: 'align-center',
					},
					{
						label: '',
						icon:
							linesDirection === 'horizontal' ? (
								<BorderStyleHDottedIcon />
							) : (
								<BorderStyleVDottedIcon />
							),
						value: 'dotted',
						className: 'align-center',
					},
					{
						label: '',
						icon:
							linesDirection === 'horizontal' ? (
								<BorderStyleHDoubleIcon />
							) : (
								<BorderStyleVDoubleIcon />
							),
						value: 'double',
						className: 'align-center',
					},
				]}
				onChange={(newValue) => {
					setValue({ ...value, style: newValue });
				}}
			/>
		</div>
	);
}

BorderControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onValueChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.shape({
		width: PropTypes.string,
		style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
		color: PropTypes.string,
	}),
	/**
	 * The current value.
	 */
	value: PropTypes.shape({
		width: PropTypes.string,
		style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
		color: PropTypes.string,
	}),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Indicates border-line icons direction
	 */
	linesDirection: PropTypes.oneOf(['horizontal', 'vertical']),
};

BorderControl.defaultProps = {
	linesDirection: 'horizontal',
	defaultValue: {
		width: '0px',
		style: 'solid',
		color: '',
	},
};
