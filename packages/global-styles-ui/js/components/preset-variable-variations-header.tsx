/**
 * External dependencies
 */
import type { ReactNode } from 'react';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import {
	componentInnerClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';

export type PresetVariableVariationsHeaderProps = {
	/** Single swatch / icon (accordion expanded or non-stack rows). Omit or pass null to hide (no wrapper). */
	icon?: ReactNode | null;
	/** The label for the header. */
	label: ReactNode;
	/**
	 * When true, this row is already a child variation (e.g. a color shade), not the
	 * base preset that owns the variation set.
	 */
	isVariationChildRow: boolean;
	/** Count of variations for this base (use 0 for child rows). */
	variationCount: number;
	/** Whether the variations accordion is open. */
	variationsAccordionOpen: boolean;
	/** Variable picker / palette popover active — enables the preset variations strip UI. */
	isVariablePickerActive: boolean;
	/**
	 * Compact stack preview when variations exist, editor is not in variable-picker mode,
	 * and the variations accordion is collapsed (e.g. color shade stack header).
	 */
	collapsedVariationStack: ReactNode;
	/**
	 * Inline strip rendered inside `.blockera-component-preset-variable-variations-strip` when the picker is active and
	 * the variations accordion is collapsed.
	 */
	variablePickerVariationStrip: ReactNode;
};

export function getPresetVariableVariationsDerivedState(params: {
	isVariationChildRow: boolean;
	variationCount: number;
	isVariablePickerActive: boolean;
}): {
	showVariationStack: boolean;
	isVariableVariationsPickerHeader: boolean;
} {
	const showVariationStack =
		!params.isVariationChildRow && params.variationCount > 0;
	return {
		showVariationStack,
		isVariableVariationsPickerHeader:
			true === params.isVariablePickerActive && showVariationStack,
	};
}

/**
 * Shared repeater-header body for presets that expose a variation ramp (aliases: shades,
 * preset-variable-variations) — accordion, variable-picker column/row layout, and the inline
 * variation strip classname contract.
 */
export function PresetVariableVariationsHeader({
	icon,
	label,
	variationCount,
	isVariationChildRow,
	isVariablePickerActive,
	variationsAccordionOpen,
	collapsedVariationStack,
	variablePickerVariationStrip,
}: PresetVariableVariationsHeaderProps) {
	const showVariationStack = !isVariationChildRow && variationCount > 0;
	const headerIcon =
		icon !== undefined && icon !== null ? (
			<span
				className={controlInnerClassNames('header-icon')}
				data-cy="header-icon"
			>
				{icon}
			</span>
		) : null;

	if (!showVariationStack) {
		return (
			<>
				{headerIcon}
				<span
					className={controlInnerClassNames('header-label')}
					data-cy="header-label"
				>
					{label}
				</span>
			</>
		);
	}

	return (
		<>
			{!isVariablePickerActive && (
				<>
					{!variationsAccordionOpen && collapsedVariationStack}
					{variationsAccordionOpen ? headerIcon : null}
					<span
						className={controlInnerClassNames('header-label')}
						data-cy="header-label"
					>
						{label}
					</span>
				</>
			)}
			{true === isVariablePickerActive && (
				<Flex direction={variationsAccordionOpen ? 'row' : 'column'}>
					<Flex gap={8}>
						{headerIcon}

						<span
							className={controlInnerClassNames('header-label')}
							data-cy="header-label"
						>
							{label}
						</span>
					</Flex>
					{!variationsAccordionOpen && (
						<Flex
							gap={2}
							className={componentInnerClassNames(
								'preset-variable-variations-strip'
							)}
						>
							{variablePickerVariationStrip}
						</Flex>
					)}
				</Flex>
			)}
		</>
	);
}
