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
	BaseControl,
	BoxPositionControl,
	ControlContextProvider,
	InputControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TPositionExtensionProps } from './types/position-extension-props';
import { useBlockContext } from '../../hooks';
import { positionToWPCompatible } from './utils';

export const PositionExtension: MixedElement = memo<TPositionExtensionProps>(
	({
		block,
		config,
		values,
		inheritValues,
		handleOnChangeAttributes,
		extensionProps,
	}: TPositionExtensionProps): MixedElement => {
		const {
			positionConfig: { publisherPosition, publisherZIndex },
		} = config;

		const { isNormalState, getAttributes } = useBlockContext();

		return (
			<>
				{isActiveField(publisherPosition) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'position'),
							value: (() => {
								if (isNormalState()) {
									return values.position?.type
										? values.position
										: inheritValues.position;
								}

								return values.position;
							})(),
							attribute: 'publisherPosition',
							blockName: block.blockName,
						}}
					>
						<BaseControl
							controlName="box-position"
							columns="columns-1"
							label=""
						>
							<BoxPositionControl
								onChange={(
									newValue: Object,
									ref?: Object
								): void =>
									handleOnChangeAttributes(
										'publisherPosition',
										newValue,
										{
											ref,
											addOrModifyRootItems:
												positionToWPCompatible({
													newValue,
													ref,
													isNormalState,
													getAttributes,
												}),
										}
									)
								}
								{...extensionProps.publisherPosition}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherZIndex) &&
					values.position?.type !== '' &&
					values.position?.type !== undefined &&
					values.position?.type !== 'static' && (
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'z-index'),
								value: values.zIndex,
								attribute: 'publisherZIndex',
								blockName: block.blockName,
							}}
						>
							<InputControl
								controlName="input"
								columns="columns-2"
								label={__('z-index', 'publisher-core')}
								labelDescription={
									<>
										<p>
											{__(
												'Control the stacking order of blocks with z-index, a CSS property that manages the layering and overlap of components on your website.',
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'z-index is crucial for creating visually appealing layouts, especially in complex designs, allowing you to prioritize content visibility and interaction.',
												'publisher-core'
											)}
										</p>
									</>
								}
								type="number"
								unitType="z-index"
								arrows={true}
								defaultValue=""
								onChange={(newValue, ref) =>
									handleOnChangeAttributes(
										'publisherZIndex',
										newValue,
										{
											ref,
										}
									)
								}
								{...extensionProps.publisherZIndex}
							/>
						</ControlContextProvider>
					)}
			</>
		);
	},
	hasSameProps
);
