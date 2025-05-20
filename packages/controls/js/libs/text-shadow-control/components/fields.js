/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../../context';
import { RepeaterContext } from '../../repeater-control/context';
import { ColorControl, InputControl } from '../../index';

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const {
		onChange,
		valueCleanup,
		repeaterId,
		getControlId,
		defaultRepeaterItemValue,
	} = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<InputControl
				repeaterItem={itemId}
				singularId={'x'}
				id={getControlId(itemId, 'x')}
				defaultValue={defaultRepeaterItemValue.x}
				label={<Icon icon="coordinate-x" />}
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
				onChange={(x, ref) =>
					changeRepeaterItem({
						ref,
						controlId,
						repeaterId,
						itemId,
						onChange,
						valueCleanup,
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
				label={<Icon icon="coordinate-y" />}
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
				onChange={(y, ref) =>
					changeRepeaterItem({
						ref,
						controlId,
						repeaterId,
						itemId,
						onChange,
						valueCleanup,
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
				onChange={(color, ref) =>
					changeRepeaterItem({
						ref,
						controlId,
						repeaterId,
						itemId,
						onChange,
						valueCleanup,
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
