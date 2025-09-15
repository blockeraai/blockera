// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { getBlockType } from '@wordpress/blocks';
import { select, dispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useState, useEffect, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import App from './app';
import { useBackButton } from './hooks';
import { STORE_NAME } from '../../../store';
import { unsubscribe } from './subscribe-unsubscribe';

export const BlockGlobalStylesPanelScreen = ({
	screen,
}: {
	screen: string,
}): MixedElement => {
	unsubscribe();

	const className = 'blockera-extensions-wrapper';

	const { getSelectedBlock } = select(blockEditorStore);
	const { getSelectedBlockStyle } = select(STORE_NAME);
	const { setSelectedBlockStyle, setSelectedBlockStyleVariation } =
		dispatch(STORE_NAME);
	const selectedBlock = getSelectedBlock();
	const selectedBlockStyle = getSelectedBlockStyle();
	const [blockType, setBlockType] = useState(
		getBlockType(selectedBlockStyle)
	);
	const screenElement = document.querySelector(screen);
	const hasBlockeraExtensions = blockType?.attributes?.blockeraPropsId;

	useBackButton({
		screenElement,
		setSelectedBlockStyle,
		setSelectedBlockStyleVariation,
	});

	useEffect(() => {
		if (
			(!selectedBlockStyle && selectedBlock) ||
			(selectedBlockStyle &&
				selectedBlock &&
				selectedBlock?.name !== selectedBlockStyle)
		) {
			setBlockType(getBlockType(selectedBlock?.name));
			setSelectedBlockStyle(selectedBlock?.name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBlock, selectedBlockStyle]);

	useEffect(() => {
		if (!hasBlockeraExtensions && selectedBlockStyle) {
			screenElement.classList.remove('has-blockera-extensions');
			screenElement.classList.add('has-not-blockera-extensions');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBlockStyle, hasBlockeraExtensions]);

	if (!hasBlockeraExtensions) {
		return <></>;
	}

	if (
		selectedBlockStyle &&
		selectedBlock &&
		selectedBlock?.name !== selectedBlockStyle
	) {
		return <></>;
	}

	screenElement.classList.add('has-blockera-extensions');

	return createPortal(
		<div className={className}>
			<App blockType={blockType} />
		</div>,
		screenElement
	);
};
