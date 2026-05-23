// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	attachGlobalStylesNavigatorBackListener,
	BLOCKERA_GLOBAL_STYLES_UI_BODY_CLASS,
	NAVIGATOR_BACK_MAX_RETRY_ATTEMPTS,
	NAVIGATOR_BACK_RETRY_INTERVAL_MS,
	queryActiveGlobalStylesNavigatorScreen,
	removeBlockeraGlobalStylesUiBodyClass,
	revealGlobalStylesScreenHeader,
	setGlobalStylesScreenHeaderTitle,
} from '@blockera/global-styles-ui';

export const useBackButton = ({
	className = BLOCKERA_GLOBAL_STYLES_UI_BODY_CLASS,
	selectedBlockStyle,
	setSelectedBlockRef,
	setSelectedBlockStyle,
	resetBlockStateToNormal,
	setSelectedBlockStyleVariation,
	setSelectedBlockSizeVariation,
	statesManagerHandleOnChangeRef,
}: {
	className?: string,
	selectedBlockStyle: string,
	resetBlockStateToNormal: () => void,
	statesManagerHandleOnChangeRef?: {
		current: ((value: Object) => void) | null,
	},
	setSelectedBlockRef: (blockRef: string | void) => void,
	setSelectedBlockStyle: (blockName: string | void) => void,
	setSelectedBlockStyleVariation: (blockName: string | void) => void,
	setSelectedBlockSizeVariation?: (variation: Object | void) => void,
}) => {
	useEffect(() => {
		if (!selectedBlockStyle) {
			return;
		}

		let retryTimeout: TimeoutID | null = null;
		let headerAttempts = 0;
		let backCleanup: (() => void) | null = null;
		let cancelled = false;

		const blocksTitle = __('Blocks', 'blockera');

		const syncHeader = (): boolean => {
			if (!queryActiveGlobalStylesNavigatorScreen()) {
				return false;
			}

			return setGlobalStylesScreenHeaderTitle(blocksTitle);
		};

		const attachBack = (): boolean => {
			if (backCleanup) {
				return true;
			}

			const navigatorScreen = queryActiveGlobalStylesNavigatorScreen();

			if (!navigatorScreen) {
				return false;
			}

			backCleanup = attachGlobalStylesNavigatorBackListener({
				root: navigatorScreen,
				onBack: () => {
					if (statesManagerHandleOnChangeRef?.current) {
						resetBlockStateToNormal();
					}

					removeBlockeraGlobalStylesUiBodyClass(className);

					setSelectedBlockRef(undefined);
					setSelectedBlockStyle(undefined);
					setSelectedBlockStyleVariation(undefined);
					setSelectedBlockSizeVariation?.(undefined);
				},
			});

			return true;
		};

		const trySetup = (): void => {
			if (cancelled) {
				return;
			}

			revealGlobalStylesScreenHeader();

			const headerReady = syncHeader();
			const backReady = attachBack();

			if (headerReady && backReady) {
				return;
			}

			if (headerAttempts >= NAVIGATOR_BACK_MAX_RETRY_ATTEMPTS) {
				return;
			}

			headerAttempts += 1;
			retryTimeout = setTimeout(
				trySetup,
				NAVIGATOR_BACK_RETRY_INTERVAL_MS
			);
		};

		trySetup();

		return () => {
			cancelled = true;

			if (retryTimeout) {
				clearTimeout(retryTimeout);
			}

			backCleanup?.();
		};
	}, [
		className,
		selectedBlockStyle,
		resetBlockStateToNormal,
		setSelectedBlockRef,
		setSelectedBlockStyle,
		setSelectedBlockStyleVariation,
		setSelectedBlockSizeVariation,
		statesManagerHandleOnChangeRef,
	]);
};
