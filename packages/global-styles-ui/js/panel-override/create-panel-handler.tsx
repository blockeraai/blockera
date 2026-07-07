/**
 * External dependencies
 */
import type { ComponentType } from 'react';

/**
 * Internal dependencies
 */
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';
import {
	addPresetOverrideBodyClass,
	navigateToGlobalStylesPath,
	type PresetPanelOverride,
} from './override-classes';
import { getGlobalStylesPanelSelectors } from './selectors';
import { getWordPressVersion } from './version';

export type GlobalStylesPanelHandlerOptions = {
	panel: PresetPanelOverride;
	wpNavigationPath: '/colors' | '/typography' | '/shadows';
	Component: ComponentType<{ screenSelector: string }>;
	componentSelector: string;
	whileNotExistSelectors: string[];
	observerLifetimeMs?: number;
	onObserverReady?: () => void;
};

/**
 * Factory for preset panel takeover handlers (colors, typography, shadows).
 * Centralizes navigation, body-class toggles, and DOM mount observation.
 */
export const createGlobalStylesPanelHandler = ({
	panel,
	wpNavigationPath,
	Component,
	componentSelector,
	whileNotExistSelectors,
	observerLifetimeMs,
	onObserverReady,
}: GlobalStylesPanelHandlerOptions) => {
	return (): void => {
		const selectors = getGlobalStylesPanelSelectors(getWordPressVersion());
		const bodyClass = addPresetOverrideBodyClass(panel);

		navigateToGlobalStylesPath(wpNavigationPath);

		const observer = new IntersectionObserverRenderer(
			selectors.navigatorScreen,
			() => <Component screenSelector={selectors.presetPanelMount} />,
			{
				targetElementIsRoot: true,
				whenBodyHasClassname: bodyClass,
				componentSelector,
				whileNotExistSelectors,
				callback: onObserverReady,
			}
		);

		if (observerLifetimeMs) {
			setTimeout(() => {
				observer.destroy();
			}, observerLifetimeMs);
		}
	};
};
