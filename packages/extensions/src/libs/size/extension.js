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
	BaseControl,
} from '@publisher/controls';
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TSizeProps } from './types/size-props';
import { default as OverflowHiddenIcon } from './icons/overflow-hidden';
import { default as OverflowVisibleIcon } from './icons/overflow-visible';
import { default as OverflowScrollIcon } from './icons/overflow-scroll';
import { convertToPercent } from './utils';

export const SizeExtension: MixedElement = memo<TSizeProps>(
	({
		block,
		width,
		height,
		minWidth,
		minHeight,
		maxWidth,
		maxHeight,
		config,
		overflow,
		children,
		defaultValue: { width: _width, height: _height, overflow: _overflow },
		handleOnChangeAttributes,
		...props
	}: TSizeProps): MixedElement => {
		const {
			sizeConfig: {
				publisherWidth,
				publisherHeight,
				publisherMinWidth,
				publisherMinHeight,
				publisherMaxWidth,
				publisherMaxHeight,
				publisherOverflow,
			},
		} = config;

		return (
			<>
				<BaseControl columns="columns-1">
					<Flex>
						<Flex
							gap="10px"
							direction="column"
							style={{ width: '120px' }}
						>
							{isActiveField(publisherWidth) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'width'
										),
										value: width,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Width', 'publisher-core')}
										columns="1.1fr 1.9fr"
										placeholder="0"
										unitType="width"
										min="0"
										defaultValue={_width}
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherWidth',
												newValue,
												'',
												(
													attributes: Object,
													setAttributes: (
														attributes: Object
													) => void
												): void => {
													// do not sync if unit type is func
													if (
														!newValue.endsWith(
															'func'
														)
													)
														setAttributes({
															...attributes,
															width: convertToPercent(
																newValue
															),
														});
												}
											)
										}
										{...props}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(publisherMinWidth) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'minWidth'
										),
										value: minWidth,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Min W', 'publisher-core')}
										columns="1.1fr 1.9fr"
										placeholder="0"
										unitType="min-width"
										min="0"
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherMinWidth',
												newValue,
												'',
												(
													attributes: Object,
													setAttributes: (
														attributes: Object
													) => void
												): void => {
													// do not sync if unit type is func
													if (
														!newValue.endsWith(
															'func'
														)
													)
														setAttributes({
															...attributes,
															minWidth:
																convertToPercent(
																	newValue
																),
														});
												}
											)
										}
										{...props}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(publisherMaxWidth) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'maxWidth'
										),
										value: maxWidth,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Max W', 'publisher-core')}
										columns="1.1fr 1.9fr"
										placeholder="0"
										unitType="max-width"
										min="0"
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherMaxWidth',
												newValue,
												'',
												(
													attributes: Object,
													setAttributes: (
														attributes: Object
													) => void
												): void => {
													// do not sync if unit type is func
													if (
														!newValue.endsWith(
															'func'
														)
													)
														setAttributes({
															...attributes,
															maxWidth:
																convertToPercent(
																	newValue
																),
														});
												}
											)
										}
										{...props}
									/>
								</ControlContextProvider>
							)}
						</Flex>

						<Flex
							gap="10px"
							direction="column"
							style={{ width: '120px' }}
						>
							{isActiveField(publisherHeight) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'height'
										),
										value: height,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Height', 'publisher-core')}
										columns="1.1fr 1.9fr"
										placeholder="0"
										unitType="height"
										min="0"
										defaultValue={_height}
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherHeight',
												newValue,
												'',
												(
													attributes: Object,
													setAttributes: (
														attributes: Object
													) => void
												): void => {
													// do not sync if unit type is func
													if (
														!newValue.endsWith(
															'func'
														)
													)
														setAttributes({
															...attributes,
															height: convertToPercent(
																newValue
															),
														});
												}
											)
										}
										{...props}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(publisherMinHeight) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'minHeight'
										),
										value: minHeight,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Min H', 'publisher-core')}
										columns="1.1fr 1.9fr"
										placeholder="0"
										unitType="min-height"
										min="0"
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherMinHeight',
												newValue,
												'',
												(
													attributes: Object,
													setAttributes: (
														attributes: Object
													) => void
												): void => {
													// do not sync if unit type is func
													if (
														!newValue.endsWith(
															'func'
														)
													)
														setAttributes({
															...attributes,
															minHeight:
																convertToPercent(
																	newValue
																),
														});
												}
											)
										}
										{...props}
									/>
								</ControlContextProvider>
							)}

							{isActiveField(publisherMaxHeight) && (
								<ControlContextProvider
									value={{
										name: generateExtensionId(
											block,
											'maxHeight'
										),
										value: maxHeight,
									}}
								>
									<InputControl
										controlName="input"
										label={__('Max H', 'publisher-core')}
										columns="1.1fr 1.9fr"
										placeholder="0"
										unitType="max-height"
										min="0"
										onChange={(newValue) =>
											handleOnChangeAttributes(
												'publisherMaxHeight',
												newValue,
												'',
												(
													attributes: Object,
													setAttributes: (
														attributes: Object
													) => void
												): void => {
													// do not sync if unit type is func
													if (
														!newValue.endsWith(
															'func'
														)
													)
														setAttributes({
															...attributes,
															maxHeight:
																convertToPercent(
																	newValue
																),
														});
												}
											)
										}
										{...props}
									/>
								</ControlContextProvider>
							)}
						</Flex>
					</Flex>
				</BaseControl>

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
									label: __(
										'Visible Overflow',
										'publisher-core'
									),
									value: 'visible',
									icon: <OverflowVisibleIcon />,
								},
								{
									label: __(
										'Hidden Overflow',
										'publisher-core'
									),
									value: 'hidden',
									icon: <OverflowHiddenIcon />,
								},
								{
									label: __(
										'Scroll Overflow',
										'publisher-core'
									),
									value: 'scroll',
									icon: <OverflowScrollIcon />,
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
