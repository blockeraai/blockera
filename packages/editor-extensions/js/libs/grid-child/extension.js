// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	ControlContextProvider,
	SelectControl,
	ToggleSelectControl,
	PanelBodyControl,
	LayoutMatrixControl,
} from '@blockera/controls';
import { componentClassNames } from '@blockera/classnames';
import { FeatureWrapper } from '@blockera/components';
import { hasSameProps } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { isShowField } from '../../api/utils';
import { generateExtensionId } from '../utils';
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
			extensionConfig.blockeraGridChildLayout,
			values?.blockeraGridChildLayout,
			attributes.blockeraGridChildLayout.default
		);
		const isShowGridChildOrder = isShowField(
			extensionConfig.blockeraGridChildOrder,
			values?.blockeraGridChildOrder,
			attributes.blockeraGridChildOrder.default
		);

		if (!isShowGridChildLayout && !isShowGridChildOrder) {
			return <></>;
		}

		return (
			<PanelBodyControl
				title={__('grid Child', 'blockera')}
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
					config={extensionConfig.blockeraGridChildLayout}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'grid-child-layout'
							),
							value: values.blockeraGridChildLayout,
							attribute: 'blockeraGridChildLayout',
							blockName: block.blockName,
						}}
					>
						<LayoutMatrixControl
							columns="80px 160px"
							label={__('Self Layout', 'blockera')}
							defaultValue={
								attributes.blockeraGridChildLayout.default
							}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									'blockeraGridChildLayout',
									newValue,
									{ ref }
								)
							}
							isDirectionActive={false}
							{...extensionProps.blockeraGridChildLayout}
						/>
					</ControlContextProvider>
				</FeatureWrapper>

				<FeatureWrapper
					isActive={isShowGridChildOrder}
					config={extensionConfig.blockeraGridChildOrder}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'grid-child-order'
							),
							value: values.blockeraGridChildOrder,
							attribute: 'blockeraGridChildOrder',
							blockName: block.blockName,
						}}
					>
						<ToggleSelectControl
							id={"['value']"}
							singularId={"['value']"}
							label={__('Self Order', 'blockera')}
							columns="80px 160px"
							controlName="toggle-select"
							options={[
								{
									label: __('First', 'blockera'),
									value: 'first',
								},
								{
									label: __('Last', 'blockera'),
									value: 'last',
								},
								{
									label: __('Manual', 'blockera'),
									value: 'manual',
								},
							]}
							isDeselectable={true}
							//
							defaultValue={
								attributes.blockeraGridChildOrder.default
							}
							onChange={(value: string, ref?: Object) =>
								handleOnChangeAttributes(
									'blockeraGridChildOrder',
									{
										...values.blockeraGridChildOrder,
										value,
									},
									{ ref }
								)
							}
							{...extensionProps.blockeraGridChildOrder}
						>
							{values.blockeraGridChildOrder.value ===
								'manual' && (
								<SelectControl
									columns="columns-2"
									label={__('Cell', 'blockera')}
									id={"['area']"}
									singularId={"['area']"}
									options={createAreasOptions(
										values.gridAreas
									)}
									defaultValue={
										values.blockeraGridChildOrder?.area ||
										''
									}
									onChange={(
										area: string,
										ref?: Object
									): void =>
										handleOnChangeAttributes(
											'blockeraGridChildOrder',
											{
												...values.blockeraGridChildOrder,
												area,
											},
											{ ref }
										)
									}
									{...extensionProps.blockeraGridChildOrder}
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
