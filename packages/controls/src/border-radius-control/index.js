/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { useValue } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { InputControl, LabelControl, ToggleSelectControl } from '../index';
import { default as CompactIcon } from './icons/compact';
import { default as CustomIcon } from './icons/custom';

export default function BorderRadiusControl({
	label,
	defaultValue,
	value: initialValue,
	//
	className,
	onChange,
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
		mergeInitialAndDefault: true,
		valueCleanup,
	});

	// value clean up for removing extra values to prevent saving extra data!
	function valueCleanup(value) {
		if (value.type === 'all') {
			delete value?.topLeft;
			delete value?.topRight;
			delete value?.bottomLeft;
			delete value?.bottomRight;
		}

		return value;
	}

	return (
		<div className={controlClassNames('border-radius', className)}>
			<div className={controlInnerClassNames('border-header')}>
				{label && (
					<div className={controlInnerClassNames('label')}>
						<LabelControl label={label} />
					</div>
				)}

				{value.type === 'all' && (
					<InputControl
						min="0"
						type="css"
						unitType="essential"
						value={value.all}
						onChange={(newValue) => {
							setValue({ ...value, all: newValue });
						}}
						style={{
							'--pb-all': value.all,
						}}
					/>
				)}

				<ToggleSelectControl
					defaultValue="compact"
					value={value.type}
					options={[
						{
							label: __('Compact', 'publisher-core'),
							value: 'all',
							icon: <CompactIcon />,
						},
						{
							label: __('Custom', 'publisher-core'),
							value: 'custom',
							icon: <CustomIcon />,
						},
					]}
					onChange={(newValue) => {
						if (newValue === 'custom') {
							setValue({
								...value,
								type: newValue,
								topLeft: value.all,
								topRight: value.all,
								bottomLeft: value.all,
								bottomRight: value.all,
							});
						} else {
							setValue({
								...value,
								type: newValue,
							});
						}
					}}
				/>
			</div>

			{value.type === 'custom' && (
				<div className={controlInnerClassNames('border-corners')}>
					<div
						className={controlInnerClassNames(
							'border-corners-preview'
						)}
						style={{
							'--pb-top-left': value.topLeft,
							'--pb-top-right': value.topRight,
							'--pb-bottom-left': value.bottomLeft,
							'--pb-bottom-right': value.bottomRight,
						}}
					>
						<InputControl
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-top-left'
							)}
							noBorder={true}
							value={value.topLeft}
							onChange={(newValue) => {
								setValue({
									...value,
									topLeft: newValue,
								});
							}}
						/>
						<InputControl
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-top-right'
							)}
							noBorder={true}
							value={value.topRight}
							onChange={(newValue) => {
								setValue({
									...value,
									topRight: newValue,
								});
							}}
						/>
						<InputControl
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-bottom-left'
							)}
							noBorder={true}
							value={value.bottomLeft}
							onChange={(newValue) => {
								setValue({
									...value,
									bottomLeft: newValue,
								});
							}}
						/>
						<InputControl
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-bottom-right'
							)}
							noBorder={true}
							value={value.bottomRight}
							onChange={(newValue) => {
								setValue({
									...value,
									bottomRight: newValue,
								});
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

BorderRadiusControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.shape({
		type: PropTypes.oneOf(['all', 'custom']),
		all: PropTypes.string,
		topLeft: PropTypes.string,
		topRight: PropTypes.string,
		bottomLeft: PropTypes.string,
		bottomRight: PropTypes.string,
	}),
	/**
	 * The current value.
	 */
	value: PropTypes.oneOfType([
		PropTypes.shape({
			type: PropTypes.oneOf(['all']),
			all: PropTypes.string,
		}),
		PropTypes.shape({
			type: PropTypes.oneOf(['custom']),
			all: PropTypes.string,
			topLeft: PropTypes.string,
			topRight: PropTypes.string,
			bottomLeft: PropTypes.string,
			bottomRight: PropTypes.string,
		}),
	]),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Label of control
	 */
	label: PropTypes.string,
};

BorderRadiusControl.defaultProps = {
	label: '',
	defaultValue: {
		type: 'all',
		all: '0px',
		topLeft: '0px',
		topRight: '0px',
		bottomLeft: '0px',
		bottomRight: '0px',
	},
};
