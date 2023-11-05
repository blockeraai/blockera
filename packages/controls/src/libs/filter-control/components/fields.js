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
import { getTypeOptions } from '../utils';
import { RepeaterContext } from '../../repeater-control/context';
import { useControlContext } from '../../../context';
import { ColorControl, InputControl, SelectControl } from '../../index';
import type { TFieldItem } from '../types';

const Fields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();

		const { repeaterId, getControlId } = useContext(RepeaterContext);

		return (
			<div id={`repeater-item-${itemId}`}>
				<SelectControl
					id={getControlId(itemId, 'type')}
					label={__('Type', 'publisher-core')}
					columns="columns-2"
					options={getTypeOptions()}
					onChange={(type) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, type },
						})
					}
				/>

				{item.type === 'blur' && (
					<InputControl
						id={getControlId(itemId, 'blur')}
						label={__('Blur', 'publisher-core')}
						columns="columns-2"
						type="css"
						unitType="essential"
						range={true}
						min={0}
						max={50}
						onChange={(blur) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: { ...item, blur },
							})
						}
					/>
				)}

				{item.type === 'drop-shadow' && (
					<>
						<InputControl
							id={getControlId(itemId, 'drop-shadow-x')}
							label={__('X', 'publisher-core')}
							columns="columns-2"
							type="css"
							unitType="essential"
							range={true}
							min={-100}
							max={100}
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'drop-shadow-x': newValue,
									},
								})
							}
						/>

						<InputControl
							id={getControlId(itemId, 'drop-shadow-y')}
							label={__('Y', 'publisher-core')}
							columns="columns-2"
							type="css"
							unitType="essential"
							range={true}
							min={-100}
							max={100}
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'drop-shadow-y': newValue,
									},
								})
							}
						/>

						<InputControl
							id={getControlId(itemId, 'drop-shadow-blur')}
							label={__('Blur', 'publisher-core')}
							columns="columns-2"
							type="css"
							unitType="essential"
							range={true}
							min={0}
							max={100}
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'drop-shadow-blur': newValue,
									},
								})
							}
						/>

						<ColorControl
							id={getControlId(itemId, 'drop-shadow-color')}
							label={__('Color', 'publisher-core')}
							columns="columns-2"
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'drop-shadow-color': newValue,
									},
								})
							}
						/>
					</>
				)}

				{item.type === 'brightness' && (
					<InputControl
						id={getControlId(itemId, 'brightness')}
						label={__('Brightness', 'publisher-core')}
						columns="columns-2"
						type="css"
						unitType="percent"
						range={true}
						min={0}
						max={200}
						onChange={(brightness) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									brightness,
								},
							})
						}
					/>
				)}

				{item.type === 'contrast' && (
					<InputControl
						id={getControlId(itemId, 'contrast')}
						label={__('Contrast', 'publisher-core')}
						columns="columns-2"
						type="css"
						unitType="percent"
						range={true}
						min={0}
						max={200}
						onChange={(contrast) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									contrast,
								},
							})
						}
					/>
				)}

				{item.type === 'hue-rotate' && (
					<InputControl
						id={getControlId(itemId, 'hue-rotate')}
						label={__('Hue Rotate', 'publisher-core')}
						columns="columns-2"
						type="css"
						unitType="angle"
						range={true}
						min={-365}
						max={365}
						onChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									'hue-rotate': newValue,
								},
							})
						}
					/>
				)}

				{item.type === 'saturate' && (
					<InputControl
						id={getControlId(itemId, 'saturate')}
						label={__('Saturation', 'publisher-core')}
						columns="columns-2"
						type="css"
						unitType="percent"
						range={true}
						min={0}
						max={200}
						onChange={(saturate) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									saturate,
								},
							})
						}
					/>
				)}

				{item.type === 'grayscale' && (
					<InputControl
						id={getControlId(itemId, 'grayscale')}
						label={__('Grayscale', 'publisher-core')}
						columns="columns-2"
						type="css"
						unitType="percent"
						range={true}
						min={0}
						max={100}
						onChange={(grayscale) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									grayscale,
								},
							})
						}
					/>
				)}

				{item.type === 'invert' && (
					<InputControl
						id={getControlId(itemId, 'invert')}
						label={__('Invert', 'publisher-core')}
						columns="columns-2"
						type="css"
						unitType="percent"
						range={true}
						min={0}
						max={100}
						onChange={(invert) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									invert,
								},
							})
						}
					/>
				)}

				{item.type === 'sepia' && (
					<InputControl
						id={getControlId(itemId, 'sepia')}
						label={__('Sepia', 'publisher-core')}
						columns="columns-2"
						type="css"
						unitType="percent"
						range={true}
						min={0}
						max={100}
						onChange={(sepia) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									sepia,
								},
							})
						}
					/>
				)}
			</div>
		);
	}
);

export default Fields;
