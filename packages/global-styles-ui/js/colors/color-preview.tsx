/**
 * External dependencies
 */
import type { CSSProperties } from 'react';

/**
 * Blockera dependencies
 */
import { ColorIndicator, ColorIndicatorStack } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { VariablePreview } from '../components/variable-preview';
import {
	COLOR_SHADE_STEPS,
	type ColorShadesMap,
} from './color-shades-generator';
import { paintPartFromStoredPaletteColorString } from './utils';

const PREVIEW_INDICATOR_SIZE = 18;
const PREVIEW_STACK_INDICATOR_SIZE = 22;
const PREVIEW_STACK_SPACE = -2;

export interface ColorPreviewProps {
	color?: string;
	paintType?: string;
	shadesEnabled?: boolean;
	stackMap?: ColorShadesMap;
}

function resolvePaintValue(stored: string | undefined): string {
	return paintPartFromStoredPaletteColorString(stored);
}

function buildPreviewStackValue(
	stackMap: ColorShadesMap
): Array<{ value: string; type: 'color' }> {
	// ColorIndicatorStack reverses internally; pre-reverse so LTR reads light → dark.
	return [...COLOR_SHADE_STEPS].reverse().map((step) => ({
		value: stackMap[String(step)] ?? '',
		type: 'color' as const,
	}));
}

function resolveIndicatorType(
	paintType: string | undefined
): 'color' | 'gradient' | 'image' {
	if (paintType === 'gradient' || paintType === 'image') {
		return paintType;
	}
	return 'color';
}

export default function ColorPreview({
	color,
	paintType,
	shadesEnabled = false,
	stackMap,
}: ColorPreviewProps) {
	const paintValue = resolvePaintValue(color);
	const indicatorType = resolveIndicatorType(paintType);

	const hasShadeStack =
		shadesEnabled &&
		stackMap !== undefined &&
		COLOR_SHADE_STEPS.some(
			(step) => String(stackMap[String(step)] ?? '').trim() !== ''
		);

	if (hasShadeStack && stackMap) {
		return (
			<VariablePreview type="color">
				<ColorIndicatorStack
					value={buildPreviewStackValue(stackMap)}
					size={PREVIEW_STACK_INDICATOR_SIZE}
					maxItems={COLOR_SHADE_STEPS.length}
					displayMode="centered"
					space={PREVIEW_STACK_SPACE}
				/>
			</VariablePreview>
		);
	}

	const simpleStyle: CSSProperties | undefined =
		indicatorType === 'color' ? undefined : { flexShrink: 0 };

	return (
		<VariablePreview type="color">
			<ColorIndicator
				value={paintValue}
				type={indicatorType}
				size={PREVIEW_INDICATOR_SIZE}
				style={simpleStyle}
			/>
		</VariablePreview>
	);
}
