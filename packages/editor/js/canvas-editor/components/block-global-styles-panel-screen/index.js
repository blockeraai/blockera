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

	const screenElement = document.querySelector(screen);
	const hasBlockeraExtensions = getBlockType(getSelectedBlockStyle())
		?.attributes?.blockeraPropsId;

	useBackButton({
		screenElement,
		setSelectedBlockStyle,
	});

	useEffect(() => {
		if (!hasBlockeraExtensions) {
			screenElement.classList.remove('has-blockera-extensions');
			screenElement.classList.add('has-not-blockera-extensions');
		}

		return () => screenElement.removeChild(`.${className}`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!hasBlockeraExtensions) {
		return;
	}

	screenElement.classList.add('has-blockera-extensions');

	if (screenElement.querySelector(`.${className}`)) {
		return;
	}

	return createPortal(
		<div className={className}>
			<App
				name={getSelectedBlockStyle()}
				clientId={Math.random().toString(36).substr(2, 9)}
			/>
		</div>,
		screenElement
	);
};
