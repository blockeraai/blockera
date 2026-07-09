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
		// If no children selectors, restore the parent element
		if (!children) {
			const parentElements = container.querySelectorAll(parent);
			parentElements.forEach((parentElement) => {
				parentElement.classList.remove('blockera-hidden');
				parentElement.style.removeProperty('display');
			});
			return;
		}

		// Convert single string to array for consistent handling
		const childrenSelectors = Array.isArray(children)
			? children
			: [children];

		// Restore each selector
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

export const useBlockSideEffectsRestore = (selectedBlock) => {
	const inspector = document.querySelector('.block-editor-block-inspector');
	useEffect(() => {
		if (inspector) {
			// Remove all blockera-active-block-* classes
			const classList = inspector.classList;
			Array.from(classList).forEach((className) => {
				if (className.startsWith('blockera-active-block-')) {
					classList.remove(className);
				}
			});
		}

		const inspectorTabs = document.querySelector(
			'.block-editor-block-inspector__tabs'
		);
		const settingsOutsideAnyTabs = document.querySelectorAll(
			'.block-editor-block-inspector div[class^="css-"]'
		);

		// Remove not allowed class and restore visibility
		const restoreElement = (element) => {
			if (element) {
				element.classList.remove('blockera-not-allowed');
				element.style.removeProperty('display');
				element.removeAttribute('data-test');
			}
		};

		// Restore settings outside tabs
		if (settingsOutsideAnyTabs.length) {
			settingsOutsideAnyTabs.forEach((settingElement) => {
				restoreElement(settingElement);

				// Restore next sibling if it's the last setting
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

		// Restore inspector tabs
		if (inspectorTabs) {
			restoreElement(inspectorTabs);
			inspectorTabs.classList.remove('blockera-hide');
			restoreSpecificClassCombinations(inspectorTabs);
		}
	}, [inspector, selectedBlock]);
};
