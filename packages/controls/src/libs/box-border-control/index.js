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

/**
 * Internal dependencies
 */
import { BorderControl, LabelControl, ToggleSelectControl } from '../index';
import { useControlContext } from '../../context';
import { default as CompactIcon } from './icons/compact';
import { default as CustomIcon } from './icons/custom';

export default function BoxBorderControl( {
	id,
	label,
	defaultValue,
	onChange,
	//
	className,
} ) {
	const { value, setValue } = useControlContext( {
		id,
		onChange,
		defaultValue,
		valueCleanup,
		mergeInitialAndDefault: true,
	} );

	// value clean up for removing extra values to prevent saving extra data!
	function valueCleanup( value ) {
		if ( value.type === 'all' ) {
			delete value?.top;
			delete value?.right;
			delete value?.bottom;
			delete value?.left;
		}

		return value;
	}

	return (
		<div className={ controlClassNames( 'box-border', className ) }>
			<div className={ controlInnerClassNames( 'border-header' ) }>
				{ label && (
					<div className={ controlInnerClassNames( 'label' ) }>
						<LabelControl label={ label } />
					</div>
				) }

				{ value.type === 'all' && (
					<BorderControl
						id="all"
						onChange={ ( newValue ) => {
							setValue( { ...value, all: newValue } );
						} }
					/>
				) }

				<ToggleSelectControl
					id="type"
					defaultValue="compact"
					options={ [
						{
							label: __( 'Compact', 'publisher-core' ),
							value: 'all',
							icon: <CompactIcon />,
						},
						{
							label: __( 'Custom', 'publisher-core' ),
							value: 'custom',
							icon: <CustomIcon />,
						},
					] }
					onChange={ ( newValue ) => {
						if ( newValue === 'custom' ) {
							setValue( {
								...value,
								type: newValue,
								top: value.all,
								right: value.all,
								bottom: value.all,
								left: value.all,
							} );
						} else {
							setValue( {
								...value,
								type: newValue,
							} );
						}
					} }
				/>
			</div>

			{ value.type === 'custom' && (
				<div className={ controlInnerClassNames( 'border-corners' ) }>
					<div
						className={ controlInnerClassNames(
							'border-corners-preview'
						) }
						style={ {
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
						} }
					>
						<BorderControl
							id="top"
							className={ controlInnerClassNames(
								'border-corner-top'
							) }
							onChange={ ( newValue ) => {
								setValue( {
									...value,
									top: newValue,
								} );
							} }
						/>
						<BorderControl
							id="right"
							linesDirection="vertical"
							className={ controlInnerClassNames(
								'border-corner-right'
							) }
							onChange={ ( newValue ) => {
								setValue( {
									...value,
									right: newValue,
								} );
							} }
						/>
						<BorderControl
							id="bottom"
							className={ controlInnerClassNames(
								'border-corner-bottom'
							) }
							onChange={ ( newValue ) => {
								setValue( {
									...value,
									bottom: newValue,
								} );
							} }
						/>
						<BorderControl
							id="left"
							linesDirection="vertical"
							className={ controlInnerClassNames(
								'border-corner-left'
							) }
							onChange={ ( newValue ) => {
								setValue( {
									...value,
									left: newValue,
								} );
							} }
						/>
					</div>
				</div>
			) }
		</div>
	);
}

BoxBorderControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.oneOfType( [
		PropTypes.shape( {
			type: 'all',
			all: PropTypes.shape( {
				width: PropTypes.string,
				style: PropTypes.oneOf( [
					'solid',
					'dashed',
					'dotted',
					'double',
				] ),
				color: PropTypes.string,
			} ),
		} ),
		PropTypes.shape( {
			type: PropTypes.oneOf( [ 'all', 'custom' ] ),
			all: PropTypes.shape( {
				width: PropTypes.string,
				style: PropTypes.oneOf( [
					'solid',
					'dashed',
					'dotted',
					'double',
				] ),
				color: PropTypes.string,
			} ),
			top: PropTypes.shape( {
				width: PropTypes.string,
				style: PropTypes.oneOf( [
					'solid',
					'dashed',
					'dotted',
					'double',
				] ),
				color: PropTypes.string,
			} ),
			right: PropTypes.shape( {
				width: PropTypes.string,
				style: PropTypes.oneOf( [
					'solid',
					'dashed',
					'dotted',
					'double',
				] ),
				color: PropTypes.string,
			} ),
			bottom: PropTypes.shape( {
				width: PropTypes.string,
				style: PropTypes.oneOf( [
					'solid',
					'dashed',
					'dotted',
					'double',
				] ),
				color: PropTypes.string,
			} ),
			left: PropTypes.shape( {
				width: PropTypes.string,
				style: PropTypes.oneOf( [
					'solid',
					'dashed',
					'dotted',
					'double',
				] ),
				color: PropTypes.string,
			} ),
		} ),
	] ),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
};

BoxBorderControl.defaultProps = {
	label: '',
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
