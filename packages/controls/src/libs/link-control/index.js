/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Button } from '@publisher/components';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../repeater-control/store';
import { default as AdvancedIcon } from './icons/advanced';
import {
	BaseControl,
	InputControl,
	CheckboxControl,
	AttributesControl,
} from '../index';
import { ControlContextProvider, useControlContext } from '../../context';

export default function LinkControl({
	onChange,
	className,
	placeholder,
	attributesId,
	defaultValue,
	advancedOpen,
}) {
	const {
		controlInfo: { name: controlId },
		value,
		setValue,
	} = useControlContext({
		onChange,
		defaultValue,
		mergeInitialAndDefault: true,
	});

	const [isAdvancedMode, setIsAdvancedMode] = useState(
		advancedOpen !== 'auto'
			? advancedOpen
			: !!(
					value.target ||
					value.nofollow ||
					value.label ||
					value.attributes?.length
			  )
	);

	return (
		<div className={controlClassNames('link', className)}>
			<div className={controlInnerClassNames('link-row-link')}>
				<InputControl
					id={'link'}
					placeholder={placeholder}
					onChange={(newValue) => {
						setValue({ ...value, link: newValue });
					}}
				/>
				<Button
					onClick={() => setIsAdvancedMode(!isAdvancedMode)}
					size="small"
					className={controlInnerClassNames(
						'link-advanced-options-btn',
						isAdvancedMode ? 'is-active' : ''
					)}
					noBorder={true}
					aria-label={__('Open Advanced Settings', 'publisher-core')}
				>
					<AdvancedIcon />
				</Button>
			</div>
			{isAdvancedMode && (
				<div
					className={controlInnerClassNames('link-advanced-settings')}
				>
					<CheckboxControl
						id={'target'}
						label={__('Open in New Window', 'publisher-core')}
						onChange={(newValue) => {
							setValue({
								...value,
								target: newValue,
							});
						}}
					/>

					<CheckboxControl
						id={'nofollow'}
						label={__('Add Nofollow', 'publisher-core')}
						onChange={(newValue) => {
							setValue({
								...value,
								nofollow: newValue,
							});
						}}
					/>

					<BaseControl
						controlName="input"
						label={__('Label', 'publisher-core')}
					>
						<InputControl
							id={'label'}
							onChange={(newValue) => {
								setValue({
									...value,
									label: newValue,
								});
							}}
						/>
					</BaseControl>

					<ControlContextProvider
						value={{
							name: `${controlId}/${attributesId}`,
							value: value.attributes,
						}}
						storeName={STORE_NAME}
					>
						<AttributesControl
							onChange={(newValue) => {
								setValue({
									...value,
									attributes: newValue,
								});
							}}
							attributeElement="a"
							isPopover={true}
							label={__('Attributes', 'publisher-core')}
						/>
					</ControlContextProvider>
				</div>
			)}
		</div>
	);
}

LinkControl.propTypes = {
	/**
	 * The control attributes identifier is required property!
	 */
	attributesId: PropTypes.string.isRequired,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.shape({
		link: PropTypes.string,
		target: PropTypes.bool,
		nofollow: PropTypes.bool,
		label: PropTypes.string,
		attributes: PropTypes.arrayOf(
			PropTypes.shape({
				key: PropTypes.string,
				value: PropTypes.string,
				isVisible: PropTypes.bool,
			})
		),
	}),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Controls that advanced mode will be open automatic if the inside values where defined or not
	 *
	 * @default `auto`
	 */
	advancedOpen: PropTypes.oneOfType([
		PropTypes.oneOf(['auto']),
		PropTypes.bool,
	]),
	/**
	 * link input placeholder text
	 */
	placeholder: PropTypes.string,
};

LinkControl.defaultProps = {
	attributesId: 'link-control-attributes',
	placeholder: 'https://your-link.com',
	advancedOpen: 'auto',
	defaultValue: {
		link: '',
		target: false,
		nofollow: false,
		label: '',
		attributes: [],
	},
};
