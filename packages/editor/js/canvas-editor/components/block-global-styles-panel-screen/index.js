// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { getBlockType } from '@wordpress/blocks';
import { select, dispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useState, useMemo, useEffect, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import App from './app';
import { useBackButton } from './hooks';
import { STORE_NAME } from '../../../store';
import { unsubscribe } from './subscribe-unsubscribe';

unsubscribe();

export const BlockGlobalStylesPanelScreen = ({
	screen,
}: {
	screen: string,
}): MixedElement => {
	const className = 'blockera-extensions-wrapper';
	const { getBlocks, getSelectedBlock } = select(blockEditorStore);
	const { getSelectedBlockStyle, getSelectedBlockRef } = select(STORE_NAME);
	const {
		setSelectedBlockRef,
		setSelectedBlockStyle,
		setSelectedBlockStyleVariation,
	} = dispatch(STORE_NAME);

	const blocks = getBlocks();
	const selectedBlock = getSelectedBlock();
	const selectedBlockRef = getSelectedBlockRef();
	const selectedBlockStyle = getSelectedBlockStyle();
	const [blockType, setBlockType] = useState(
		getBlockType(selectedBlockStyle)
	);
	const screenElement = document.querySelector(screen);
	const hasBlockeraExtensions = blockType?.attributes?.blockeraPropsId;

	useBackButton({
		screenElement,
		setSelectedBlockRef,
		setSelectedBlockStyle,
		setSelectedBlockStyleVariation,
	});

	const memoizedSelectedBlock = useMemo(() => {
		// Prevent of expensive calculation if selected block is already set.
		if (selectedBlock) {
			return selectedBlock;
		}

		// Find block with matching name and get its clientId
		let matchingBlock = blocks.find(
			(block) => block.name === selectedBlockStyle
		);

		// If no direct match found, search through innerBlocks
		if (!matchingBlock) {
			const findInInnerBlocks = (blockList) => {
				for (const block of blockList) {
					if (block.name === selectedBlockStyle) {
						return block;
					}
					if (block.innerBlocks?.length) {
						const found = findInInnerBlocks(block.innerBlocks);
						if (found) return found;
					}
				}
				return null;
			};
			matchingBlock = findInInnerBlocks(blocks);
		}

		if (matchingBlock && !selectedBlock) {
			return matchingBlock;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBlockStyle, selectedBlock, blocks]);

	useEffect(() => {
		if ('edit-site/global-styles' === selectedBlockRef) {
			return;
		}

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
	}, [selectedBlockRef, selectedBlock, selectedBlockStyle]);

	useEffect(() => {
		if (!hasBlockeraExtensions && selectedBlockStyle) {
			screenElement.classList.remove('has-blockera-extensions');
			screenElement.classList.add('has-not-blockera-extensions');
		}

		return () => screenElement.removeChild(`.${className}`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBlockStyle, hasBlockeraExtensions]);

	if (!hasBlockeraExtensions) {
		return <></>;
	}

	if (
		selectedBlockStyle &&
		selectedBlock &&
		selectedBlock?.name !== selectedBlockStyle &&
		'edit-site/global-styles' !== selectedBlockRef
	) {
		return <></>;
	}

	screenElement.classList.add('has-blockera-extensions');

	if (screenElement.querySelector(`.${className}`)) {
		return <></>;
	}

	return createPortal(
		<div className={className}>
			<App
				{...{
					...(selectedBlock ? { ...selectedBlock } : {}),
					...(memoizedSelectedBlock
						? { ...memoizedSelectedBlock }
						: {}),
				}}
				blockType={blockType}
			/>
		</div>,
		screenElement
	);
};
