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
	isGlobalStylesWrapper = false,
}: {
	clientId: string,
	children: MixedElement,
	isGlobalStylesWrapper?: boolean,
}): Object => {
	const slotName = isGlobalStylesWrapper
		? 'blockera-global-styles-wrapper'
		: 'blockera-styles-wrapper';

	const [entry, setEntry] = useState(null);

	const callback = (entries: Array<IntersectionObserverEntry>) => {
		if (!entries[0]?.target) {
			return;
		}

		if (entries[0].target.querySelector(`#${slotName}`)) {
			return setEntry(entries[0].target.querySelector(`#${slotName}`));
		}

		const blockeraStylesWrapper = document.createElement('div');
		blockeraStylesWrapper.id = slotName;

		if (!entries[0].target.querySelector(`#${slotName}`)) {
			entries[0].target?.append(blockeraStylesWrapper);
		}

		setEntry(entries[0].target.querySelector(`#${slotName}`));
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
