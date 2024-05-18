/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

export const useBlockSideEffects = ({ currentTab, currentState, isActive }) => {
	useEffect(() => {
		// The original WordPress Block Tabs wrapper element.
		const inspectorTabs = document.querySelector(
			'.block-editor-block-inspector__tabs'
		);
		// The settings Nodes which outside of settings and styles tab on original version of WordPress Core Blocks.
		const settingsOutsideAnyTabs = document.querySelectorAll(
			'.block-editor-block-inspector div[class^="css-"]'
		);
		const notAllowedClass = 'blockera-not-allowed';
		const setClassList = (settingElement) => {
			settingElement.setAttribute('data-test', 'blockera-availability');

			if ('normal' === currentState) {
				settingElement.classList.remove(notAllowedClass);
			} else {
				settingElement.classList.add(notAllowedClass);
			}
		};

		// Assume current block has not any block tabs.
		if (!inspectorTabs) {
			// We should handle other settings with show && hide functions.
			if (settingsOutsideAnyTabs.length) {
				const show = (settingElement) => {
					settingElement.style = {};
					setClassList(settingElement);

					if (
						settingsOutsideAnyTabs[
							settingsOutsideAnyTabs.length - 1
						] === settingElement
					) {
						if (settingElement?.nextElementSibling) {
							settingElement.nextElementSibling.style = {};
							setClassList(settingElement.nextElementSibling);
						} else if (settingElement?.nextSibling) {
							settingElement.nextSibling.style = {};
							setClassList(settingElement.nextSibling);
						}
					}
				};
				const hide = (settingElement) => {
					settingElement.style.display = 'none';
					setClassList(settingElement);

					if (
						settingsOutsideAnyTabs[
							settingsOutsideAnyTabs.length - 1
						] === settingElement
					) {
						if (settingElement?.nextElementSibling) {
							settingElement.nextElementSibling.style.display =
								'none';
							setClassList(settingElement.nextElementSibling);
						} else if (settingElement?.nextSibling) {
							settingElement.nextSibling.style.display = 'none';
							setClassList(settingElement.nextSibling);
						}
					}
				};

				if ('settings' === currentTab || !isActive) {
					settingsOutsideAnyTabs.forEach(show);
				} else {
					settingsOutsideAnyTabs.forEach(hide);
				}
			}

			return;
		}

		setClassList(inspectorTabs);

		if ('settings' === currentTab) {
			inspectorTabs.style = {};

			return;
		}

		if (!isActive) {
			inspectorTabs.style = {};
			return;
		}

		inspectorTabs.style.display = 'none';
	}, [currentTab, currentState, isActive]);
};
