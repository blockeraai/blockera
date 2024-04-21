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
import XCoordinateIcon from '../icons/coordinate-x';
import YCoordinateIcon from '../../box-shadow-control/icons/coordinate-y';

const Fields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();

		const {
			repeaterId,
			getControlId,
			labelPopoverTitle,
			labelDescription,
			defaultRepeaterItemValue,
		} = useContext(RepeaterContext);

		return (
			<div id={`repeater-item-${itemId}`}>
				<SelectControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'type')}
					singularId={'type'}
					label={__('Type', 'blockera-core')}
					labelPopoverTitle={labelPopoverTitle}
					labelDescription={labelDescription}
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
					defaultValue={defaultRepeaterItemValue.type}
				/>

				{item.type === 'blur' && (
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'blur')}
						singularId={'blur'}
						label={__('Blur', 'blockera-core')}
						labelPopoverTitle={__('Blur Filter', 'blockera-core')}
						labelDescription={
							<>
								<p>
									{__(
										'The Blur filter applies a Gaussian blur for softening the details and creating a hazy effect.',
										'blockera-core'
									)}
								</p>
								<p>
									{__(
										'Please note heavy use of blur, especially with large radii, can impact performance, particularly on less powerful devices or browsers.',
										'blockera-core'
									)}
								</p>
							</>
						}
						columns="columns-2"
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
						defaultValue={defaultRepeaterItemValue.blur}
						data-test="filter-blur-input"
					/>
				)}

				{item.type === 'drop-shadow' && (
					<>
						<InputControl
							repeaterItem={itemId}
							id={getControlId(itemId, 'drop-shadow-x')}
							singularId={'drop-shadow-x'}
							label={<XCoordinateIcon />}
							labelPopoverTitle={__(
								'Shadow Horizontal Offset',
								'blockera-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the horizontal offset of the drop shadow.',
											'blockera-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
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
							defaultValue={
								defaultRepeaterItemValue['drop-shadow-x']
							}
							data-test="filter-drop-shadow-x-input"
						/>

						<InputControl
							repeaterItem={itemId}
							id={getControlId(itemId, 'drop-shadow-y')}
							singularId={'drop-shadow-y'}
							label={<YCoordinateIcon />}
							labelPopoverTitle={__(
								'Shadow Vertical Offset',
								'blockera-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the vertical offset of the drop shadow.',
											'blockera-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
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
							defaultValue={
								defaultRepeaterItemValue['drop-shadow-y']
							}
							data-test="filter-drop-shadow-y-input"
						/>

						<InputControl
							repeaterItem={itemId}
							id={getControlId(itemId, 'drop-shadow-blur')}
							singularId={'drop-shadow-blur'}
							label={__('Blur', 'blockera-core')}
							labelPopoverTitle={__(
								'Shadow Blur',
								'blockera-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the blur amount of the drop shadow.',
											'blockera-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
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
							defaultValue={
								defaultRepeaterItemValue['drop-shadow-blur']
							}
							data-test="filter-drop-shadow-blur-input"
						/>

						<ColorControl
							repeaterItem={itemId}
							id={getControlId(itemId, 'drop-shadow-color')}
							singularId={'drop-shadow-color'}
							label={__('Color', 'blockera-core')}
							labelPopoverTitle={__(
								'Shadow Color',
								'blockera-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the color of the drop shadow.',
											'blockera-core'
										)}
									</p>
								</>
							}
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
							defaultValue={
								defaultRepeaterItemValue['drop-shadow-color']
							}
							data-test="filter-drop-shadow-color"
						/>
					</>
				)}

				{item.type === 'brightness' && (
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'brightness')}
						singularId={'brightness'}
						label={__('Brightness', 'blockera-core')}
						labelPopoverTitle={__(
							'Brightness Filter',
							'blockera-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It adjusts the brightness of the block.',
										'blockera-core'
									)}
								</p>
								<p>
									{__(
										'It can lighten or darken block by applying a percentage value, where 100% is the original brightness.',
										'blockera-core'
									)}
								</p>
								<p>
									{__(
										'It is very useful to changes the color of buttons or links on hover or focus dynamically without setting exact color.',
										'blockera-core'
									)}
								</p>
							</>
						}
						columns="columns-2"
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
						defaultValue={defaultRepeaterItemValue.brightness}
						data-test="filter-brightness-input"
					/>
				)}

				{item.type === 'contrast' && (
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'contrast')}
						singularId={'contrast'}
						label={__('Contrast', 'blockera-core')}
						labelPopoverTitle={__(
							'Contrast Filter',
							'blockera-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It adjusts the contrast of the block.',
										'blockera-core'
									)}
								</p>
								<p>
									{__(
										'It alters the difference in color and brightness between different parts of the block, making the dark parts darker and the light parts lighter.',
										'blockera-core'
									)}
								</p>
							</>
						}
						columns="columns-2"
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
						defaultValue={defaultRepeaterItemValue.contrast}
						data-test="filter-contrast-input"
					/>
				)}

				{item.type === 'hue-rotate' && (
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'hue-rotate')}
						singularId={'hue-rotate'}
						label={__('Hue Rotate', 'blockera-core')}
						labelPopoverTitle={__(
							'Contrast Filter',
							'blockera-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It applies a hue shift to the colors of block.',
										'blockera-core'
									)}
								</p>
								<p>
									{__(
										'It can drastically or subtly change the color scheme of block without affecting the luminance or saturation.',
										'blockera-core'
									)}
								</p>
							</>
						}
						columns="columns-2"
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
						defaultValue={defaultRepeaterItemValue['hue-rotate']}
						data-test="filter-hue-rotate-input"
					/>
				)}

				{item.type === 'saturate' && (
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'saturate')}
						singularId={'saturate'}
						label={__('Saturation', 'blockera-core')}
						labelPopoverTitle={__(
							'Saturation Filter',
							'blockera-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It adjusts the saturation level of block.',
										'blockera-core'
									)}
								</p>
								<p>
									{__(
										'It controls the intensity of the colors, either enhancing them for a more vivid appearance or diminishing them for a more muted look.',
										'blockera-core'
									)}
								</p>
							</>
						}
						columns="columns-2"
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
						defaultValue={defaultRepeaterItemValue.saturate}
						data-test="filter-saturate-input"
					/>
				)}

				{item.type === 'grayscale' && (
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'grayscale')}
						singularId={'grayscale'}
						label={__('Grayscale', 'blockera-core')}
						labelPopoverTitle={__(
							'Grayscale Filter',
							'blockera-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It converts the colors of a block to shades of gray.',
										'blockera-core'
									)}
								</p>
								<p>
									{__(
										'It is often used for creating a muted or classic look, for emphasizing or de-emphasizing blocks, and for interactive effects like hover states.',
										'blockera-core'
									)}
								</p>
							</>
						}
						columns="columns-2"
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
						defaultValue={defaultRepeaterItemValue.grayscale}
						data-test="filter-grayscale-input"
					/>
				)}

				{item.type === 'invert' && (
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'invert')}
						singularId={'invert'}
						label={__('Invert', 'blockera-core')}
						labelPopoverTitle={__('Invert Filter', 'blockera-core')}
						labelDescription={
							<>
								<p>
									{__(
										'It inverts the colors of a block by swapping each color with its opposite on the color wheel, creating a negative effect.',
										'blockera-core'
									)}
								</p>
								<p>
									{__(
										"Invert is used to create striking visual effects, draw attention, or for accessibility purposes (like a 'dark mode' effect).",
										'blockera-core'
									)}
								</p>
							</>
						}
						columns="columns-2"
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
						defaultValue={defaultRepeaterItemValue.invert}
						data-test="filter-invert-input"
					/>
				)}

				{item.type === 'sepia' && (
					<InputControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'sepia')}
						singularId={'sepia'}
						label={__('Sepia', 'blockera-core')}
						labelPopoverTitle={__('Sepia Filter', 'blockera-core')}
						labelDescription={
							<>
								<p>
									{__(
										'It applies a warm, brownish tone to block, mimicking the look of sepia-toned photographs.',
										'blockera-core'
									)}
								</p>
							</>
						}
						columns="columns-2"
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
						defaultValue={defaultRepeaterItemValue.sepia}
						data-test="filter-sepia-input"
					/>
				)}
			</div>
		);
	}
);

export default Fields;
