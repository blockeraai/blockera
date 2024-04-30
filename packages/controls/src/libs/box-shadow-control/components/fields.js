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
import { RepeaterContext } from '../../repeater-control/context';
import { ColorControl, InputControl, ToggleSelectControl } from '../../index';
import { useControlContext } from '../../../context';
import type { TFieldItem } from '../types';
import XCoordinateIcon from '../icons/coordinate-x';
import YCoordinateIcon from '../icons/coordinate-y';

const Fields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();

		const { repeaterId, getControlId, defaultRepeaterItemValue } =
			useContext(RepeaterContext);

		return (
			<div id={`repeater-item-${itemId}`}>
				<ToggleSelectControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'type')}
					singularId={'type'}
					label={__('Position', 'blockera')}
					labelPopoverTitle={__('Shadow Position', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Outer shadow creates a raised look, ideal for interactive elements.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Inner shadow creates a carved-in effect, suitable for subtle depth.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="columns-2"
					options={[
						{
							label: __('Outer', 'blockera'),
							value: 'outer',
						},
						{
							label: __('Inner', 'blockera'),
							value: 'inner',
						},
					]}
					onChange={(type) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, type },
						})
					}
					data-test="box-shadow-type-select"
					defaultValue={defaultRepeaterItemValue.type}
				/>

				<InputControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'x')}
					singularId={'x'}
					label={<XCoordinateIcon />}
					labelPopoverTitle={__('Horizontal Offset', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Adjusts the horizontal position of block shadow. Positive values move the shadow right, negative left.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'This adds a sense of realism and can highlight the directional flow in design.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="box-shadow"
					range={true}
					min={-100}
					max={100}
					onChange={(x) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, x },
						})
					}
					data-test="box-shadow-x-input"
					defaultValue={defaultRepeaterItemValue.x}
				/>

				<InputControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'y')}
					singularId={'y'}
					label={<YCoordinateIcon />}
					labelPopoverTitle={__('Vertical Offset', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Adjusts the vertical position of block shadow. Positive values shift the shadow downward, negative upward.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'This adds a sense of realism and can highlight the directional flow in design.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="box-shadow"
					range={true}
					min={-100}
					max={100}
					onChange={(y) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, y },
						})
					}
					data-test="box-shadow-y-input"
					defaultValue={defaultRepeaterItemValue.y}
				/>

				<InputControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'blur')}
					singularId={'blur'}
					label={__('Blur', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Soften or sharpen shadows to adjust the focus and depth effect on your design elements.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Increase blur for a softer, diffused shadow, enhancing a subtle, elegant look. Decrease it for sharper, more pronounced shadows, creating a distinct sense of depth and emphasis.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="box-shadow"
					range={true}
					min={0}
					max={100}
					onChange={(blur) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, blur },
						})
					}
					data-test="box-shadow-blur-input"
					defaultValue={defaultRepeaterItemValue.blur}
				/>

				<InputControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'spread')}
					singularId={'spread'}
					label={__('Spread', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Adjust the extent of shadow to enhance or reduce the area of visual impact around elements.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Increasing the spread enlarges the shadow for a bolder effect, useful for dramatic emphasis. Decreasing it creates a tighter, more contained shadow, suitable for subtle depth and refinement.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="box-shadow"
					range={true}
					min={-100}
					max={100}
					onChange={(spread) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, spread },
						})
					}
					data-test="box-shadow-spread-input"
					defaultValue={defaultRepeaterItemValue.spread}
				/>

				<ColorControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'color')}
					singularId={'color'}
					label={__('Color', 'blockera')}
					labelPopoverTitle={__('Shadow Color', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Customize shadow hues to complement or contrast your design, adding a creative touch to elements.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Darker shades create a subtle, classic look, while vibrant colors can add excitement and draw attention.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="columns-2"
					onChange={(color) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, color },
						})
					}
					data-test="box-shadow-color-control"
					defaultValue={defaultRepeaterItemValue.color}
					controlAddonTypes={['variable']}
					variableTypes={['color']}
				/>
			</div>
		);
	}
);
export default Fields;
