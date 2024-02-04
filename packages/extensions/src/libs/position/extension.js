// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	PanelBodyControl,
	BoxPositionControl,
	ControlContextProvider,
	InputControl,
} from '@publisher/controls';
import { componentClassNames } from '@publisher/classnames';
import { FeatureWrapper } from '@publisher/components';

/**
 * Internal dependencies
 */
import { PositionExtensionIcon } from './index';
import { isShowField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TPositionExtensionProps } from './types/position-extension-props';

export const PositionExtension: ComponentType<TPositionExtensionProps> = memo(
	({
		block,
		extensionConfig,
		values,
		attributes,
		handleOnChangeAttributes,
		extensionProps,
	}: TPositionExtensionProps): MixedElement => {
		const isShownPosition = isShowField(
			extensionConfig.publisherPosition,
			values?.publisherPosition,
			attributes.publisherPosition.default
		);

		if (!isShownPosition) {
			return <></>;
		}

		const isShownZIndex = isShowField(
			extensionConfig.publisherZIndex,
			values?.publisherZIndex,
			attributes.publisherZIndex.default
		);

		return (
			<PanelBodyControl
				title={__('Position', 'publisher-core')}
				initialOpen={true}
				icon={<PositionExtensionIcon />}
				className={componentClassNames(
					'extension',
					'extension-position'
				)}
			>
				<FeatureWrapper
					isActive={isShownPosition}
					isActiveOnStates={
						extensionConfig.publisherPosition.isActiveOnStates
					}
					isActiveOnBreakpoints={
						extensionConfig.publisherPosition.isActiveOnBreakpoints
					}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'position'),
							value: values?.publisherPosition,
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
										{ ref }
									)
								}
								defaultValue={
									attributes.publisherPosition.default
								}
								{...extensionProps.publisherPosition}
							/>
						</BaseControl>
					</ControlContextProvider>
				</FeatureWrapper>

				{values?.publisherPosition?.type !== '' &&
					values?.publisherPosition?.type !== undefined &&
					values?.publisherPosition?.type !== 'static' && (
						<FeatureWrapper
							isActive={isShownZIndex}
							isActiveOnStates={
								extensionConfig.publisherZIndex.isActiveOnStates
							}
							isActiveOnBreakpoints={
								extensionConfig.publisherZIndex
									.isActiveOnBreakpoints
							}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(block, 'z-index'),
									value: values.publisherZIndex,
									attribute: 'publisherZIndex',
									blockName: block.blockName,
								}}
							>
								<InputControl
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
									defaultValue={
										attributes.publisherZIndex.default
									}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'publisherZIndex',
											newValue,
											{ ref }
										)
									}
									{...extensionProps.publisherZIndex}
								/>
							</ControlContextProvider>
						</FeatureWrapper>
					)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
