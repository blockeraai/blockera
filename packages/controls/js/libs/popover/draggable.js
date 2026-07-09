// @flow
/**
 * External dependencies
 */
import { useState, useRef, useEffect } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { PopoverCore } from './core';
import type { TPopoverProps } from './types';

export function DraggablePopover(props: TPopoverProps): MixedElement {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const lastMousePos = useRef({ x: 0, y: 0 });
	const headerRef = useRef(null);
	const popoverRef = useRef(null);

	useEffect(() => {
		const header = headerRef.current;
		if (!header) return;

		const handleMouseDown = (e: MouseEvent) => {
			setIsDragging(true);
			lastMousePos.current = { x: e.clientX, y: e.clientY };
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging) return;

			const deltaX = e.clientX - lastMousePos.current.x;
			const deltaY = e.clientY - lastMousePos.current.y;

			setPosition((prev) => ({
				x: prev.x + deltaX,
				y: prev.y + deltaY,
			}));

			lastMousePos.current = { x: e.clientX, y: e.clientY };
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		header.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			header.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, position]);

	useEffect(() => {
		if (popoverRef.current) {
			const content = popoverRef.current.querySelector(
				'.components-popover__content'
			);
			if (content) {
				const transform = `translate(${position.x}px, ${position.y}px)`;
				content.style.transform = transform;
				content.style.position = 'relative';
				content.style.zIndex = '100';
				content.style.willChange = 'transform';
			}
		}
	}, [position]);

	return (
		<PopoverCore
			{...props}
			className={(props?.className || '') + ' is-draggable'}
			ref={popoverRef}
			headerRef={headerRef}
		/>
	);
}
