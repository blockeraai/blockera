// @flow
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
/**
 * types
 */
import type { MixedElement } from 'react';
import type { TLinkControlProps } from './types/link-control-props';

export default function LinkControl({
	label,
	columns,
	field,
	onChange,
	className,
	placeholder,
	attributesId = 'link-control-attributes',
	defaultValue,
	advancedOpen,
}: TLinkControlProps): MixedElement {
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
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
		>
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
						aria-label={__(
							'Open Advanced Settings',
							'publisher-core'
						)}
					>
						<AdvancedIcon />
					</Button>
				</div>
				{isAdvancedMode && (
					<div
						className={controlInnerClassNames(
							'link-advanced-settings'
						)}
						data-cy="link-advance-setting"
					>
						<CheckboxControl
							id={'target'}
							checkboxLabel={__(
								'Open in New Window',
								'publisher-core'
							)}
							label=""
							columns=""
							onChange={(newValue) => {
								setValue({
									...value,
									target: newValue,
								});
							}}
						/>

						<CheckboxControl
							id={'nofollow'}
							label=""
							columns=""
							checkboxLabel={__('Add Nofollow', 'publisher-core')}
							onChange={(newValue) => {
								setValue({
									...value,
									nofollow: newValue,
								});
							}}
						/>

						<InputControl
							controlName="input"
							label={__('Label', 'publisher-core')}
							columns="columns-2"
							id={'label'}
							onChange={(newValue) => {
								setValue({
									...value,
									label: newValue,
								});
							}}
						/>

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
		</BaseControl>
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
	// $FlowFixMe
	defaultValue: (PropTypes.shape({
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
	}): any),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Controls that advanced mode will be open automatic if the inside values where defined or not
	 *
	 * @default `auto`
	 */
	// $FlowFixMe
	advancedOpen: PropTypes.oneOfType([
		PropTypes.oneOf(['auto']),
		PropTypes.bool,
	]),
	/**
	 * link input placeholder text
	 */
	placeholder: PropTypes.string,
};
// $FlowFixMe
LinkControl.defaultProps = {
	attributesId: 'link-control-attributes',
	placeholder: 'https://your-link.com',
	advancedOpen: 'auto',
	defaultValue: {
		link: '',
		target: false,
		nofollow: false,
		label: '',
		// $FlowFixMe
		attributes: [],
	},
	field: 'link',
};
