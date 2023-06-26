/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { BorderControl, LabelControl, ToggleSelectControl } from '../index';
import { default as CompactIcon } from './icons/compact';
import { default as CustomIcon } from './icons/custom';
import { useValue } from '@publisher/utils';
import PropTypes from 'prop-types';

export default function BoxBorderControl({
	label = '',
	defaultValue,
	value: initialValue,
	onChange,
	//
	className,
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		mergeInitialAndDefault: true,
		onChange,
	});

	return (
		<div className={controlClassNames('box-border', className)}>
			<div className={controlInnerClassNames('border-header')}>
				{label && (
					<div className={controlInnerClassNames('label')}>
						<LabelControl label={label} />
					</div>
				)}

				{value.type === 'all' && (
					<BorderControl
						value={value.all}
						onChange={(newValue) => {
							setValue({ ...value, all: newValue });
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
					onValueChange={(newValue) => {
						if (newValue === 'custom') {
							setValue({
								...value,
								type: newValue,
								top: value.all,
								right: value.all,
								bottom: value.all,
								left: value.all,
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
							'--pb-top-width': value.top.width,
							'--pb-top-style': value.top.style,
							'--pb-top-color': value.top.color,
							'--pb-right-width': value.right.width,
							'--pb-right-style': value.right.style,
							'--pb-right-color': value.right.color,
							'--pb-bottom-width': value.bottom.width,
							'--pb-bottom-style': value.bottom.style,
							'--pb-bottom-color': value.bottom.color,
							'--pb-left-width': value.left.width,
							'--pb-left-style': value.left.style,
							'--pb-left-color': value.left.color,
						}}
					>
						<BorderControl
							className={controlInnerClassNames(
								'border-corner-top'
							)}
							value={value.top}
							onChange={(newValue) => {
								setValue({
									...value,
									top: newValue,
								});
							}}
						/>
						<BorderControl
							linesDirection="vertical"
							className={controlInnerClassNames(
								'border-corner-right'
							)}
							value={value.right}
							onChange={(newValue) => {
								setValue({
									...value,
									right: newValue,
								});
							}}
						/>
						<BorderControl
							className={controlInnerClassNames(
								'border-corner-bottom'
							)}
							value={value.bottom}
							onChange={(newValue) => {
								setValue({
									...value,
									bottom: newValue,
								});
							}}
						/>
						<BorderControl
							linesDirection="vertical"
							className={controlInnerClassNames(
								'border-corner-left'
							)}
							value={value.left}
							onChange={(newValue) => {
								setValue({
									...value,
									left: newValue,
								});
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

BoxBorderControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onValueChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.oneOf([
		PropTypes.shape({
			type: 'all',
			all: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
		}),
		PropTypes.shape({
			type: 'custom',
			all: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
			top: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
			right: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.string,
				color: PropTypes.string,
			}),
			bottom: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
			left: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
		}),
	]),
	/**
	 * The current value.
	 */
	value: PropTypes.oneOfType([
		PropTypes.shape({
			type: 'all',
			all: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
		}),
		PropTypes.shape({
			type: 'custom',
			all: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
			top: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
			right: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
			bottom: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
			left: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
		}),
	]),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
};

BoxBorderControl.defaultProps = {
	defaultValue: {
		type: 'all',
		all: {
			width: '0px',
			style: 'solid',
			color: '',
		},
		left: {
			width: '0px',
			style: 'solid',
			color: '',
		},
		right: {
			width: '0px',
			style: 'solid',
			color: '',
		},
		top: {
			width: '0px',
			style: 'solid',
			color: '',
		},
		bottom: {
			width: '0px',
			style: 'solid',
			color: '',
		},
	},
};
