/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
	ToggleSelectControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import { default as OverflowVisibleIcon } from './icons/overflow-visible';
import { default as OverflowHiddenIcon } from './icons/overflow-hidden';
import { default as OverflowScrollIcon } from './icons/overflow-scroll';

export const SizeExtension = memo(
	({
		block,
		width,
		height,
		config,
		overflow,
		children,
		handleOnChangeAttributes,
		...props
	}) => {
		const {
			sizeConfig: { publisherWidth, publisherHeight, publisherOverflow },
		} = config;

		return (
			<>
				{isActiveField(publisherWidth) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'width'),
							value: width,
						}}
					>
						<BaseControl
							controlName="input"
							label={__('Width', 'publisher-core')}
						>
							<InputControl
								{...{
									...props,
									unitType: 'essential',
									min: 0,
									defaultValue: '',
									onChange: (newValue) =>
										handleOnChangeAttributes(
											'publisherWidth',
											newValue
										),
								}}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherHeight) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'height'),
							value: height,
						}}
					>
						<BaseControl
							controlName="input"
							label={__('Height', 'publisher-core')}
						>
							<InputControl
								{...{
									...props,
									unitType: 'essential',
									min: 0,
									defaultValue: '',
									onChange: (newValue) =>
										handleOnChangeAttributes(
											'publisherHeight',
											newValue
										),
								}}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherOverflow) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'overflow'),
							value: overflow,
						}}
					>
						<BaseControl
							controlName="toggle-select"
							label={__('Overflow', 'publisher-core')}
						>
							<ToggleSelectControl
								options={[
									{
										label: __('Visible', 'publisher-core'),
										value: 'visible',
										icon: <OverflowVisibleIcon />,
									},
									{
										label: __('Hidden', 'publisher-core'),
										value: 'hidden',
										icon: <OverflowHiddenIcon />,
									},
									{
										label: __('Scroll', 'publisher-core'),
										value: 'scroll',
										icon: <OverflowScrollIcon />,
									},
								]}
								//
								defaultValue="visible"
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherOverflow',
										newValue
									)
								}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
