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
				labelPopoverTitle={__(
					'Horizontal Offset (X)',
					'publisher-core'
				)}
				labelDescription={
					<>
						<p>
							{__(
								'The horizontal (X) offset adds a shadow to text with a specified distance to the right or left.',
								'publisher-core'
							)}
						</p>
						<p>
							{__(
								'Use it for creating a horizontal depth effect that enhances text visibility and style.',
								'publisher-core'
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
				aria-label={__('Vertical Distance', 'publisher-core')}
			/>

			<InputControl
				repeaterItem={itemId}
				singularId={'y'}
				id={getControlId(itemId, 'y')}
				defaultValue={defaultRepeaterItemValue.y}
				controlName="input"
				label={<YCoordinateIcon />}
				labelPopoverTitle={__('Vertical Offset (Y)', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'The vertical (X) offset adds a shadow to text with a specified distance to the top or bottom.',
								'publisher-core'
							)}
						</p>
						<p>
							{__(
								'Use it for creating a horizontal depth effect that enhances text visibility and style.',
								'publisher-core'
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
				aria-label={__('Horizontal Distance', 'publisher-core')}
			/>

			<InputControl
				repeaterItem={itemId}
				singularId={'blur'}
				id={getControlId(itemId, 'blur')}
				defaultValue={defaultRepeaterItemValue.blur}
				controlName="input"
				label={__('Blur', 'publisher-core')}
				labelPopoverTitle={__('Blur Effect', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'The blur radius adds a soft, diffused shadow to text, enhancing its visual appeal.',
								'publisher-core'
							)}
						</p>
						<p>
							{__(
								'A blurred shadow effect is crucial for adding depth and emphasis to text while maintaining readability, ideal for titles, banners, and other key text blocks in web design.',
								'publisher-core'
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
				aria-label={__('Blur Effect', 'publisher-core')}
			/>

			<ColorControl
				repeaterItem={itemId}
				singularId={'color'}
				id={getControlId(itemId, 'color')}
				defaultValue={defaultRepeaterItemValue.color}
				label={__('Color', 'publisher-core')}
				labelPopoverTitle={__('Shadow Color', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It adds a colored shadow to text, enhancing visual interest and emphasis.',
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
				aria-label={__('Shadow Color', 'publisher-core')}
				controlAddonTypes={['variable']}
				variableTypes={['color']}
			/>
		</div>
	);
};

export default memo(Fields);
