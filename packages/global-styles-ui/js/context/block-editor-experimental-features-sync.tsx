/**
 * External dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { useCallback, useEffect, useMemo, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useGlobalStylesContext } from './global-styles-provider';
import { mergeBlockeraSettingsIntoExperimentalFeatures } from './merge-blockera-experimental-features';
import { generateBlockeraSupplementalPresetVariablesCss } from './generate-blockera-supplemental-preset-variables-css';
import { applyBlockeraSupplementalPresetVariablesToIframes } from './apply-blockera-supplemental-preset-variables-to-iframes';
import {
	BLOCKERA_RESOLVED_IFRAME_VARIABLES_STYLE_ID,
	BLOCKERA_SUPPLEMENTAL_PRESET_VARIABLES_STYLE_KEY,
} from './blockera-supplemental-preset-variables-constants';

export {
	BLOCKERA_RESOLVED_IFRAME_VARIABLES_STYLE_ID,
	BLOCKERA_SUPPLEMENTAL_PRESET_VARIABLES_STYLE_KEY,
};

type EditorStyle = {
	css?: string;
	isGlobalStyles?: boolean;
	source?: string;
	__unstableType?: string;
	[key: string]: unknown;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function stableFingerprint(value: unknown): string {
	try {
		return JSON.stringify(value);
	} catch {
		return '';
	}
}

function mergeBlockeraPresetVariablesIntoEditorStyles(
	styles: EditorStyle[] | undefined,
	supplementalCss: string
): EditorStyle[] {
	const list = Array.isArray(styles) ? [...styles] : [];
	const existingIndex = list.findIndex(
		(style) =>
			style.source === BLOCKERA_SUPPLEMENTAL_PRESET_VARIABLES_STYLE_KEY ||
			style.__unstableType ===
				BLOCKERA_SUPPLEMENTAL_PRESET_VARIABLES_STYLE_KEY
	);

	if (!supplementalCss) {
		if (existingIndex >= 0) {
			list.splice(existingIndex, 1);
		}
		return list;
	}

	const entry: EditorStyle = {
		css: supplementalCss,
		source: BLOCKERA_SUPPLEMENTAL_PRESET_VARIABLES_STYLE_KEY,
		__unstableType: 'plugin',
	};

	if (existingIndex >= 0) {
		list[existingIndex] = entry;
	} else {
		list.push(entry);
	}

	return list;
}

/**
 * Mirrors global-styles-ui `useGlobalSetting` preset state into editor settings
 * `__experimentalFeatures` and supplemental preset CSS variables.
 *
 * Store mirror on `styles` plus direct iframe `<style>` injection for live
 * preview (Style Book replaces `settings.styles` with core global styles output).
 * Live edits no longer patch `__unstableResolvedAssets` — that triggers iframe
 * blob reloads that fight DOM injection.
 */
export function BlockEditorExperimentalFeaturesSync() {
	const { merged, isReady } = useGlobalStylesContext();
	const { getEditorSettings } = useSelect(
		(selectStore) => ({
			getEditorSettings: selectStore(editorStore).getEditorSettings,
		}),
		[]
	);
	const { updateEditorSettings } = useDispatch(editorStore);

	const blockeraSettings = useMemo(() => {
		const settings = (merged as { settings?: unknown } | undefined)
			?.settings;
		return isPlainObject(settings) ? settings : undefined;
	}, [merged]);

	const supplementalCss = useMemo(() => {
		if (!blockeraSettings) {
			return '';
		}
		return generateBlockeraSupplementalPresetVariablesCss(blockeraSettings);
	}, [blockeraSettings]);

	const applyIframeCss = useCallback(() => {
		return applyBlockeraSupplementalPresetVariablesToIframes(
			supplementalCss
		);
	}, [supplementalCss]);

	const markIframeCssSynced = useCallback(() => {
		lastIframeCssApplied.current = supplementalCss;
	}, [supplementalCss]);

	const lastAppliedFingerprint = useRef('');
	const lastIframeCssApplied = useRef('');

	useEffect(() => {
		const { mutated, synced } = applyIframeCss();
		if (mutated || synced) {
			markIframeCssSynced();
		}
	}, [applyIframeCss, markIframeCssSynced]);

	useEffect(() => {
		if (typeof document === 'undefined' || !document.body) {
			return;
		}

		let frame = 0;
		const scheduleApply = (mutations: MutationRecord[]) => {
			const iframeMounted = mutations.some((mutation) =>
				[...mutation.addedNodes].some(
					(node) =>
						node instanceof HTMLIFrameElement ||
						(node instanceof Element &&
							node.querySelector('iframe'))
				)
			);

			if (
				!iframeMounted &&
				supplementalCss === lastIframeCssApplied.current
			) {
				return;
			}

			if (frame) {
				cancelAnimationFrame(frame);
			}
			frame = requestAnimationFrame(() => {
				frame = 0;
				const { mutated, synced } = applyIframeCss();
				if (mutated || synced) {
					markIframeCssSynced();
				}
			});
		};

		const observer = new MutationObserver(scheduleApply);

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => {
			if (frame) {
				cancelAnimationFrame(frame);
			}
			observer.disconnect();
		};
	}, [applyIframeCss, supplementalCss, markIframeCssSynced]);

	useEffect(() => {
		if (!isReady || !blockeraSettings) {
			return;
		}

		const currentStoreSettings = getEditorSettings();
		if (!currentStoreSettings) {
			return;
		}

		const currentFeatures = isPlainObject(
			currentStoreSettings.__experimentalFeatures
		)
			? (currentStoreSettings.__experimentalFeatures as Record<
					string,
					unknown
				>)
			: {};

		const nextFeatures = mergeBlockeraSettingsIntoExperimentalFeatures(
			currentFeatures,
			blockeraSettings
		);

		const nextFingerprint = [
			stableFingerprint(nextFeatures),
			stableFingerprint(blockeraSettings),
			supplementalCss,
		].join('|');

		if (nextFingerprint === lastAppliedFingerprint.current) {
			return;
		}

		const nextStyles = mergeBlockeraPresetVariablesIntoEditorStyles(
			currentStoreSettings.styles as EditorStyle[] | undefined,
			supplementalCss
		);

		updateEditorSettings({
			...currentStoreSettings,
			styles: nextStyles,
			__experimentalFeatures: nextFeatures,
		});

		lastAppliedFingerprint.current = nextFingerprint;

		const applyAfterSettings = () => {
			const { mutated, synced } = applyIframeCss();
			if (mutated || synced) {
				markIframeCssSynced();
			}
		};

		applyAfterSettings();
		requestAnimationFrame(() => {
			requestAnimationFrame(applyAfterSettings);
		});
	}, [
		isReady,
		blockeraSettings,
		supplementalCss,
		getEditorSettings,
		updateEditorSettings,
		applyIframeCss,
		markIframeCssSynced,
	]);

	return null;
}
