/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';
import type { Gradient } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { useGlobalSetting } from '../context/global-style-hooks';

/**
 * Internal dependencies
 */
import { filterRadialGradients } from './utils';

export interface UseGetRadialGradientsReturn {
	radialGradients: Gradient[];
	themeGradients: Gradient[] | undefined;
	defaultGradients: Gradient[] | undefined;
	customGradients: Gradient[];
	baseThemeGradients: Gradient[] | undefined;
	baseDefaultGradients: Gradient[] | undefined;
	setThemeGradients: (gradients: Gradient[]) => void;
	setCustomGradients: (gradients: Gradient[]) => void;
	setDefaultGradients: (gradients: Gradient[]) => void;
	defaultGradientsEnabled: boolean;
}

export const useGetRadialGradients = (): UseGetRadialGradientsReturn => {
	const [themeGradients, setThemeGradients] = useGlobalSetting<
		Gradient[] | undefined
	>('color.gradients.theme');
	const [baseThemeGradients] = useGlobalSetting<Gradient[] | undefined>(
		'color.gradients.theme',
		'',
		'base'
	);
	const [defaultGradients, setDefaultGradients] = useGlobalSetting<
		Gradient[] | undefined
	>('color.gradients.default');
	const [baseDefaultGradients] = useGlobalSetting<Gradient[] | undefined>(
		'color.gradients.default',
		'',
		'base'
	);
	const [customGradients = [], setCustomGradients] = useGlobalSetting<
		Gradient[] | undefined
	>('color.gradients.custom');
	const [defaultGradientsEnabled = true] = useGlobalSetting<boolean>(
		'color.defaultGradients'
	);

	const radialThemeGradients = useMemo(
		() => filterRadialGradients(themeGradients),
		[themeGradients]
	);
	const radialDefaultGradients = useMemo(
		() => filterRadialGradients(defaultGradients),
		[defaultGradients]
	);
	const radialCustomGradients = useMemo(
		() => filterRadialGradients(customGradients),
		[customGradients]
	);

	const radialGradients = useMemo(
		() => [
			...radialCustomGradients,
			...radialThemeGradients,
			...(defaultGradientsEnabled ? radialDefaultGradients : []),
		],
		[
			radialCustomGradients,
			radialThemeGradients,
			radialDefaultGradients,
			defaultGradientsEnabled,
		]
	);

	return {
		radialGradients,
		themeGradients,
		defaultGradients,
		customGradients,
		baseThemeGradients,
		baseDefaultGradients,
		setThemeGradients,
		setCustomGradients,
		setDefaultGradients,
		defaultGradientsEnabled,
	};
};
