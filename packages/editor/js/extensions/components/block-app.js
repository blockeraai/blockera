// @flow

/**
 * External dependencies
 */
import {
	memo,
	useContext,
	useCallback,
	createContext,
} from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { updateItem } from '@blockera/storage';

/**
 * Internal dependencies
 */
import { propsAreEqual } from './utils';
import type {
	BlockSection,
	BlockSections,
	BlockBaseProps,
	BlockAppContextType,
} from './types';
import { getNormalizedCacheVersion } from '../helpers';
import { defaultValue, cacheKeyPrefix } from './initializer';

const BlockAppContext = createContext(defaultValue);

export const BlockAppContextProvider = ({
	children,
	...props
}: Object): MixedElement => {
	const { blockAppSettings } = useSelect((select) => ({
		blockAppSettings: select('blockera/editor').getBlockAppSettings(),
	}));

	return (
		<BlockAppContext.Provider
			value={{
				props,
				settings: blockAppSettings,
			}}
		>
			{children}
		</BlockAppContext.Provider>
	);
};

export const useBlockAppContext = (): BlockAppContextType =>
	useContext(BlockAppContext);

export const useBlockSection = (sectionId: string): BlockSection => {
	const { settings } = useBlockAppContext();
	const { currentBlock, version } = useSelect((select) => ({
		currentBlock: select('blockera/extensions').getExtensionCurrentBlock(),
		version: select('blockera/data').getEntity('blockera')?.version,
	}));
	const { blockSections, sections, focusedSection } = settings;
	const { collapseAll, focusMode } = blockSections;
	const section = (sections[currentBlock] || sections.master)[sectionId];
	let { initialOpen = true } = section || {};
	const { setBlockAppSettings } = useDispatch('blockera/editor');
	const cacheKey = cacheKeyPrefix + '_' + getNormalizedCacheVersion(version);

	if (collapseAll) {
		initialOpen = false;
	} else if (focusMode && focusedSection !== sectionId) {
		initialOpen = false;
	}

	const onToggle = useCallback(
		(
			isOpen: boolean,
			action: 'switch-to-parent' | 'switch-to-inner',
			targetBlock?: string
		) => {
			const inSpecificAction = [
				'switch-to-parent',
				'switch-to-inner',
			].includes(action);

			const next = {
				...settings,
				focusedSection:
					'switch-to-inner' === action
						? settings.focusedSection
						: sectionId,
				sections: inSpecificAction
					? settings.sections
					: {
							...settings.sections,
							[currentBlock]: {
								...(settings.sections[currentBlock] ||
									settings.sections.master),
								[sectionId]: {
									...(settings.sections[currentBlock] ||
										settings.sections.master)[sectionId],
									initialOpen: isOpen,
								},
							},
					  },
			};

			if (
				isOpen &&
				blockSections.focusMode &&
				focusedSection &&
				focusedSection !== sectionId &&
				!inSpecificAction
			) {
				next.sections[currentBlock][focusedSection] = {
					...next.sections[currentBlock][focusedSection],
					initialOpen: false,
				};
			}

			if (
				'switch-to-inner' === action &&
				targetBlock &&
				next.sections[targetBlock]
			) {
				for (const key in next.sections[targetBlock]) {
					if (next.sections[targetBlock][key].initialOpen) {
						next.focusedSection = key;
					}
				}
			}

			updateItem(cacheKey, next);
			setBlockAppSettings(next);
		},
		[
			cacheKey,
			settings,
			sectionId,
			currentBlock,
			focusedSection,
			setBlockAppSettings,
			blockSections.focusMode,
		]
	);

	return {
		onToggle,
		initialOpen,
	};
};

export const useBlockSections = (): BlockSections => {
	const { settings } = useBlockAppContext();
	const { blockSections, sections, focusedSection } = settings;
	const { setBlockAppSettings } = useDispatch('blockera/editor');
	const { currentBlock, version } = useSelect((select) => ({
		currentBlock: select('blockera/extensions').getExtensionCurrentBlock(),
		version: select('blockera/data').getEntity('blockera')?.version,
	}));
	const cacheKey = cacheKeyPrefix + '_' + getNormalizedCacheVersion(version);

	const updateBlockSections = useCallback(
		(newBlockSections: Object) => {
			const { expandAll, collapseAll, focusMode, defaultMode } =
				newBlockSections;

			const updatedSections = Object.entries(
				sections[currentBlock] || sections.master
			).reduce((acc: Object, [key, section]: [string, BlockSection]) => {
				if (expandAll) {
					acc[key] = { ...section, initialOpen: true };
				} else if (collapseAll) {
					acc[key] = { ...section, initialOpen: false };
				} else if (focusMode) {
					acc[key] = {
						...section,
						initialOpen: focusedSection === key,
					};
				} else if (defaultMode) {
					acc[key] = section;
				}
				return acc;
			}, {});

			const next = {
				...settings,
				blockSections: {
					...defaultValue.blockSections,
					focusMode,
				},
				sections: {
					...settings.sections,
					[currentBlock]: Object.keys(updatedSections).length
						? updatedSections
						: sections,
				},
			};

			updateItem(cacheKey, next);
			setBlockAppSettings(next);
		},
		[
			cacheKey,
			settings,
			sections,
			currentBlock,
			focusedSection,
			setBlockAppSettings,
		]
	);

	return {
		blockSections,
		updateBlockSections,
	};
};

export const BlockApp: ComponentType<any> = memo(
	({ children, ...props }: BlockBaseProps): MixedElement => {
		return (
			<BlockAppContextProvider {...props}>
				{children}
			</BlockAppContextProvider>
		);
	},
	propsAreEqual
);
