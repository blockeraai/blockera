/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';
import type { Gradient } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { useGlobalSetting } from '../../context/hooks';

/**
 * Internal dependencies
 */
import { filterLinearGradients } from './utils';

export interface UseGetLinearGradientsReturn {
	linearGradients: Gradient[];
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

export const useGetLinearGradients = (): UseGetLinearGradientsReturn => {
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

	const linearThemeGradients = useMemo(
		() => filterLinearGradients(themeGradients),
		[themeGradients]
	);
	const linearDefaultGradients = useMemo(
		() => filterLinearGradients(defaultGradients),
		[defaultGradients]
	);
	const linearCustomGradients = useMemo(
		() => filterLinearGradients(customGradients),
		[customGradients]
	);

	const linearGradients = useMemo(
		() => [
			...linearCustomGradients,
			...linearThemeGradients,
			...(defaultGradientsEnabled ? linearDefaultGradients : []),
		],
		[
			linearCustomGradients,
			linearThemeGradients,
			linearDefaultGradients,
			defaultGradientsEnabled,
		]
	);

	return {
		linearGradients,
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
