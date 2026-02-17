// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createContext, useContext } from '@wordpress/element';

/**
 * Style Item Menu Context
 *
 * Provides shared state for StyleItemMenu (context menu, modals, handlers).
 * Reduces the ~20+ props passed to StyleItemMenu.
 */
export const StyleItemMenuContext: Object = createContext({
	blockTitle: '',
	style: {},
	counter: 0,
	handlePromotionPopover: () => {},
	isOpenDeleteModal: false,
	setIsOpenDeleteModal: () => {},
	isOpenDuplicateModal: false,
	setIsOpenDuplicateModal: () => {},
	blockName: '',
	setCounter: () => {},
	buttonText: '',
	handleOnRename: () => {},
	handleOnDuplicate: () => {},
	handleOnClearAllCustomizations: () => {},
	handleOnEnable: () => {},
	handleOnDelete: () => {},
	handleOnUsageForMultipleBlocks: () => {},
	isConfirmedChangeID: '',
	setIsOpenUsageForMultipleBlocks: () => {},
	isOpenUsageForMultipleBlocks: false,
	setIsConfirmedChangeID: () => {},
	cachedStyle: {},
	isOpenRenameModal: false,
	setIsOpenRenameModal: () => {},
	isOpenContextMenu: false,
	setIsOpenContextMenu: () => {},
	setCurrentBlockStyleVariation: () => {},
	blockStyles: [],
});

export const useStyleItemMenuContext = (): Object => {
	const context = useContext(StyleItemMenuContext);
	if (!context) {
		throw new Error(
			'useStyleItemMenuContext must be used within StyleItemMenuContextProvider'
		);
	}
	return context;
};

export const StyleItemMenuContextProvider = ({
	children,
	value,
}: {
	children: Object,
	value: Object,
}): MixedElement => (
	<StyleItemMenuContext.Provider value={value}>
		{children}
	</StyleItemMenuContext.Provider>
);
