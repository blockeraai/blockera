/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	useControlContext,
	AlignmentMatrixControl,
	convertAlignmentMatrixCoordinates,
	InputControl,
} from '@publisher/controls';
import { Flex } from '@publisher/components';

// todo remove this filed, it's replaced by AlignmentMatrixControl
export default function PositionControl({
	label,
	className,
	columns,
	//
	topValue,
	leftValue,
	children,
	//
	onChange,
}) {
	const { value: coordinates, setValue: setCoordinates } = useControlContext({
		defaultValue: {
			top: topValue,
			left: leftValue,
		},
	});

	return (
		<BaseControl
			label={label}
			controlName="position"
			className={className}
			columns={columns}
		>
			<Flex gap="8px" direction="row" justify="space-around">
				<div style={{ width: '75%' }}>
					<AlignmentMatrixControl
						id={'coordinates'}
						onChange={(newValue) => {
							const _coordinates =
								convertAlignmentMatrixCoordinates(newValue);

							setCoordinates({
								coordinates: _coordinates,
								top: _coordinates.top.number,
								left: _coordinates.left.number,
							});

							onChange({
								top: _coordinates.top.number,
								left: _coordinates.left.number,
							});
						}}
					/>
				</div>

				<div style={{ width: '100%' }}>
					<Flex direction="column" gap="8px" justify="space-around">
						<BaseControl
							controlName={'input'}
							label={__('Top', 'publisher-core')}
						>
							<InputControl
								{...{
									id: 'top',
									unitType: 'background-position',
									defaultValue: coordinates.top,
									onChange: (value) => {
										setCoordinates({
											...coordinates,
											top: value,
										});

										onChange({
											...coordinates,
											top: value,
										});
									},
								}}
							/>
						</BaseControl>

						<BaseControl
							controlName={'input'}
							label={__('Left', 'publisher-core')}
						>
							<InputControl
								{...{
									id: 'left',
									unitType: 'background-position',
									defaultValue: coordinates.left,
									onChange: (value) => {
										setCoordinates({
											...coordinates,
											left: value,
										});

										onChange({
											...coordinates,
											left: value,
										});
									},
								}}
							/>
						</BaseControl>
					</Flex>
				</div>
			</Flex>

			{children}
		</BaseControl>
	);
}

PositionControl.propTypes = {
	/**
	 * The control label value.
	 */
	label: PropTypes.string,
	/**
	 * The onChange handler for position control.
	 */
	onChange: PropTypes.func,
	/**
	 * The top coordinate value.
	 */
	topValue: PropTypes.string,
	/**
	 * The control css classname.
	 */
	className: PropTypes.string,
	/**
	 * The left coordinate value.
	 */
	leftValue: PropTypes.string,
	/**
	 * The child control.
	 */
	children: PropTypes.element,
};

PositionControl.defaultValues = {
	onChange: () => {},
	label: __('Position', 'publisher-core'),
};
