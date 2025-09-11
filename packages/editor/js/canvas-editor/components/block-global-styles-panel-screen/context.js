// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { createContext, useContext } from '@wordpress/element';

export const GlobalStylesPanelContext = createContext({
	currentBlockStyleVariation: {
		name: '',
		label: '',
	},
	setCurrentBlockStyleVariation: () => {},
});

export const GlobalStylesPanelContextProvider = ({
	children,
	...props
}: Object): MixedElement => {
	return (
		<GlobalStylesPanelContext.Provider value={props}>
			{children}
		</GlobalStylesPanelContext.Provider>
	);
};

export const useGlobalStylesPanelContext = () => {
	const contextReceivedValue = useContext(GlobalStylesPanelContext);

	const { getEditorSettings } = select(editorStore);
	const { updateEditorSettings } = dispatch(editorStore);

	return {
		...contextReceivedValue,
		updateEditorSettings,
		getEditorSettings,
	};
};
