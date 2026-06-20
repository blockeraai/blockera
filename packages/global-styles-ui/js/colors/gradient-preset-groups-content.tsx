/**
 * External dependencies
 */
import type { Gradient } from '@wordpress/global-styles-engine';
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex, PRESET_VARIABLES_SECTION_GAP } from '@blockera/controls';
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	shouldShowDefaultPresetGroup,
	shouldShowThemePresetGroup,
	PresetVariablesScreenToolbar,
	buildVisiblePresetOriginSets,
} from '../components';
import { filterLinearGradients, filterRadialGradients } from './utils';
import {
	GradientPresetGroup,
	type GradientPresetVariant,
} from './gradient-preset-group';

export type GradientPresetGroupsHookState = {
	themeGradients: Gradient[] | undefined;
	customGradients: Gradient[];
	defaultGradients: Gradient[] | undefined;
	setThemeGradients: (g: Gradient[]) => void;
	setCustomGradients: (g: Gradient[]) => void;
	setDefaultGradients: (g: Gradient[]) => void;
	baseThemeGradients: Gradient[] | undefined;
	baseDefaultGradients: Gradient[] | undefined;
	defaultGradientsEnabled: boolean;
};

type GradientPresetGroupsContentProps = {
	variant: GradientPresetVariant;
} & GradientPresetGroupsHookState;

export function GradientPresetGroupsContent({
	variant,
	themeGradients,
	customGradients,
	defaultGradients,
	setThemeGradients,
	setCustomGradients,
	setDefaultGradients,
	baseThemeGradients,
	baseDefaultGradients,
	defaultGradientsEnabled,
}: GradientPresetGroupsContentProps) {
	const filterKind =
		variant === 'linear' ? filterLinearGradients : filterRadialGradients;
	const filterOpposite =
		variant === 'linear' ? filterRadialGradients : filterLinearGradients;

	const kindTheme = filterKind(themeGradients);
	const kindCustom = filterKind(customGradients);
	const kindDefault = filterKind(defaultGradients);
	const baseKindTheme = filterKind(baseThemeGradients);
	const baseKindDefault = filterKind(baseDefaultGradients);

	const showDefaultOriginGroup = shouldShowDefaultPresetGroup(
		defaultGradientsEnabled,
		kindTheme.length,
		kindDefault.length
	);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		defaultGradientsEnabled,
		kindTheme.length,
		kindDefault.length
	);

	const originSets = useMemo(
		() =>
			buildVisiblePresetOriginSets({
				showThemeOriginGroup,
				showDefaultOriginGroup,
				themeItems: kindTheme as Array<
					Gradient & Record<string, unknown>
				>,
				themeBaseItems: baseKindTheme as Array<
					Gradient & Record<string, unknown>
				>,
				defaultItems: kindDefault as Array<
					Gradient & Record<string, unknown>
				>,
				defaultBaseItems: baseKindDefault as Array<
					Gradient & Record<string, unknown>
				>,
				customItems: kindCustom as Array<
					Gradient & Record<string, unknown>
				>,
			}),
		[
			showThemeOriginGroup,
			showDefaultOriginGroup,
			kindTheme,
			baseKindTheme,
			kindDefault,
			baseKindDefault,
			kindCustom,
		]
	);

	return (
		<>
			<PresetVariablesScreenToolbar
				originSets={originSets}
				withSummaryRowPadding
			/>
			<Flex
				direction="column"
				gap={PRESET_VARIABLES_SECTION_GAP}
				className="global-styles-ui-gradient-palette-panel"
			>
				{showThemeOriginGroup && (
					<GradientPresetGroup
						variant={variant}
						origin="theme"
						gradients={kindTheme}
						baseGradients={baseKindTheme}
						themeGradients={themeGradients}
						defaultGradients={defaultGradients}
						customGradients={customGradients}
						setThemeGradients={setThemeGradients}
						setDefaultGradients={setDefaultGradients}
						setCustomGradients={setCustomGradients}
						handleResetGradients={
							isEquals(kindTheme, baseKindTheme)
								? undefined
								: () =>
										setThemeGradients(
											(variant === 'linear'
												? [
														...baseKindTheme,
														...filterRadialGradients(
															themeGradients
														),
													]
												: [
														...filterLinearGradients(
															themeGradients
														),
														...baseKindTheme,
													]) as Gradient[]
										)
						}
					/>
				)}

				{showDefaultOriginGroup && (
					<GradientPresetGroup
						variant={variant}
						origin="default"
						gradients={kindDefault}
						themeGradients={themeGradients}
						defaultGradients={defaultGradients}
						customGradients={customGradients}
						setThemeGradients={setThemeGradients}
						setDefaultGradients={setDefaultGradients}
						setCustomGradients={setCustomGradients}
						handleResetGradients={
							isEquals(kindDefault, baseKindDefault)
								? undefined
								: () =>
										setDefaultGradients(
											(variant === 'linear'
												? [
														...baseKindDefault,
														...filterRadialGradients(
															defaultGradients
														),
													]
												: [
														...filterLinearGradients(
															defaultGradients
														),
														...baseKindDefault,
													]) as Gradient[]
										)
						}
					/>
				)}

				<GradientPresetGroup
					variant={variant}
					origin="custom"
					gradients={kindCustom}
					themeGradients={themeGradients}
					defaultGradients={defaultGradients}
					customGradients={customGradients}
					setThemeGradients={setThemeGradients}
					setDefaultGradients={setDefaultGradients}
					setCustomGradients={setCustomGradients}
					handleResetGradients={
						kindCustom.length > 0
							? () =>
									setCustomGradients([
										...filterOpposite(customGradients),
									] as Gradient[])
							: undefined
					}
				/>
			</Flex>
		</>
	);
}
