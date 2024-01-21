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
	BaseControl,
	ControlContextProvider,
	SelectControl,
	ToggleSelectControl,
	PanelBodyControl,
	LayoutMatrixControl,
} from '@publisher/controls';
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TGridChildProps } from './types/grid-child-props';
import { createAreasOptions } from './utils';
import GridChildExtensionIcon from './icons/extension-icon';

export const GridChildExtension: TGridChildProps = memo<TGridChildProps>(
	({
		block,
		values: { gridChildLayout, gridChildOrder, gridAreas },
		gridChildConfig: { publisherGridChildLayout, publisherGridChildOrder },
		handleOnChangeAttributes,
		extensionProps,
	}: TGridChildProps): MixedElement => {
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
				{isActiveField(publisherGridChildLayout) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'grid-child-layout'
							),
							value: gridChildLayout,
							attribute: 'publisherGridChildLayout',
							blockName: block.blockName,
						}}
					>
						<LayoutMatrixControl
							columns="80px 160px"
							label={__('Grid Layout', 'publisher-core')}
							defaultValue={{
								direction: 'row',
								alignItems: '',
								justifyContent: '',
							}}
							onChange={(newValue, ref) => {
								console.log(newValue);
								handleOnChangeAttributes(
									'publisherGridChildLayout',
									newValue,
									{ ref }
								);
							}}
							isDirectionActive={false}
							{...extensionProps.publisherGridChildLayout}
						/>
					</ControlContextProvider>
				)}

				{isActiveField(publisherGridChildOrder) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'grid-child-order'
							),
							value: gridChildOrder,
							attribute: 'publisherGridChildOrder',
							blockName: block.blockName,
						}}
					>
						<BaseControl
							columns="80px 160px"
							controlName="toggle-select"
							label={__('Self Order', 'publisher-core')}
						>
							<ToggleSelectControl
								id="value"
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
								defaultValue=""
								onChange={(value: string, ref?: Object) =>
									handleOnChangeAttributes(
										'publisherGridChildOrder',
										{ ...gridChildOrder, value },
										{ ref }
									)
								}
								{...extensionProps.publisherGridChildOrder}
							/>
							<>
								{gridChildOrder.value === 'manual' && (
									<SelectControl
										columns="columns-2"
										label={__('Cell', 'publisher-core')}
										id="area"
										options={createAreasOptions(gridAreas)}
										defaultValue={
											gridChildOrder?.area || ''
										}
										onChange={(
											area: string,
											ref?: Object
										): void => {
											console.log(area);
											handleOnChangeAttributes(
												'publisherGridChildOrder',
												{
													...gridChildOrder,
													area,
												},
												{ ref }
											);
										}}
										{...extensionProps.publisherGridChildOrder}
									/>
								)}
							</>
						</BaseControl>
					</ControlContextProvider>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
