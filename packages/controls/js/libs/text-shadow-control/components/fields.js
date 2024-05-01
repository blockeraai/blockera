/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { RepeaterContext } from '../../repeater-control/context';
import { ColorControl, InputControl } from '../../index';
import XCoordinateIcon from '../icons/coordinate-x';
import YCoordinateIcon from '../icons/coordinate-y';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { repeaterId, getControlId, defaultRepeaterItemValue } =
		useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<InputControl
				repeaterItem={itemId}
				singularId={'x'}
				id={getControlId(itemId, 'x')}
				defaultValue={defaultRepeaterItemValue.x}
				controlName="input"
				label={<XCoordinateIcon />}
				labelPopoverTitle={__('Horizontal Offset (X)', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'The horizontal (X) offset adds a shadow to text with a specified distance to the right or left.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Use it for creating a horizontal depth effect that enhances text visibility and style.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="columns-2"
				unitType="text-shadow"
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
				aria-label={__('Vertical Distance', 'blockera')}
			/>

			<InputControl
				repeaterItem={itemId}
				singularId={'y'}
				id={getControlId(itemId, 'y')}
				defaultValue={defaultRepeaterItemValue.y}
				controlName="input"
				label={<YCoordinateIcon />}
				labelPopoverTitle={__('Vertical Offset (Y)', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'The vertical (X) offset adds a shadow to text with a specified distance to the top or bottom.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Use it for creating a horizontal depth effect that enhances text visibility and style.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="columns-2"
				unitType="text-shadow"
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
				aria-label={__('Horizontal Distance', 'blockera')}
			/>

			<InputControl
				repeaterItem={itemId}
				singularId={'blur'}
				id={getControlId(itemId, 'blur')}
				defaultValue={defaultRepeaterItemValue.blur}
				controlName="input"
				label={__('Blur', 'blockera')}
				labelPopoverTitle={__('Blur Effect', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'The blur radius adds a soft, diffused shadow to text, enhancing its visual appeal.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'A blurred shadow effect is crucial for adding depth and emphasis to text while maintaining readability, ideal for titles, banners, and other key text blocks in web design.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="columns-2"
				unitType="text-shadow"
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
				aria-label={__('Blur Effect', 'blockera')}
			/>

			<ColorControl
				repeaterItem={itemId}
				singularId={'color'}
				id={getControlId(itemId, 'color')}
				defaultValue={defaultRepeaterItemValue.color}
				label={__('Color', 'blockera')}
				labelPopoverTitle={__('Shadow Color', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It adds a colored shadow to text, enhancing visual interest and emphasis.',
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
				aria-label={__('Shadow Color', 'blockera')}
				controlAddonTypes={['variable']}
				variableTypes={['color']}
			/>
		</div>
	);
};

export default memo(Fields);
