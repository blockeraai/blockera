// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	ControlContextProvider,
	InputControl,
	ToggleSelectControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TSizeProps } from './types/size-props';
import { default as OverflowHiddenIcon } from './icons/overflow-hidden';
import { default as OverflowScrollIcon } from './icons/overflow-scroll';
import { default as OverflowVisibleIcon } from './icons/overflow-visible';
import { convertToPercent } from './utils';

export const SizeExtension: MixedElement = memo<TSizeProps>(
	({
		block,
		width,
		height,
		config,
		overflow,
		children,
		defaultValue: { width: _width, height: _height, overflow: _overflow },
		handleOnChangeAttributes,
		...props
	}: TSizeProps): MixedElement => {
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
						<InputControl
							controlName="input"
							label={__('Width', 'publisher-core')}
							columns="columns-2"
							{...{
								...props,
								unitType: 'essential',
								min: 0,
								defaultValue: _width,
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherWidth',
										newValue,
										'',
										(
											attributes: Object,
											setAttributes: (
												attributes: Object
											) => void
										): void =>
											setAttributes({
												...attributes,
												width: convertToPercent(
													newValue
												),
											})
									),
							}}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherHeight) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'height'),
							value: height,
						}}
					>
						<InputControl
							controlName="input"
							label={__('Height', 'publisher-core')}
							columns="columns-2"
							{...{
								...props,
								unitType: 'essential',
								min: 0,
								defaultValue: _height,
								onChange: (newValue) =>
									handleOnChangeAttributes(
										'publisherHeight',
										newValue,
										'',
										(
											attributes: Object,
											setAttributes: (
												attributes: Object
											) => void
										): void =>
											setAttributes({
												...attributes,
												height: convertToPercent(
													newValue
												),
											})
									),
							}}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherOverflow) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'overflow'),
							value: overflow,
						}}
					>
						<ToggleSelectControl
							controlName="toggle-select"
							label={__('Overflow', 'publisher-core')}
							columns="columns-2"
							isDeselectable={true}
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
								},
							]}
							//
							defaultValue={_overflow || ''}
							onChange={(newValue) =>
								handleOnChangeAttributes(
									'publisherOverflow',
									newValue
								)
							}
						/>
					</ControlContextProvider>
				)}
			</>
		);
	},
	hasSameProps
);
