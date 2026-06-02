/**
 * External dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { classes as classCombinations } from './classes';
import {
	getEffectiveInspectorTab,
	getSettingsOutsideInspectorTabs,
	getSettingsTabPanel,
	isInspectorTabChrome,
	isSettingsInspectorTab,
	isStylesInspectorTab,
	resolveInspectorRoot,
} from './utils';
import { useShouldRenderBlockInspectorCardPortal } from '../../extensions/libs/block-card';
import { useBlockInspectorContainer } from '../../extensions/components/use-block-inspector-container';

const INSPECTOR_TABS_SELECTOR = '.block-editor-block-inspector__tabs';
const BLOCKERA_STYLE_SCOPE_CLASS = 'blockera-inspector-on-styles-tab';

const observeInspectorTabLists = (inspector, onTabChange) => {
	const observers = [];

	if (!inspector) {
		return observers;
	}

	const tabLists = new Set();

	const nestedTabList = inspector.querySelector('[role="tablist"]');

	if (nestedTabList) {
		tabLists.add(nestedTabList);
	}

	const complementaryArea =
		inspector.closest('.interface-complementary-area') ||
		document.querySelector('.interface-complementary-area');
	const sidebarTabList = complementaryArea?.querySelector('[role="tablist"]');

	if (sidebarTabList) {
		tabLists.add(sidebarTabList);
	}

	tabLists.forEach((tabList) => {
		const observer = new MutationObserver(onTabChange);

		observer.observe(tabList, {
			attributes: true,
			subtree: true,
			attributeFilter: ['aria-selected'],
		});

		observers.push(observer);
	});

	return observers;
};

const handleSpecificClassCombinations = (
	container,
	blockName,
	activeBlockVariation
) => {
	if (!container) {
		return;
	}

	classCombinations.forEach(
		({ parent, children, exclude, include, childrenCheck }) => {
			if (
				exclude &&
				(exclude.includes(blockName) ||
					exclude.includes(activeBlockVariation))
			) {
				return;
			}

			if (
				include &&
				!include.includes(blockName) &&
				!include.includes(activeBlockVariation)
			) {
				return;
			}

			if (!children) {
				container.querySelectorAll(parent).forEach((parentElement) => {
					if (isInspectorTabChrome(parentElement)) {
						return;
					}

					parentElement.classList.add('blockera-hidden');
					parentElement.style.display = 'none';
				});

				return;
			}

			const childrenSelectors = Array.isArray(children)
				? children
				: [children];

			for (const selector of childrenSelectors) {
				const childElements = container.querySelectorAll(selector);
				let childParentFound = false;

				if (childElements.length > 0) {
					childElements.forEach((childElement) => {
						if (childrenCheck !== 'all' && childParentFound) {
							return;
						}

						const parentElement = childElement.closest(parent);

						if (
							!parentElement ||
							isInspectorTabChrome(parentElement)
						) {
							return;
						}

						parentElement.classList.add('blockera-hidden');
						parentElement.style.display = 'none';
						childParentFound = true;
					});

					break;
				}
			}
		}
	);
};

const restoreSpecificClassCombinations = (container) => {
	if (!container) {
		return;
	}

	classCombinations.forEach(({ parent, children }) => {
		if (!children) {
			container.querySelectorAll(parent).forEach((parentElement) => {
				if (isInspectorTabChrome(parentElement)) {
					return;
				}

				parentElement.classList.remove('blockera-hidden');
				parentElement.style.removeProperty('display');
			});

			return;
		}

		const childrenSelectors = Array.isArray(children)
			? children
			: [children];

		for (const selector of childrenSelectors) {
			container.querySelectorAll(selector).forEach((childElement) => {
				const parentElement = childElement.closest(parent);

				if (parentElement && !isInspectorTabChrome(parentElement)) {
					parentElement.classList.remove('blockera-hidden');
					parentElement.style.removeProperty('display');
				}
			});
		}
	});
};

const clearBlockeraInspectorClasses = (inspector) => {
	if (!inspector) {
		return;
	}

	Array.from(inspector.classList).forEach((className) => {
		if (className.startsWith('blockera-active-block-')) {
			inspector.classList.remove(className);
		}
	});
};

const clearLegacyInspectorTabStyles = (inspector) => {
	const inspectorTabs = inspector?.querySelector(INSPECTOR_TABS_SELECTOR);

	if (!inspectorTabs) {
		return;
	}

	inspectorTabs.style.removeProperty('display');
	inspectorTabs.classList.remove('blockera-hide', 'blockera-not-allowed');
	inspectorTabs.removeAttribute('data-test');
};

const applyBlockSideEffects = ({
	activeBlockVariation,
	blockName,
	currentTab,
	currentState,
	isActive,
	insideBlockInspector,
	inspector,
}) => {
	if (!inspector) {
		return;
	}

	const effectiveTab = getEffectiveInspectorTab({
		insideBlockInspector,
		currentTab,
		inspector,
	});
	const notAllowedClass = 'blockera-not-allowed';
	const hasNestedTabs = Boolean(
		inspector.querySelector(INSPECTOR_TABS_SELECTOR)
	);

	clearBlockeraInspectorClasses(inspector);
	clearLegacyInspectorTabStyles(inspector);

	inspector.classList.add(
		'blockera-active-block-' +
			blockName.replaceAll('/', '-') +
			(activeBlockVariation
				? '-' + activeBlockVariation.replaceAll('/', '-')
				: '')
	);

	const showBlockeraStylePanels =
		insideBlockInspector && isActive && isStylesInspectorTab(effectiveTab);

	inspector.classList.toggle(
		BLOCKERA_STYLE_SCOPE_CLASS,
		showBlockeraStylePanels
	);

	// Blocks without nested WP tabs: toggle loose settings nodes by tab.
	if (!hasNestedTabs) {
		const settingsOutsideAnyTabs =
			getSettingsOutsideInspectorTabs(inspector);

		const setAvailabilityClass = (settingElement) => {
			if (isInspectorTabChrome(settingElement)) {
				return;
			}

			settingElement.setAttribute('data-test', 'blockera-availability');

			if ('normal' === currentState) {
				settingElement.classList.remove(notAllowedClass);
			} else {
				settingElement.classList.add(notAllowedClass);
			}
		};

		settingsOutsideAnyTabs.forEach((settingElement) => {
			if (isInspectorTabChrome(settingElement)) {
				return;
			}

			if (isSettingsInspectorTab(effectiveTab) || !isActive) {
				settingElement.style.removeProperty('display');
				setAvailabilityClass(settingElement);
				return;
			}

			settingElement.style.display = 'none';
			setAvailabilityClass(settingElement);
		});
	}

	// Settings tab: hide duplicate WP panels (class rules), never touch tab chrome.
	if (
		insideBlockInspector &&
		isActive &&
		isSettingsInspectorTab(effectiveTab)
	) {
		const settingsScope = getSettingsTabPanel(inspector) || inspector;

		handleSpecificClassCombinations(
			settingsScope,
			blockName,
			activeBlockVariation
		);
	}
};

const clearInspectorBlockeraSideEffects = (inspector) => {
	if (!inspector) {
		return;
	}

	clearBlockeraInspectorClasses(inspector);
	clearLegacyInspectorTabStyles(inspector);
	inspector.classList.remove(BLOCKERA_STYLE_SCOPE_CLASS);
};

export const useBlockSideEffects = ({
	clientId = '',
	activeBlockVariation,
	blockName,
	currentTab,
	currentState,
	isActive,
	insideBlockInspector = false,
}) => {
	const inspectorContainer = useBlockInspectorContainer();
	const settingsScopeRef = useRef(null);
	const shouldApplyInspectorEffects = useShouldRenderBlockInspectorCardPortal(
		insideBlockInspector ? clientId : ''
	);
	const canApplySideEffects =
		!insideBlockInspector || shouldApplyInspectorEffects;

	useEffect(() => {
		const inspector = resolveInspectorRoot({
			insideBlockInspector,
			inspectorContainer,
		});

		const runEffects = () => {
			const nextInspector = resolveInspectorRoot({
				insideBlockInspector,
				inspectorContainer,
			});

			if (!nextInspector) {
				return;
			}

			// Leaving settings tab: undo class-rule hides before the next apply pass.
			if (settingsScopeRef.current) {
				restoreSpecificClassCombinations(settingsScopeRef.current);
				settingsScopeRef.current = null;
			}

			// Content-only pattern: leave core inspector untouched until "Edit pattern".
			if (insideBlockInspector && !canApplySideEffects) {
				clearInspectorBlockeraSideEffects(nextInspector);
				return;
			}

			applyBlockSideEffects({
				activeBlockVariation,
				blockName,
				currentTab,
				currentState,
				isActive,
				insideBlockInspector,
				inspector: nextInspector,
			});

			if (
				insideBlockInspector &&
				isActive &&
				isSettingsInspectorTab(
					getEffectiveInspectorTab({
						insideBlockInspector,
						currentTab,
						inspector: nextInspector,
					})
				)
			) {
				settingsScopeRef.current =
					getSettingsTabPanel(nextInspector) || nextInspector;
			}
		};

		runEffects();

		const tabObservers =
			canApplySideEffects && inspector
				? observeInspectorTabLists(inspector, runEffects)
				: [];

		return () => {
			tabObservers.forEach((observer) => observer.disconnect());

			if (settingsScopeRef.current) {
				restoreSpecificClassCombinations(settingsScopeRef.current);
				settingsScopeRef.current = null;
			}

			if (inspector) {
				clearInspectorBlockeraSideEffects(inspector);
			}
		};
	}, [
		activeBlockVariation,
		blockName,
		canApplySideEffects,
		clientId,
		currentTab,
		currentState,
		insideBlockInspector,
		inspectorContainer,
		isActive,
	]);
};
