// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';
import type { Element } from 'react';

/**
 * External dependencies
 */
import { Icon } from '@blockera/icons';

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

		const {
			onChange,
			valueCleanup,
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
					label={__('Type', 'blockera')}
					labelPopoverTitle={labelPopoverTitle}
					labelDescription={labelDescription}
					columns="columns-2"
					options={getTypeOptions()}
					onChange={(type, ref) =>
						changeRepeaterItem({
							ref,
							controlId,
							repeaterId,
							itemId,
							onChange,
							valueCleanup,
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
						label={__('Blur', 'blockera')}
						labelPopoverTitle={__('Blur Filter', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'The Blur filter applies a Gaussian blur for softening the details and creating a hazy effect.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'Please note heavy use of blur, especially with large radii, can impact performance, particularly on less powerful devices or browsers.',
										'blockera'
									)}
								</p>
							</>
						}
						columns="columns-2"
						unitType="essential"
						range={true}
						min={0}
						max={50}
						onChange={(blur, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
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
							label={<Icon icon="coordinate-x" iconSize="18" />}
							labelPopoverTitle={__(
								'Shadow Horizontal Offset',
								'blockera'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the horizontal offset of the drop shadow.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="columns-2"
							unitType="essential"
							range={true}
							min={-100}
							max={100}
							onChange={(newValue, ref) =>
								changeRepeaterItem({
									ref,
									controlId,
									repeaterId,
									itemId,
									onChange,
									valueCleanup,
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
							label={<Icon icon="coordinate-y" iconSize="18" />}
							labelPopoverTitle={__(
								'Shadow Vertical Offset',
								'blockera'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the vertical offset of the drop shadow.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="columns-2"
							unitType="essential"
							range={true}
							min={-100}
							max={100}
							onChange={(newValue, ref) =>
								changeRepeaterItem({
									ref,
									controlId,
									repeaterId,
									itemId,
									onChange,
									valueCleanup,
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
							label={__('Blur', 'blockera')}
							labelPopoverTitle={__('Shadow Blur', 'blockera')}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the blur amount of the drop shadow.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="columns-2"
							unitType="essential"
							range={true}
							min={0}
							max={100}
							onChange={(newValue, ref) =>
								changeRepeaterItem({
									ref,
									controlId,
									repeaterId,
									itemId,
									onChange,
									valueCleanup,
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
							label={__('Color', 'blockera')}
							labelPopoverTitle={__('Shadow Color', 'blockera')}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the color of the drop shadow.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="columns-2"
							onChange={(newValue, ref) =>
								changeRepeaterItem({
									ref,
									controlId,
									repeaterId,
									itemId,
									onChange,
									valueCleanup,
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
						label={__('Brightness', 'blockera')}
						labelPopoverTitle={__('Brightness Filter', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It adjusts the brightness of the block.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'It can lighten or darken block by applying a percentage value, where 100% is the original brightness.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'It is very useful to changes the color of buttons or links on hover or focus dynamically without setting exact color.',
										'blockera'
									)}
								</p>
							</>
						}
						columns="columns-2"
						unitType="percent"
						range={true}
						min={0}
						max={200}
						onChange={(brightness, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
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
						label={__('Contrast', 'blockera')}
						labelPopoverTitle={__('Contrast Filter', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It adjusts the contrast of the block.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'It alters the difference in color and brightness between different parts of the block, making the dark parts darker and the light parts lighter.',
										'blockera'
									)}
								</p>
							</>
						}
						columns="columns-2"
						unitType="percent"
						range={true}
						min={0}
						max={200}
						onChange={(contrast, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
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
						label={__('Hue Rotate', 'blockera')}
						labelPopoverTitle={__('Contrast Filter', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It applies a hue shift to the colors of block.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'It can drastically or subtly change the color scheme of block without affecting the luminance or saturation.',
										'blockera'
									)}
								</p>
							</>
						}
						columns="columns-2"
						unitType="angle"
						range={true}
						min={-365}
						max={365}
						onChange={(newValue, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
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
						label={__('Saturation', 'blockera')}
						labelPopoverTitle={__('Saturation Filter', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It adjusts the saturation level of block.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'It controls the intensity of the colors, either enhancing them for a more vivid appearance or diminishing them for a more muted look.',
										'blockera'
									)}
								</p>
							</>
						}
						columns="columns-2"
						unitType="percent"
						range={true}
						min={0}
						max={200}
						onChange={(saturate, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
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
						label={__('Grayscale', 'blockera')}
						labelPopoverTitle={__('Grayscale Filter', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It converts the colors of a block to shades of gray.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'It is often used for creating a muted or classic look, for emphasizing or de-emphasizing blocks, and for interactive effects like hover states.',
										'blockera'
									)}
								</p>
							</>
						}
						columns="columns-2"
						unitType="percent"
						range={true}
						min={0}
						max={100}
						onChange={(grayscale, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
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
						label={__('Invert', 'blockera')}
						labelPopoverTitle={__('Invert Filter', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It inverts the colors of a block by swapping each color with its opposite on the color wheel, creating a negative effect.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										"Invert is used to create striking visual effects, draw attention, or for accessibility purposes (like a 'dark mode' effect).",
										'blockera'
									)}
								</p>
							</>
						}
						columns="columns-2"
						unitType="percent"
						range={true}
						min={0}
						max={100}
						onChange={(invert, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
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
						label={__('Sepia', 'blockera')}
						labelPopoverTitle={__('Sepia Filter', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It applies a warm, brownish tone to block, mimicking the look of sepia-toned photographs.',
										'blockera'
									)}
								</p>
							</>
						}
						columns="columns-2"
						unitType="percent"
						range={true}
						min={0}
						max={100}
						onChange={(sepia, ref) =>
							changeRepeaterItem({
								ref,
								controlId,
								repeaterId,
								itemId,
								onChange,
								valueCleanup,
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
