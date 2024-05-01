// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { Button } from '@blockera/components';

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
import type { LinkControlProps } from './types';
import { linkControlValueCleaner } from './utils';

export default function LinkControl({
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	singularId,
	repeaterItem,
	columns,
	field = 'link',
	onChange,
	className,
	placeholder = 'https://your-link.com',
	attributesId = 'link-control-attributes',
	defaultValue = {
		link: '',
		target: false,
		nofollow: false,
		label: '',
		attributes: [],
	},
	advancedOpen = 'auto',
}: LinkControlProps): MixedElement {
	const {
		controlInfo: { name: controlId },
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		onChange,
		defaultValue,
		mergeInitialAndDefault: true,
		valueCleanup: linkControlValueCleaner,
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

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle,
		labelDescription,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			<div className={controlClassNames('link', className)}>
				<div className={controlInnerClassNames('link-row-link')}>
					<InputControl
						id={'link'}
						placeholder={placeholder}
						onChange={(newValue) => {
							setValue({ ...value, link: newValue });
						}}
						defaultValue={defaultValue.link}
					/>
					<Button
						onClick={() => setIsAdvancedMode(!isAdvancedMode)}
						size="small"
						className={controlInnerClassNames(
							'link-advanced-options-btn',
							isAdvancedMode ? 'is-active' : ''
						)}
						noBorder={true}
						aria-label={__('Open Advanced Settings', 'blockera')}
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
							checkboxLabel={__('Open in New Window', 'blockera')}
							label=""
							columns=""
							onChange={(newValue) => {
								setValue({
									...value,
									target: newValue,
								});
							}}
							defaultValue={defaultValue.target}
						/>

						<CheckboxControl
							id={'nofollow'}
							label=""
							columns=""
							checkboxLabel={__('Add Nofollow', 'blockera')}
							onChange={(newValue) => {
								setValue({
									...value,
									nofollow: newValue,
								});
							}}
							defaultValue={defaultValue.nofollow}
						/>

						<InputControl
							controlName="input"
							label={__('Label', 'blockera')}
							columns="columns-2"
							id={'label'}
							onChange={(newValue) => {
								setValue({
									...value,
									label: newValue,
								});
							}}
							aria-label={__('Link Label', 'blockera')}
							defaultValue={defaultValue.label}
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
								label={__('Attributes', 'blockera')}
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
