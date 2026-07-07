/**
 * Internal dependencies
 */
import {
	getDualGlobalStylesSelector,
	queryActiveGlobalStylesNavigatorScreen,
	queryGlobalStylesPanelElement,
} from './selectors';

export const NAVIGATOR_BACK_BUTTON_COMPONENT = 'Navigator.BackButton';

export const NAVIGATOR_BACK_RETRY_INTERVAL_MS = 100;
export const NAVIGATOR_BACK_MAX_RETRY_ATTEMPTS = 30;

/**
 * Locate the WordPress Global Styles navigator back button within an optional root.
 */
export const findGlobalStylesNavigatorBackButton = (
	root: ParentNode | Document = document
): HTMLButtonElement | null => {
	const scope =
		root instanceof Document || root instanceof Element ? root : document;

	const buttons = scope.querySelectorAll(
		getDualGlobalStylesSelector('navigatorBackButton')
	);

	for (const button of buttons) {
		if (
			button instanceof HTMLButtonElement &&
			button.getAttribute('data-wp-component') ===
				NAVIGATOR_BACK_BUTTON_COMPONENT
		) {
			return button;
		}
	}

	return null;
};

/**
 * Locate the active Global Styles screen header (legacy + WP 7+).
 */
export const findGlobalStylesScreenHeader = (
	root?: ParentNode | Document | null
): HTMLElement | null => {
	const scope =
		root ??
		queryActiveGlobalStylesNavigatorScreen() ??
		queryGlobalStylesPanelElement('navigatorScreen') ??
		document;

	const header = scope.querySelector(
		getDualGlobalStylesSelector('screenHeader')
	);

	return header instanceof HTMLElement ? header : null;
};

/**
 * Update the visible Global Styles screen header label.
 */
export const setGlobalStylesScreenHeaderTitle = (title: string): boolean => {
	const navigatorScreen = queryActiveGlobalStylesNavigatorScreen();
	const header = findGlobalStylesScreenHeader(navigatorScreen);

	if (!header) {
		return false;
	}

	header.textContent = title;

	return true;
};

/**
 * Ensure the Global Styles header shell and back button stay visible when
 * Blockera overrides native block screen UI (CSS may hide the header row).
 */
export const revealGlobalStylesScreenHeader = (): void => {
	const navigatorScreen = queryActiveGlobalStylesNavigatorScreen();

	if (!navigatorScreen) {
		return;
	}

	const backButton = findGlobalStylesNavigatorBackButton(navigatorScreen);
	const header = findGlobalStylesScreenHeader(navigatorScreen);

	if (backButton) {
		backButton.style.setProperty('display', 'inline-flex', 'important');
		backButton.style.setProperty('visibility', 'visible', 'important');
	}

	if (header) {
		header.style.setProperty('display', 'inline-flex', 'important');
	}

	let node: HTMLElement | null =
		backButton?.parentElement ?? header?.parentElement ?? null;

	while (node && node !== navigatorScreen && node instanceof HTMLElement) {
		node.style.setProperty('display', 'inline-flex', 'important');
		node = node.parentElement;
	}
};

export type AttachGlobalStylesNavigatorBackOptions = {
	root?: ParentNode | Document | null;
	once?: boolean;
	onBack: () => void;
};

/**
 * Attach a listener to the Global Styles navigator back button with retry support.
 * Returns a cleanup function that cancels pending retries and removes the listener.
 */
export const attachGlobalStylesNavigatorBackListener = ({
	root,
	once = true,
	onBack,
}: AttachGlobalStylesNavigatorBackOptions): (() => void) => {
	const scope =
		root ??
		queryActiveGlobalStylesNavigatorScreen() ??
		queryGlobalStylesPanelElement('navigatorScreen') ??
		document;

	let retryTimeout: ReturnType<typeof setTimeout> | null = null;
	let attachedButton: HTMLButtonElement | null = null;
	let cancelled = false;

	const cleanup = (): void => {
		cancelled = true;

		if (retryTimeout) {
			clearTimeout(retryTimeout);
			retryTimeout = null;
		}

		if (attachedButton) {
			attachedButton.removeEventListener('click', onBack);
			attachedButton = null;
		}
	};

	const tryAttach = (attempt = 0): void => {
		if (cancelled) {
			return;
		}

		const backButton = findGlobalStylesNavigatorBackButton(scope);

		if (backButton) {
			attachedButton = backButton;
			backButton.addEventListener('click', onBack, { once });
			return;
		}

		if (attempt >= NAVIGATOR_BACK_MAX_RETRY_ATTEMPTS) {
			return;
		}

		retryTimeout = setTimeout(() => {
			tryAttach(attempt + 1);
		}, NAVIGATOR_BACK_RETRY_INTERVAL_MS);
	};

	tryAttach();

	return cleanup;
};
