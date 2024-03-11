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
import type { TGridBuilderProps } from './types';
import { useBlockContext } from '../../hooks';
import { VirtualGrid } from './components';
import EditGridIcon from './icons/edit-grid';

export const GridBuilder = ({
	children,
	block,
}: TGridBuilderProps): MixedElement | null => {
	const { isOpenGridBuilder, setOpenGridBuilder } = useBlockContext();

	const selectedBlock: HTMLElement | any =
		document
			.querySelector('iframe[name="editor-canvas"]')
			// $FlowFixMe
			?.contentDocument?.body?.querySelector(
				`#block-${block.clientId}`
			) || document.querySelector(`#block-${block.clientId}`);

	const selectedBlockChildren =
		document
			.querySelector('iframe[name="editor-canvas"]')
			// $FlowFixMe
			?.contentDocument?.body?.querySelectorAll(
				`#block-${block.clientId} *`
			) || document.querySelectorAll(`#block-${block.clientId} *`);

	useEffect(() => {
		if (selectedBlock) {
			if (!isOpenGridBuilder) {
				selectedBlockChildren.forEach(
					(child) => (child.style.visibility = 'initial')
				);
				selectedBlock.style.position = 'initial';
				selectedBlock.style.visibility = 'initial';
				selectedBlock.setAttribute('contenteditable', 'true');
			} else {
				selectedBlockChildren.forEach(
					(child) => (child.style.visibility = 'hidden')
				);
				selectedBlock.style.position = 'relative';
				selectedBlock.style.visibility = 'hidden';
				selectedBlock.setAttribute('contenteditable', 'false');
			}
		}
	}, [isOpenGridBuilder]);

	useEffect(() => {
		return () => {
			selectedBlockChildren.forEach(
				(child) => (child.style.visibility = 'initial')
			);
			selectedBlock.setAttribute('contenteditable', 'true');
			selectedBlock.style.position = 'initial';
			selectedBlock.style.visibility = 'initial';
		};
	}, []);

	if (!isOpenGridBuilder || !selectedBlock) {
		return null;
	}

	return createPortal(
		<div
			style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				visibility: 'visible',
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
				`#block-${block.clientId}`
			) || document.querySelector(`#block-${block.clientId}`)
	);
};
