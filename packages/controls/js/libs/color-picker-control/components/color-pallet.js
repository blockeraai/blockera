// @flow
/**
 * External dependencies
 */
import SketchPicker from 'react-color/lib/Sketch';
import type { MixedElement } from 'react';
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { ColorPalletProps } from '../types';
import {
	getSketchPickerColor,
	reactColorStateToStorageString,
} from '../utils/css-color';

export const ColorPallet = ({
	className,
	enableAlpha = false,
	disabled = false,
	color,
	onChangeComplete,
}: ColorPalletProps): MixedElement => {
	// Stable reference: SketchPicker deep-merges styles; a new object each render
	// forces redundant work inside react-color.
	const sketchStyles = useMemo(
		() => ({
			default: {
				picker: {
					boxShadow: 'none',
					borderRadius: '2px',
				},
				saturation: {
					borderRadius: '2px',
					overflow: 'hidden',
					// Sketch default is paddingBottom 75% (aspect-ratio box); lower = shorter panel.
					paddingBottom: '60%',
				},
				hue: {
					height: '12px',
				},
				alpha: {
					height: '12px',
				},
				color: {
					width: '28px',
					height: '28px',
					border: 'none',
					boxSizing: 'border-box',
				},
			},
		}),
		[]
	);

	return (
		<div
			className={controlInnerClassNames('color-pallet', className)}
			tabIndex={-1}
			// Focus wrapper before picker interaction so focus-outside sees an in-popover target.
			onPointerDownCapture={(e) => {
				if (disabled) {
					return;
				}
				const el = e.currentTarget;
				if (el instanceof HTMLElement) {
					el.focus({ preventScroll: true });
				}
			}}
		>
			<div
				className={
					disabled
						? 'blockera-color-pallet__sketch-wrap blockera-color-pallet__sketch-wrap--disabled'
						: 'blockera-color-pallet__sketch-wrap'
				}
				aria-disabled={disabled ? true : undefined}
				aria-hidden={disabled ? true : undefined}
			>
				<SketchPicker
					className="blockera-react-color-sketch"
					color={getSketchPickerColor(color)}
					disableAlpha={!enableAlpha}
					presetColors={[]}
					width="100%"
					onChange={(next: Object) => {
						if (disabled) {
							return;
						}
						onChangeComplete(
							reactColorStateToStorageString(next, enableAlpha)
						);
					}}
					styles={sketchStyles}
				/>
			</div>
		</div>
	);
};
