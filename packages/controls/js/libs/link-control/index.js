// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../repeater-control/store';
import {
	Button,
	BaseControl,
	InputControl,
	CheckboxControl,
	AttributesControl,
} from '../index';
import type { LinkControlProps } from './types';
import { linkControlValueCleaner } from './utils';
import { ControlContextProvider, useControlContext } from '../../context';

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
						<Icon icon="gear" iconSize="18" />
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
