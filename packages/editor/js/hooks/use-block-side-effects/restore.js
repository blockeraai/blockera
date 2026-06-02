/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { classes as classCombinations } from './classes';

const restoreSpecificClassCombinations = (container) => {
	classCombinations.forEach(({ parent, children }) => {
		if (!children) {
			const parentElements = container.querySelectorAll(parent);
			parentElements.forEach((parentElement) => {
				parentElement.classList.remove('blockera-hidden');
				parentElement.style.removeProperty('display');
			});
			return;
		}

		const childrenSelectors = Array.isArray(children)
			? children
			: [children];

		for (const selector of childrenSelectors) {
			const childElements = container.querySelectorAll(selector);
			childElements.forEach((childElement) => {
				const parentElement = childElement.closest(parent);
				if (parentElement) {
					parentElement.classList.remove('blockera-hidden');
					parentElement.style.removeProperty('display');
				}
			});
		}
	});
};

/**
 * Restores inspector DOM when switching to a non-Blockera block (see block-settings.js).
 */
export const useBlockSideEffectsRestore = (selectedBlock) => {
	useEffect(() => {
		const inspector = document.querySelector(
			'.block-editor-block-inspector'
		);

		if (inspector) {
			Array.from(inspector.classList).forEach((className) => {
				if (className.startsWith('blockera-active-block-')) {
					inspector.classList.remove(className);
				}
			});

			inspector.classList.remove('blockera-inspector-on-styles-tab');
		}

		const inspectorTabs = document.querySelector(
			'.block-editor-block-inspector__tabs'
		);
		const settingsOutsideAnyTabs = document.querySelectorAll(
			'.block-editor-block-inspector div[class^="css-"]'
		);

		const restoreElement = (element) => {
			if (element) {
				element.classList.remove('blockera-not-allowed');
				element.style.removeProperty('display');
				element.removeAttribute('data-test');
			}
		};

		if (settingsOutsideAnyTabs.length) {
			settingsOutsideAnyTabs.forEach((settingElement) => {
				restoreElement(settingElement);

				if (
					settingsOutsideAnyTabs[
						settingsOutsideAnyTabs.length - 1
					] === settingElement
				) {
					if (settingElement?.nextElementSibling) {
						restoreElement(settingElement.nextElementSibling);
					} else if (settingElement?.nextSibling) {
						restoreElement(settingElement.nextSibling);
					}
				}
			});

			settingsOutsideAnyTabs.forEach((tab) => {
				restoreSpecificClassCombinations(tab);
			});
		}

		if (inspectorTabs) {
			restoreElement(inspectorTabs);
			inspectorTabs.classList.remove('blockera-hide');
			restoreSpecificClassCombinations(inspectorTabs);
		}
	}, [selectedBlock]);
};
