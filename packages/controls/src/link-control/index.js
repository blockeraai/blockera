/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { useLateEffect } from '@publisher/utils';
import { Button } from '@publisher/components';

/**
 * Internal dependencies
 */
import { InputControl, CheckboxControl, AttributesControl } from '../index';
import { default as AdvancedIcon } from './icons/advanced';
import { InputField } from '@publisher/fields';

const LinkControl = ({
	advancedOpen = 'auto',
	//
	defaultValue = {
		link: '',
		target: false,
		nofollow: false,
		label: '',
		attributes: [],
	},
	placeholder = 'https://your-link.com',
	value,
	//
	className,
	onChange = (newValue) => {
		return newValue;
	},
	onValueChange = (newValue) => {
		return newValue;
	},
}) => {
	const [controlValue, setControlValue] = useState({
		...defaultValue,
		...value,
	});

	const [isAdvancedMode, setIsAdvancedMode] = useState(
		advancedOpen !== 'auto'
			? advancedOpen
			: !!(
					controlValue.target ||
					controlValue.nofollow ||
					controlValue.label ||
					controlValue.attributes?.length
			  )
	);

	useLateEffect(() => {
		const newValue = onChange(controlValue);
		onValueChange(newValue);
	}, [controlValue]);

	return (
		<div className={controlClassNames('link', className)}>
			<div className={controlInnerClassNames('link-row-link')}>
				<InputControl
					value={controlValue.link}
					placeholder={placeholder}
					onChange={(newValue) => {
						setControlValue({ ...controlValue, link: newValue });
					}}
				/>
				<Button
					onClick={() => setIsAdvancedMode(!isAdvancedMode)}
					size="small"
					className={controlInnerClassNames(
						'link-advanced-options-btn',
						isAdvancedMode ? 'is-active' : ''
					)}
				>
					<AdvancedIcon />
				</Button>
			</div>
			{isAdvancedMode && (
				<div
					className={controlInnerClassNames('link-advanced-settings')}
				>
					<CheckboxControl
						value={controlValue.target}
						label={__('Open in New Window', 'publisher-core')}
						onChange={(newValue) => {
							setControlValue({
								...controlValue,
								target: newValue,
							});
						}}
					/>

					<CheckboxControl
						value={controlValue.nofollow}
						label={__('Add Nofollow', 'publisher-core')}
						onChange={(newValue) => {
							setControlValue({
								...controlValue,
								nofollow: newValue,
							});
						}}
					/>

					<InputField
						settings={{
							type: 'text',
						}}
						label={__('Label', 'publisher-core')}
						value={controlValue.label}
						onChange={(newValue) => {
							setControlValue({
								...controlValue,
								label: newValue,
							});
						}}
					/>

					<AttributesControl
						value={controlValue.attributes}
						onValueChange={(newValue) => {
							setControlValue({
								...controlValue,
								attributes: newValue,
							});
						}}
						attributeElement="a"
						isPopover={true}
						label={__('Attributes', 'publisher-core')}
					/>
				</div>
			)}
		</div>
	);
};

export default LinkControl;
