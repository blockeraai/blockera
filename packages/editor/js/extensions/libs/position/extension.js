// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	PanelBodyControl,
	BoxPositionControl,
	ControlContextProvider,
	InputControl,
} from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';
import { hasSameProps } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { PositionExtensionIcon } from './index';
import { EditorFeatureWrapper } from '../../../';
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
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
			extensionConfig.blockeraPosition,
			values?.blockeraPosition,
			attributes.blockeraPosition.default
		);

		if (!isShownPosition) {
			return <></>;
		}

		const isShownZIndex = isShowField(
			extensionConfig.blockeraZIndex,
			values?.blockeraZIndex,
			attributes.blockeraZIndex.default
		);

		return (
			<PanelBodyControl
				title={__('Position', 'blockera')}
				initialOpen={true}
				icon={<PositionExtensionIcon />}
				className={extensionClassNames('position')}
			>
				<EditorFeatureWrapper
					isActive={isShownPosition}
					config={extensionConfig.blockeraPosition}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'position'),
							value: values?.blockeraPosition,
							attribute: 'blockeraPosition',
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
										'blockeraPosition',
										newValue,
										{ ref }
									)
								}
								defaultValue={
									attributes.blockeraPosition.default
								}
								{...extensionProps.blockeraPosition}
							/>
						</BaseControl>
					</ControlContextProvider>
				</EditorFeatureWrapper>

				{values?.blockeraPosition?.type !== '' &&
					values?.blockeraPosition?.type !== undefined &&
					values?.blockeraPosition?.type !== 'static' && (
						<EditorFeatureWrapper
							isActive={isShownZIndex}
							config={extensionConfig.blockeraZIndex}
						>
							<ControlContextProvider
								value={{
									name: generateExtensionId(block, 'z-index'),
									value: values.blockeraZIndex,
									attribute: 'blockeraZIndex',
									blockName: block.blockName,
								}}
							>
								<InputControl
									columns="columns-2"
									label={__('z-index', 'blockera')}
									labelDescription={
										<>
											<p>
												{__(
													'Control the stacking order of blocks with z-index, a CSS property that manages the layering and overlap of components on your website.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													'z-index is crucial for creating visually appealing layouts, especially in complex designs, allowing you to prioritize content visibility and interaction.',
													'blockera'
												)}
											</p>
										</>
									}
									type="number"
									unitType="z-index"
									arrows={true}
									defaultValue={
										attributes.blockeraZIndex.default
									}
									onChange={(newValue, ref) =>
										handleOnChangeAttributes(
											'blockeraZIndex',
											newValue,
											{ ref }
										)
									}
									{...extensionProps.blockeraZIndex}
								/>
							</ControlContextProvider>
						</EditorFeatureWrapper>
					)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
