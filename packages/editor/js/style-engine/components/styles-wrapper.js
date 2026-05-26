// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useState, useEffect, createPortal } from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { getIframeTag } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { Observer } from '../../observer';

export const StylesWrapper = ({
	children,
	clientId,
}: {
	clientId: string,
	children: MixedElement,
}): Object => {
	const slotName = 'blockera-styles-wrapper';
	const blockId = 'block-styles-' + clientId;

	const [entry, setEntry] = useState(null);

	const callback = (entries: Array<IntersectionObserverEntry>) => {
		if (!entries[0]?.target) {
			return;
		}

		const blockeraStylesWrapper = document.createElement('div');
		blockeraStylesWrapper.id = slotName;

		if (!entries[0].target.querySelector(`#${slotName}`)) {
			entries[0].target?.append(blockeraStylesWrapper);
		}

		const clientStylesWrapper = document.createElement('div');
		clientStylesWrapper.id = blockId;

		if (!entries[0].target.querySelector(`#${slotName} #${blockId}`)) {
			entries[0].target
				.querySelector(`#${slotName}`)
				?.append(clientStylesWrapper);
		}

		if (!entries[0].target.querySelector(`#${slotName} #${blockId}`)) {
			return;
		}

		setEntry(entries[0].target.querySelector(`#${slotName} #${blockId}`));
	};

	useEffect(() => {
		// $FlowFixMe
		callback([
			// $FlowFixMe
			{
				target:
					getIframeTag('body') ||
					document.querySelector(
						'.interface-navigable-region.interface-interface-skeleton__content'
					),
			},
		]);
		// eslint-disable-next-line
	}, []);

	if (!entry) {
		return <></>;
	}

	const iframeBodyElement: HTMLElement | void = getIframeTag('body');

	return (
		<Observer
			ancestors={[
				{
					options: {
						root: document.querySelector('body'),
						threshold: 1.0,
					},
					callback,
					target: iframeBodyElement,
				},
			]}
		>
			{entry &&
				createPortal(
					<SlotFillProvider>
						<Slot name={`${slotName}-${clientId}`} />
						{children}
					</SlotFillProvider>,
					entry
				)}
		</Observer>
	);
};
