// @flow

/**
 * External dependencies
 */
import {
	memo,
	useMemo,
	useEffect,
	useContext,
	useCallback,
	createContext,
} from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { setItem, getItem, updateItem, freshItem } from '@blockera/storage';

/**
 * Internal dependencies
 */
import { propsAreEqual } from './utils';
import * as sections from '../libs/base/config';
import type {
	BlockSection,
	BlockSections,
	BlockBaseProps,
	BlockAppContextType,
} from './types';
import { getNormalizedCacheVersion } from '../helpers';
const cacheKeyPrefix = 'BLOCKERA_EDITOR_SETTINGS';

const defaultValue = {
	blockSections: {
		expandAll: false,
		focusMode: false,
		defaultMode: true,
		collapseAll: false,
	},
	sections: {},
};

const BlockAppContext = createContext(defaultValue);

export const BlockAppContextProvider = ({
	children,
	...props
}: Object): MixedElement => {
	const { setBlockAppSettings } = useDispatch('blockera/editor');
	const { blockAppSettings } = useSelect((select) => ({
		blockAppSettings: select('blockera/editor').getBlockAppSettings(),
	}));

	const calculatedSections = useMemo(
		() =>
			Object.fromEntries(
				Object.entries(sections).map(([key, value]) => [
					key,
					{
						initialOpen: value.initialOpen,
					},
				])
			),
		[]
	);

	const currentBlock = useSelect((select) =>
		select('blockera/extensions').getExtensionCurrentBlock()
	);
	const { version, selectedBlockClientId } = useSelect(
		(select) => ({
			selectedBlockClientId:
				select('core/block-editor').getSelectedBlock()?.clientId,
			version: select('blockera/data').getEntity('blockera')?.version,
		}),
		[]
	); // Empty dependency array since we only need this once on mount

	const cacheKey = cacheKeyPrefix + '_' + getNormalizedCacheVersion(version);

	useEffect(() => {
		if (props?.insideBlockInspector) {
			const isEditMode = selectedBlockClientId === props?.clientId;

			if (!isEditMode) {
				return;
			}
		}

		const cacheData = getItem(cacheKey);
		const initialState = {
			...defaultValue,
			sections: {
				master: calculatedSections,
				[currentBlock]: calculatedSections,
			},
			focusedSection: 'spacingConfig',
		};

		if (!cacheData) {
			freshItem(cacheKey, cacheKeyPrefix);
			setItem(cacheKey, initialState);
			setBlockAppSettings(initialState);

			return;
		}

		setItem(cacheKey, cacheData);
		setBlockAppSettings(cacheData);
	}, [
		cacheKey,
		currentBlock,
		props?.clientId,
		calculatedSections,
		setBlockAppSettings,
		selectedBlockClientId,
		props?.insideBlockInspector,
	]);

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
