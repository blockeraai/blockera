// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
import { useEffect, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { sharedListenerCallback } from './listener-callback';
import { BlockIcon } from '../../extensions/components/block-icon';

const getBlockTypeSelector = (blockName: string): string => {
	return `button[id="/blocks/${blockName.replace('/', '%2F')}"]`;
};

export const AddBlockTypeIcons = ({
	blockTypes,
}: {
	blockTypes: Array<Object>,
}): Array<MixedElement> => {
	const {
		setSelectedBlockRef,
		setSelectedBlockStyle,
		setStyleVariationBlocks,
	} = dispatch('blockera/editor');
	const { getBlockStyles } = select('core/blocks');

	useEffect(() => {
		document
			.querySelector('button[aria-controls="edit-site:global-styles"]')
			?.addEventListener('click', () => {
				setSelectedBlockRef(undefined);
			});

		document
			.querySelector(
				'.editor-header__settings button[aria-controls="edit-site:global-styles"]'
			)
			?.addEventListener('click', () => {
				setSelectedBlockStyle('');
			});

		blockTypes.forEach((blockType) => {
			const blockElement = document.querySelector(
				getBlockTypeSelector(blockType.name)
			);
			blockElement?.addEventListener('click', () =>
				sharedListenerCallback(blockType.name)
			);

			const blockStyles = getBlockStyles(blockType.name) || [];

			blockStyles.forEach((blockStyle) => {
				setStyleVariationBlocks(blockStyle.name, [blockType.name]);
			});
		});
	}, [
		blockTypes,
		getBlockStyles,
		setSelectedBlockRef,
		setSelectedBlockStyle,
		setStyleVariationBlocks,
	]);

	return blockTypes.map((blockType, index) => {
		if (!blockType.attributes?.blockeraPropsId) {
			return <></>;
		}

		const blockElement = document.querySelector(
			getBlockTypeSelector(blockType.name)
		);

		if (!blockElement) {
			return <></>;
		}

		return createPortal(
			<span
				className="blockera-block-icon-wrapper"
				key={index + '-block-icon'}
			>
				<BlockIcon name={blockType.name} />
			</span>,
			blockElement
		);
	});
};

export const sidebarSelector: string = '.edit-site-block-types-search';
