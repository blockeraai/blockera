// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createRoot } from '@wordpress/element';
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
	const iframeBodyElement: HTMLElement | void = getIframeTag('body');

	if (!iframeBodyElement) {
		return <></>;
	}

	return (
		<Observer
			ancestors={[
				{
					options: {
						root: document.querySelector('body'),
						threshold: 1.0,
					},
					callback(entries: Array<IntersectionObserverEntry>) {
						const slotName = 'blockera-styles-wrapper';

						const blockeraStylesWrapper =
							document.createElement('div');
						blockeraStylesWrapper.id = slotName;

						if (!entries[0].target.querySelector(`#${slotName}`)) {
							entries[0].target?.append(blockeraStylesWrapper);
						}

						const clientStylesWrapper =
							document.createElement('div');
						const blockId = 'block-' + clientId;
						clientStylesWrapper.id = blockId;

						if (
							!entries[0].target.querySelector(
								`#${slotName} #${blockId}`
							)
						) {
							entries[0].target
								.querySelector(`#${slotName}`)
								?.append(clientStylesWrapper);
						}

						if (
							!entries[0].target.querySelector(
								`#${slotName} #${blockId}`
							)
						) {
							return;
						}

						const root = createRoot(
							entries[0].target.querySelector(
								`#${slotName} #${blockId}`
							)
						);

						root.render(
							<SlotFillProvider>
								<Slot name={`${slotName}-${clientId}`} />
								{children}
							</SlotFillProvider>
						);
					},
					target: iframeBodyElement,
				},
			]}
		/>
	);
};
