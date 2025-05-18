// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import type { MixedElement } from 'react';

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
	const { getState } = select('blockera/editor') || {
		getState: () => ({ settings: { color: '#cc0000' } }),
	};

	let activeColor = getState(getActiveMasterState(clientId, name))?.settings
		?.color;

	if (
		'master' !== getExtensionCurrentBlock() &&
		'normal' === getActiveInnerState(clientId, getExtensionCurrentBlock())
	) {
		activeColor = '#cc0000';
	} else if ('master' !== getExtensionCurrentBlock()) {
		activeColor = getState(
			getActiveInnerState(clientId, getExtensionCurrentBlock())
		)?.settings?.color;
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
