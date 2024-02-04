// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	ControlContextProvider,
	SelectControl,
	ToggleSelectControl,
	PanelBodyControl,
	LayoutMatrixControl,
} from '@publisher/controls';
import { componentClassNames } from '@publisher/classnames';
import { FeatureWrapper } from '@publisher/components';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TGridChildProps } from './types/grid-child-props';
import { createAreasOptions } from './utils';
import GridChildExtensionIcon from './icons/extension-icon';
import { ExtensionSettings } from '../settings';

export const GridChildExtension: TGridChildProps = memo<TGridChildProps>(
	({
		block,
		extensionConfig,
		values,
		handleOnChangeAttributes,
		extensionProps,
		setSettings,
		attributes,
	}: TGridChildProps): MixedElement => {
		const isShowGridChildLayout = isShowField(
			extensionConfig.publisherGridChildLayout,
			values?.publisherGridChildLayout,
			attributes.publisherGridChildLayout.default
		);
		const isShowGridChildOrder = isShowField(
			extensionConfig.publisherGridChildOrder,
			values?.publisherGridChildOrder,
			attributes.publisherGridChildOrder.default
		);

		if (!isShowGridChildLayout && !isShowGridChildOrder) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('grid Child', 'publisher-core')}
				initialOpen={true}
				icon={<GridChildExtensionIcon />}
				className={componentClassNames(
					'extension',
					'extension-grid-child'
				)}
			>
				<ExtensionSettings
					features={extensionConfig}
					update={(newSettings) => {
						setSettings(newSettings, 'gridChildConfig');
					}}
				/>

				<FeatureWrapper
					isActive={isShowGridChildLayout}
					isActiveOnStates={
						extensionConfig.publisherGridChildLayout
							.isActiveOnStates
					}
					isActiveOnBreakpoints={
						extensionConfig.publisherGridChildLayout
							.isActiveOnBreakpoints
					}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'grid-child-layout'
							),
							value: values.publisherGridChildLayout,
							attribute: 'publisherGridChildLayout',
							blockName: block.blockName,
						}}
					>
						<LayoutMatrixControl
							columns="80px 160px"
							label={__('Self Layout', 'publisher-core')}
							defaultValue={
								attributes.publisherGridChildLayout.default
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'publisherGridChildLayout',
									newValue,
									{ ref }
								)
							}
							isDirectionActive={false}
							{...extensionProps.publisherGridChildLayout}
						/>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowGridChildOrder}
					isActiveOnStates={
						extensionConfig.publisherGridChildOrder.isActiveOnStates
					}
					isActiveOnBreakpoints={
						extensionConfig.publisherGridChildOrder
							.isActiveOnBreakpoints
					}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'grid-child-order'
							),
							value: values.publisherGridChildOrder,
							attribute: 'publisherGridChildOrder',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							id={"['value']"}
							singularId={"['value']"}
							label={__('Self Order', 'publisher-core')}
							columns="80px 160px"
							controlName="toggle-select"
							options={[
								{
									label: __('First', 'publisher-core'),
									value: 'first',
								},
								{
									label: __('Last', 'publisher-core'),
									value: 'last',
								},
								{
									label: __('Manual', 'publisher-core'),
									value: 'manual',
								},
							]}
							isDeselectable={true}
							//
							defaultValue={
								attributes.publisherGridChildOrder.default
							}
							onChange={(value: string, ref?: Object) =>
								handleOnChangeAttributes(
									'publisherGridChildOrder',
									{
										...values.publisherGridChildOrder,
										value,
									},
									{ ref }
								)
							}
							{...extensionProps.publisherGridChildOrder}
						>
							{values.publisherGridChildOrder.value ===
								'manual' && (
								<SelectControl
									columns="columns-2"
									label={__('Cell', 'publisher-core')}
									id={"['area']"}
									singularId={"['area']"}
									options={createAreasOptions(
										values.gridAreas
									)}
									defaultValue={
										values.publisherGridChildOrder?.area ||
										''
									}
									onChange={(
										area: string,
										ref?: Object
									): void =>
										handleOnChangeAttributes(
											'publisherGridChildOrder',
											{
												...values.publisherGridChildOrder,
												area,
											},
											{ ref }
										)
									}
									{...extensionProps.publisherGridChildOrder}
								/>
							)}
						</ToggleSelectControl>
					</ControlContextProvider>
				</FeatureWrapper>
			</PanelBodyControl>
		);
	},
	hasSameProps
);
