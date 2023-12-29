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
					label={__('Position', 'publisher-core')}
					labelPopoverTitle={__('Shadow Position', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Outer shadow creates a raised look, ideal for interactive elements.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'Inner shadow creates a carved-in effect, suitable for subtle depth.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					options={[
						{
							label: __('Outer', 'publisher-core'),
							value: 'outer',
						},
						{
							label: __('Inner', 'publisher-core'),
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
					label={__('X', 'publisher-core')}
					labelPopoverTitle={__(
						'Horizontal Offset',
						'publisher-core'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'Adjusts the horizontal position of block shadow. Positive values move the shadow right, negative left.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'This adds a sense of realism and can highlight the directional flow in design.',
									'publisher-core'
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
					label={__('Y', 'publisher-core')}
					labelPopoverTitle={__('Vertical Offset', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Adjusts the vertical position of block shadow. Positive values shift the shadow downward, negative upward.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'This adds a sense of realism and can highlight the directional flow in design.',
									'publisher-core'
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
					label={__('Blur', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Soften or sharpen shadows to adjust the focus and depth effect on your design elements.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'Increase blur for a softer, diffused shadow, enhancing a subtle, elegant look. Decrease it for sharper, more pronounced shadows, creating a distinct sense of depth and emphasis.',
									'publisher-core'
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
					label={__('Spread', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Adjust the extent of shadow to enhance or reduce the area of visual impact around elements.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'Increasing the spread enlarges the shadow for a bolder effect, useful for dramatic emphasis. Decreasing it creates a tighter, more contained shadow, suitable for subtle depth and refinement.',
									'publisher-core'
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
					label={__('Color', 'publisher-core')}
					labelPopoverTitle={__('Shadow Color', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Customize shadow hues to complement or contrast your design, adding a creative touch to elements.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'Darker shades create a subtle, classic look, while vibrant colors can add excitement and draw attention.',
									'publisher-core'
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
