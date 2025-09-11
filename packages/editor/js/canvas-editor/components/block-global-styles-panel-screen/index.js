// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { getBlockType } from '@wordpress/blocks';
import { select, dispatch } from '@wordpress/data';
import { useEffect, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import App from './app';
import { useBackButton } from './hooks';
import { STORE_NAME } from '../../../store';

export const BlockGlobalStylesPanelScreen = ({
	screen,
}: {
	screen: string,
}): MixedElement => {
	const className = 'blockera-extensions-wrapper';

	const { getSelectedBlockStyle } = select(STORE_NAME);
	const { setSelectedBlockStyle } = dispatch(STORE_NAME);
	const { getSelectedBlock } = select('core/block-editor');
	let selectedBlockStyle = getSelectedBlockStyle();

	if (!selectedBlockStyle && getSelectedBlock()) {
		selectedBlockStyle = getSelectedBlock().name;
	}

	const blockType = getBlockType(selectedBlockStyle);

	const screenElement = document.querySelector(screen);
	const hasBlockeraExtensions = blockType?.attributes?.blockeraPropsId;

	useBackButton({
		screenElement,
		setSelectedBlockStyle,
	});

	useEffect(() => {
		if (!hasBlockeraExtensions && selectedBlockStyle) {
			screenElement.classList.remove('has-blockera-extensions');
			screenElement.classList.add('has-not-blockera-extensions');
		}

		return () => screenElement.removeChild(`.${className}`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!hasBlockeraExtensions) {
		return <></>;
	}

	screenElement.classList.add('has-blockera-extensions');

	if (screenElement.querySelector(`.${className}`)) {
		return <></>;
	}

	return createPortal(
		<div className={className}>
			<App blockType={blockType} />
		</div>,
		screenElement
	);
};
