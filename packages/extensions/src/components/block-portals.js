// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { Slot } from '@wordpress/components';
import { createPortal, useEffect, useRef, useState } from '@wordpress/element';
import type { BlockPortalsProps } from './types';

export const BlockPortals = ({
	slots,
	blockId,
	mainSlot,
	container = 'iframe[name="editor-canvas"]',
}: BlockPortalsProps): MixedElement => {
	const [isLoaded, setIsLoaded] = useState(false);
	const ref = useRef(document.querySelector(container));

	useEffect(() => {
		const handleWindowLoad = () => {
			setIsLoaded(true);
		};

		const currentRef = ref.current;

		currentRef.contentWindow.addEventListener('load', handleWindowLoad);

		// Cleanup function to remove the event listener to prevent maximum update!
		return () => {
			currentRef.contentWindow.removeEventListener(
				'load',
				handleWindowLoad
			);
		};
	}, []);

	if (!isLoaded) {
		return <></>;
	}

	const querySelector = (_selector: string): null | HTMLElement => {
		return ref.current.contentDocument.body.querySelector(_selector);
	};

	const MappedPortals = () => {
		return Object.values(slots).map((_selector) => {
			const containerElement = querySelector(_selector);

			if (!containerElement) {
				return <></>;
			}

			return createPortal(<Slot name={_selector} />, containerElement);
		});
	};

	const targetElement = blockId ? querySelector(blockId) : null;

	return (
		<>
			<MappedPortals />
			{mainSlot &&
				targetElement &&
				createPortal(
					<>
						<Slot name={mainSlot} />
					</>,
					targetElement
				)}
		</>
	);
};
