/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { classes as classCombinations } from './classes';

const handleSpecificClassCombinations = (container, blockName) => {
	classCombinations.forEach(
		({ parent, children, exclude, include, childrenCheck }) => {
			if (exclude && exclude.includes(blockName)) {
				return;
			}

			if (include && !include.includes(blockName)) {
				return;
			}

			// no children selectors, then hide the parent element
			if (!children) {
				const parentElements = container.querySelectorAll(parent);

				parentElements.forEach((parentElement) => {
					parentElement.classList.add('blockera-hidden');
					parentElement.style.display = 'none';
				});

				return;
			}

			// Convert single string to array for consistent handling
			const childrenSelectors = Array.isArray(children)
				? children
				: [children];

			// Try each selector until we find a match
			for (const selector of childrenSelectors) {
				const childElements = container.querySelectorAll(selector);
				let childParentFound = false;

				if (childElements.length > 0) {
					// Found a match, hide the parent and break the loop
					childElements.forEach((childElement) => {
						// If childrenCheck is 'first' or not defined, only process the first element
						if (childrenCheck !== 'all' && childParentFound) {
							return;
						}

						const parentElement = childElement.closest(parent);

						if (parentElement) {
							parentElement.classList.add('blockera-hidden');
							parentElement.style.display = 'none';
							childParentFound = true;
						}
					});

					break; // Exit the loop after finding and handling the first match
				}
			}
		}
	);
};

export const useBlockSideEffects = ({
	activeBlockVariation,
	blockName,
	currentBlock,
	currentTab,
	currentState,
	isActive,
}) => {
	useEffect(() => {
		const inspector = document.querySelector(
			'.block-editor-block-inspector'
		);

		if (inspector) {
			const classList = inspector.classList;
			Array.from(classList).forEach((className) => {
				if (className.startsWith('blockera-active-block-')) {
					classList.remove(className);
				}
			});

			inspector.classList.add(
				'blockera-active-block-' +
					blockName.replaceAll('/', '-') +
					(activeBlockVariation
						? '-' + activeBlockVariation.replaceAll('/', '-')
						: '')
			);
		}

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

			settingsOutsideAnyTabs.forEach((tab) => {
				handleSpecificClassCombinations(tab, blockName);
			});

			return;
		}

		setClassList(inspectorTabs);

		// Handle specific class combinations in both inspectorTabs and settingsOutsideAnyTabs
		if (inspectorTabs) {
			if ('settings' === currentTab) {
				setTimeout(() => {
					handleSpecificClassCombinations(inspectorTabs, blockName);
				}, 30);
			} else {
				handleSpecificClassCombinations(inspectorTabs, blockName);
			}
		}

		if ('settings' === currentTab && currentBlock === 'master') {
			inspectorTabs.style = {};
			inspectorTabs.classList.remove('blockera-hide');
			return;
		}

		if (currentBlock !== 'master') {
			inspectorTabs.style.display = 'none';
			inspectorTabs.classList.add('blockera-hide');
			return;
		}

		if (!isActive) {
			inspectorTabs.style = {};
			inspectorTabs.classList.remove('blockera-hide');
			return;
		}

		inspectorTabs.style.display = 'none';
		inspectorTabs.classList.add('blockera-hide');
	}, [
		blockName,
		currentBlock,
		currentTab,
		currentState,
		isActive,
		activeBlockVariation,
	]);
};
