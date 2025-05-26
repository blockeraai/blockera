/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

const restoreSpecificClassCombinations = (container) => {
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
		// Settings block section and other combinations...
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
