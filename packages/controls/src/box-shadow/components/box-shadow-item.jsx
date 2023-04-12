/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	TextControl,
	ColorPalette,
	ColorIndicator,
	ToggleControl,
	__experimentalPaletteEdit as PaletteEdit,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { PanelTab } from '@publisher/components';

export default function BoxShadowItem({
	i,
	n,
	setState,
	parentState: {
		x,
		y,
		blur,
		color,
		inset,
		spread,
	},
	parentProps: {
		group,
		toggleVisibility,
		removeGroup,
		attributes,
		setAttributes,
		changeValue,
		changeVisibility,
		index,
	}
}) {
	const colors = [
		{ name: 'red', color: '#f00' },
		{ name: 'white', color: '#fff' },
		{ name: 'blue', color: '#00f' },
	];
	return (
		<PanelTab
			label={
				<>
					<ColorIndicator colorValue={color} />
					{`${x}px ${y}px ${blur}px ${spread}px`}
				</>
			}
			onDelete={() => removeGroup(index)}
			key={`repeater-panel-${index}_${n}`}
		>
			<Fragment key={`${index}_${n}`}>
				<BaseControl
					id={`p-blocks-repeater-item-${index}-${n}`}
				>
					<VStack>
						<HStack justify="space-between">
							<TextControl
								label={__('X', 'publisher-blocks')}
								value={x}
								onChange={(value) =>
									setState({ x: value })
								}
							/>
							<TextControl
								label={__('Y', 'publisher-blocks')}
								value={y}
								onChange={(value) =>
									setState({ y: value })
								}
							/>
						</HStack>
						<HStack justify="space-between">
							<TextControl
								label={__('BLUR', 'publisher-blocks')}
								value={blur}
								onChange={(value) =>
									setState({ blur: value })
								}
							/>
							<TextControl
								label={__('SPREAD', 'publisher-blocks')}
								value={spread}
								onChange={(value) =>
									setState({ spread: value })
								}
							/>
						</HStack>
						<ColorPalette
							colors={colors}
							value={color}
							onChange={(color) =>
								setState({ color: color })
							}
						/>
						<ToggleControl
							label={__('Inset', 'publisher-blocks')}
							help=""
							checked={inset}
							onChange={() => {
								setState({
									inset: !inset,
								});
							}}
						/>
					</VStack>
				</BaseControl>
			</Fragment>
		</PanelTab>
	);
}
