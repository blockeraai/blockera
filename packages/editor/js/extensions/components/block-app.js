// @flow

/**
 * External dependencies
 */
import {
	useMemo,
	useState,
	useEffect,
	useContext,
	useCallback,
	createContext,
} from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { setItem, getItem, updateItem } from '@blockera/storage';

/**
 * Internal dependencies
 */
import * as sections from '../libs/base/config';
import type { BlockSections, BlockSection, BlockAppContextType } from './types';

const cacheKey = 'BLOCKERA_DATA';

const defaultValue = {
	key: 0,
	blockSections: {
		expandAll: false,
		focusMode: false,
		defaultMode: true,
		collapseAll: false,
	},
	sections: {},
};

const BlockAppContext = createContext(defaultValue);

export const BlockAppContextProvider = ({ children }: Object): MixedElement => {
	const cacheData = useMemo(() => getItem(cacheKey), []);

	const initialState = cacheData
		? cacheData
		: {
				...defaultValue,
				sections: Object.fromEntries(
					Object.entries(sections).map(([key, value]) => [
						key,
						{
							initialOpen: value.initialOpen,
						},
					])
				),
				focusedSection: 'spacingConfig',
		  };

	// Create storage space, to caching native state on local storage.
	if (!cacheData) {
		setItem(cacheKey, initialState);
	}

	const [settings, setSettings] = useState(initialState);

	return (
		<BlockAppContext.Provider
			key={settings.key}
			value={{
				settings,
				setSettings,
			}}
		>
			{children}
		</BlockAppContext.Provider>
	);
};

export const useBlockAppContext = (): BlockAppContextType =>
	useContext(BlockAppContext);

export const useBlockSection = (sectionId: string): BlockSection => {
	const { settings, setSettings } = useBlockAppContext();
	const { key, blockSections, sections, focusedSection } = settings;
	const { collapseAll, focusMode } = blockSections;
	const section = settings.sections[sectionId];
	let { initialOpen } = section;

	if (collapseAll) {
		initialOpen = false;
	} else if (focusMode && focusedSection !== sectionId) {
		initialOpen = false;
	}

	const onToggle = useCallback(
		(isOpen: boolean): void => {
			const _sections: { [key: string]: Object } = {};

			const next: { [key: string]: any } = {
				...settings,
				focusedSection: sectionId,
				...(blockSections.focusMode && Object.values(_sections).length
					? { key: key + 1 }
					: {}),
			};

			if (isOpen) {
				if (blockSections.focusMode && focusedSection !== sectionId) {
					if (focusedSection) {
						next.sections[focusedSection] = {
							...sections[focusedSection],
							initialOpen: false,
						};
					}
				}
			}

			next.sections[sectionId] = {
				...sections[sectionId],
				initialOpen: true,
			};

			// Updating cache ...
			updateItem(cacheKey, next);

			setSettings(next);
		},
		// eslint-disable-next-line
		[sectionId, settings]
	);

	return {
		onToggle,
		initialOpen,
	};
};

export const useBlockSections = (): BlockSections => {
	const { settings, setSettings } = useBlockAppContext();
	const { blockSections, sections, focusedSection } = settings;

	return {
		blockSections,
		updateBlockSections: useCallback(
			(blockSections: Object) => {
				const { expandAll, collapseAll, focusMode, defaultMode } =
					blockSections;

				const _sections: { [key: string]: Object } = {};

				for (const key in sections) {
					const section = sections[key];

					if (expandAll) {
						_sections[key] = {
							...section,
							initialOpen: true,
						};

						continue;
					}

					if (collapseAll) {
						_sections[key] = {
							...section,
							initialOpen: false,
						};

						continue;
					}

					if (focusMode) {
						_sections[key] = {
							...section,
							// Get focused section store api to exclude it form updating process.
							initialOpen: focusedSection === key,
						};

						continue;
					}

					if (defaultMode) {
						_sections[key] = section;
					}
				}

				const next = {
					...settings,
					blockSections: {
						...defaultValue.blockSections,
						focusMode,
					},
					sections: !Object.values(_sections).length
						? settings.sections
						: _sections,
					key: settings.key + 1,
				};

				// Updating cache ...
				updateItem(cacheKey, next);

				// Update native state of BlockAppContextProvider component.
				setSettings(next);
			},
			// eslint-disable-next-line
			[settings]
		),
	};
};

export const BlockApp = ({ onClick, children }: Object): MixedElement => {
	useEffect(() => {
		// Add event listener to the document
		document.addEventListener('click', onClick);

		// Clean up the event listener on unmount
		return () => {
			document.removeEventListener('click', onClick);
		};
	}, [onClick]);

	return <BlockAppContextProvider>{children}</BlockAppContextProvider>;
};
