// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { settings } from '@blockera/editor/js/extensions/libs/block-card/block-states/config';

/**
 * Internal dependencies
 */
import { PopoverCore } from './core';
import { DraggablePopover } from './draggable';
import type { TPopoverProps } from './types';

export default function Popover({
	draggable = true,
	...props
}: TPopoverProps): MixedElement {
	const { getSelectedBlock = () => ({ name: '', clientId: '' }) } =
		select('core/block-editor') || {};
	const { name, clientId } = getSelectedBlock() || {};

	const {
		getActiveInnerState = () => 'normal',
		getActiveMasterState = () => 'normal',
		getExtensionCurrentBlock = () => 'master',
	} = select('blockera/extensions') || {};

	let activeColor = settings[getActiveMasterState(clientId, name)].color;

	if (
		'master' !== getExtensionCurrentBlock() &&
		'normal' === getActiveInnerState(clientId, getExtensionCurrentBlock())
	) {
		activeColor = '#cc0000';
	} else if ('master' !== getExtensionCurrentBlock()) {
		activeColor =
			settings[getActiveInnerState(clientId, getExtensionCurrentBlock())]
				.color;
	}

	useEffect(() => {
		const container = document.querySelector(
			'.components-popover__fallback-container'
		);

		if (container) {
			container.style.setProperty('color', 'inherit');
			container.style.setProperty(
				'--blockera-controls-primary-color',
				activeColor
			);
			container.style.setProperty(
				'--blockera-tab-panel-active-color',
				activeColor
			);
		}
		// eslint-disable-next-line
	}, []);

	return draggable && props?.title ? (
		<DraggablePopover {...props} />
	) : (
		<PopoverCore {...props} />
	);
}
