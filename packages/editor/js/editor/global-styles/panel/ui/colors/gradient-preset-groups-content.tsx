/**
 * External dependencies
 */
import { __experimentalVStack as VStack } from '@wordpress/components';
import type { Gradient } from '@wordpress/global-styles-engine';

/**
 * Internal dependencies
 */
import {
	areGradientPresetListsEqual,
	filterLinearGradients,
	filterRadialGradients,
} from './utils';
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

	return (
		<VStack spacing={8} className="global-styles-ui-gradient-palette-panel">
			{!!kindTheme.length && (
				<GradientPresetGroup
					variant={variant}
					origin="theme"
					gradients={kindTheme}
					themeGradients={themeGradients}
					defaultGradients={defaultGradients}
					customGradients={customGradients}
					setThemeGradients={setThemeGradients}
					setDefaultGradients={setDefaultGradients}
					setCustomGradients={setCustomGradients}
					handleResetGradients={
						areGradientPresetListsEqual(kindTheme, baseKindTheme)
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

			{!!kindDefault.length && !!defaultGradientsEnabled && (
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
						areGradientPresetListsEqual(
							kindDefault,
							baseKindDefault
						)
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
		</VStack>
	);
}
