// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../../../../controls/src/libs/repeater-control/context';
import {
	InputControl,
	ToggleSelectControl,
	CheckboxControl,
	NoticeControl,
} from '@publisher/controls';
import { useControlContext } from '../../../../../controls/src/context';
import type { TFieldItem } from '../types/layout-props';

const Fields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();
		const {
			repeaterId,
			getControlId,
			defaultRepeaterItemValue,
			repeaterItems,
		} = useContext(RepeaterContext);

		const isAutoFitEnabled =
			item['auto-fit'] ||
			repeaterItems
				.map((item) => {
					if (item['auto-generated']) return item;
					if (item['auto-fit']) return null;
					if (
						item['sizing-mode'] === 'normal' &&
						(item.size.slice(-2) === 'fr' || item.size === 'auto')
					)
						return null;

					if (
						item['sizing-mode'] === 'min/max' &&
						item['min-size'] === 'auto' &&
						item['max-size'] === 'auto'
					)
						return null;
					if (
						item['sizing-mode'] === 'min/max' &&
						item['min-size'] === 'auto' &&
						item['max-size'].slice(-2) === 'fr'
					)
						return null;

					return item;
				})
				.every((item) => item !== null);

		return (
			<div id={`repeater-item-${itemId}`}>
				<ToggleSelectControl
					repeaterItem={itemId}
					id={getControlId(itemId, '[sizing-mode]')}
					singularId={'[sizing-mode]'}
					label={__('Sizing Mode', 'publisher-core')}
					columns="columns-2"
					options={[
						{
							label: __('Normal', 'publisher-core'),
							value: 'normal',
						},
						{
							label: __('Min / Max', 'publisher-core'),
							value: 'min/max',
						},
					]}
					onChange={(newValue) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, 'sizing-mode': newValue },
						})
					}
					defaultValue={defaultRepeaterItemValue['sizing-mode']}
				/>

				{item['sizing-mode'] === 'normal' ? (
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'size')}
						singularId={'size'}
						label={__('Size', 'publisher-core')}
						columns="columns-2"
						unitType={item['auto-fit'] ? 'essential' : 'grid-size'}
						range={true}
						min={0}
						onChange={(size) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, size },
							})
						}
						defaultValue={defaultRepeaterItemValue.size}
						controlAddonTypes={['variable']}
						variableTypes={['width-size']}
					/>
				) : (
					<>
						<InputControl
							repeaterItem={itemId}
							id={getControlId(itemId, '[min-size]')}
							singularId={'[min-size]'}
							label={__('Min', 'publisher-core')}
							columns="columns-2"
							unitType={item['auto-fit'] ? 'essential' : 'width'}
							range={true}
							min={0}
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: { ...item, 'min-size': newValue },
								})
							}
							defaultValue={defaultRepeaterItemValue['min-size']}
							controlAddonTypes={['variable']}
							variableTypes={['width-size']}
						/>

						<InputControl
							repeaterItem={itemId}
							id={getControlId(itemId, '[max-size]')}
							singularId={'[max-size]'}
							label={__('Max', 'publisher-core')}
							columns="columns-2"
							unitType="grid-size"
							range={true}
							min={0}
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: { ...item, 'max-size': newValue },
								})
							}
							defaultValue={defaultRepeaterItemValue['max-size']}
							controlAddonTypes={['variable']}
							variableTypes={['width-size']}
						/>
					</>
				)}

				{!item['auto-generated'] && (
					<>
						<CheckboxControl
							id={getControlId(itemId, '[auto-fit]')}
							singularId={'[auto-fit]'}
							columns="columns-2"
							className="publisher-grid-auto-fit"
							checkboxLabel={__('', 'publisher-core')}
							label={__('Auto Fit', 'publisher-core')}
							disabled={!isAutoFitEnabled}
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: { ...item, 'auto-fit': newValue },
								})
							}
						/>
						{!isAutoFitEnabled && (
							<NoticeControl
								type="information"
								style={{ marginTop: '10px' }}
							>
								{__(
									`Auto-fit cannot be enabled if there are columns or rows with 'auto', flexible (FR), minmax(auto, fr), minmax(auto, auto), or similar settings.`,
									'publisher-core'
								)}
							</NoticeControl>
						)}
					</>
				)}
			</div>
		);
	}
);
export default Fields;
