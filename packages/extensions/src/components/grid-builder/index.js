// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createPortal, useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Button } from '@publisher/components';

/**
 * Internal dependencies
 */
import type { GridBuilderProps } from './types';
import { useBlockContext } from '../../hooks';
import { VirtualGrid } from './components';
import EditGridIcon from './icons/edit-grid';

export const GridBuilder = ({
	children,
	block,
}: GridBuilderProps): MixedElement | null => {
	const { isOpenGridBuilder, getAttributes, setOpenGridBuilder } =
		useBlockContext();

	const selectedBlock = document
		.querySelector('iframe[name="editor-canvas"]')
		// $FlowFixMe
		?.contentDocument?.body?.querySelector(`#block-${block.clientId}`);

	useEffect(() => {
		if (selectedBlock) {
			if (!isOpenGridBuilder) {
				selectedBlock.style.visibility = 'visible';
			} else {
				selectedBlock.style.visibility = 'hidden';
			}

			return () => (selectedBlock.style.visibility = 'visible');
		}
	}, [isOpenGridBuilder]);

	const { publisherWidth, publisherHeight } = getAttributes();

	if (!isOpenGridBuilder) {
		return null;
	}

	const elementStyles = getComputedStyle(selectedBlock);

	return createPortal(
		<div
			style={{
				width: publisherWidth || elementStyles.width,
				height: publisherHeight || elementStyles.height,
				position: 'absolute',
				top: elementStyles.marginTop,
				left: elementStyles.marginLeft,
			}}
		>
			<VirtualGrid block={block} />
			{children}
			<div className="close-builder">
				<EditGridIcon />
				<span className="text">Editing Grid</span>
				<Button
					size="extra-small"
					className="btn"
					onClick={() => setOpenGridBuilder(false)}
				>
					Done
				</Button>
			</div>
		</div>,
		document
			.querySelector('iframe[name="editor-canvas"]')
			//$FlowFixMe
			?.contentDocument?.body?.querySelector(
				`div:has(#block-${block.clientId})`
			)
	);
};
