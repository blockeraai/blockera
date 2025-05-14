/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

const handleSpecificClassCombinations = (container, blockName) => {
	const classCombinations = [
		// Position block section
		{
			parent: '.components-tools-panel.block-editor-block-inspector__position',
		},
		// Layout block section
		{
			parent: '.components-panel__body',
			children: [
				'.components-panel__body .block-editor-hooks__flex-layout-justification-controls',
				'.components-panel__body .block-editor-hooks__flex-layout-orientation-controls',
			],
			childrenCheck: 'first',
		},
		// Settings block section
		{
			parent: '.components-tools-panel',
			children: [
				'.components-tools-panel:not(.block-editor-bindings__panel,.block-editor-block-inspector__position) .components-tools-panel-header',
			],
			exclude: [
				'core/archives',
				'core/categories',
				'core/columns',
				'core/details',
				'core/latest-comments',
				'core/latest-posts',
				'core/loginout',
				'core/media-text',
				'core/navigation-link',
				'core/navigation-submenu',
				'core/page-list',
				'core/post-author-name',
				'core/post-date',
				'core/post-excerpt',
				'core/post-featured-image',
				'core/query-pagination',
				'core/query-pagination-numbers',
				'core/query-title',
				'core/read-more',
				'core/site-title',
				'core/social-link',
				'core/social-links',
				'core/table',
				'core/tag-cloud',
				'core/video',
				'core/image',
				'core/file',
				'outermost/icon-block',
			],
		},
		// "core/avatar" - image size
		{
			parent: '.components-range-control',
			children: [
				// Hide range control for image size
				'.components-panel__body .components-range-control .components-base-control__label',
			],
			include: ['core/avatar'],
		},
		// "core/image" - aspect ratio
		{
			parent: '.components-tools-panel-item',
			children: [
				// Hide aspect ratio select
				'.components-tools-panel select.components-select-control__input option[value="auto"]',
				'.components-tools-panel select.components-select-control__input option[value="1"]',
				'.components-tools-panel select.components-select-control__input option[value="4/3"]',
			],
			include: ['core/image'],
		},
		// "core/image" - width & height
		{
			parent: '.components-tools-panel-item',
			children: [
				// Hide width & height select
				'.components-tools-panel .components-input-control__input',
			],
			childrenCheck: 'all',
			include: ['core/image'],
		},
		// "core/image" - scale
		{
			parent: '.components-tools-panel-item',
			children: [
				// Hide scale control
				'.components-tools-panel button[value="cover"]',
				'.components-tools-panel button[value="contain"]',
			],
			include: ['core/image'],
		},
	];

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
			handleSpecificClassCombinations(inspectorTabs, blockName);
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
