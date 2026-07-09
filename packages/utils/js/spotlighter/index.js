// @flow

/**
 * External dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import type { Options, Target } from './types';

/**
 * Spotlight the first `targetSel` element inside `parentSel`.
 * The container becomes non-scrollable; overlay blocks events unless
 * `passThrough`.  `onClickOutside` fires for clicks outside the child.
 */
export function Spotlighter(
	parentSel: string,
	target: Target,
	{
		color = '#000',
		opacity = 0.9,
		padding = 0,
		radius = 0,
		passThrough = false,
		active = true,
		onClickOutside,
	}: Options = {}
): void {
	const svgRef = useRef(null);
	const maskIdRef = useRef('');

	/* helper to fully remove SVG & restore parent styles */
	const cleanup = () => {
		const svg = svgRef.current;
		if (!svg) return;
		const parent = svg.parentNode;
		if (parent instanceof HTMLElement) {
			parent.style.overflow = (svg: any)._prevOverflow;
			parent.style.touchAction = (svg: any)._prevTouch;
			parent.style.position = (svg: any)._prevPosition;
			parent.removeEventListener('click', outsideHandler, true);
		}
		svg.remove();
		svgRef.current = null;
	};

	/* click handler defined once so we can deregister */
	function outsideHandler(ev: MouseEvent) {
		if (!onClickOutside) return;
		const parent = svgRef.current?.parentNode;
		if (!(parent instanceof HTMLElement)) return;

		const child =
			typeof target === 'string'
				? parent.querySelector(target)
				: target.current;

		if (!child) return;

		// If click was inside spotlighted child, do nothing
		if (child.contains((ev.target: any))) return;

		// Otherwise it was on dimmed area (or overlay); fire callback
		onClickOutside(ev);
	}

	useEffect(() => {
		/* deactivate → just clean & exit */
		if (!active) {
			cleanup();
			return;
		}

		const parent = (document.querySelector(parentSel): any);

		if (!parent) {
			if (process.env.NODE_ENV !== 'production') {
				/* @debug-ignore */
				console.warn(
					`useSpotlightMaskBySelector: "${parentSel}" not found`
				);
			}
			return;
		}

		/* ─── freeze container ─── */
		const prevPos = parent.style.position || 'static';
		const prevOverflow = parent.style.overflow;
		const prevTouch = parent.style.touchAction;

		if (prevPos === 'static') parent.style.position = 'relative';
		parent.style.overflow = 'hidden';
		parent.style.touchAction = 'none';

		/* ─── SVG overlay ─── */
		const NS = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(NS, 'svg');
		svg.setAttribute('class', 'blockera-spotlighter-svg');
		svg.setAttribute('width', '100%');
		svg.setAttribute('height', '100%');
		(svg: any).style.cssText = `
			position:absolute;
			inset:0;
			overflow:visible;
			z-index:100;
			pointer-events:${passThrough ? 'none' : 'auto'};
		`;

		// stash for cleanup
		(svg: any)._prevPosition = prevPos;
		(svg: any)._prevOverflow = prevOverflow;
		(svg: any)._prevTouch = prevTouch;

		const defs = document.createElementNS(NS, 'defs');
		const mask = document.createElementNS(NS, 'mask');
		maskIdRef.current = `spotlight-${Math.random().toString(36).slice(2)}`;
		mask.setAttribute('id', maskIdRef.current);

		const full = document.createElementNS(NS, 'rect');
		full.setAttribute('width', '100%');
		full.setAttribute('height', '100%');
		full.setAttribute('fill', 'white');

		const hole = document.createElementNS(NS, 'rect');
		hole.setAttribute('fill', 'black');
		mask.append(full, hole);
		defs.append(mask);

		const overlay = document.createElementNS(NS, 'rect');
		overlay.setAttribute('width', '100%');
		overlay.setAttribute('height', '100%');
		overlay.setAttribute('fill', color);
		overlay.setAttribute('opacity', String(opacity));
		overlay.setAttribute('mask', `url(#${maskIdRef.current})`);

		svg.append(defs, overlay);
		parent.appendChild(svg);
		svgRef.current = svg;

		/* ─── update geometry ─── */
		const update = () => {
			const targetEl =
				typeof target === 'string'
					? parent.querySelector(target)
					: target.current;

			if (!targetEl) return;

			const p = parent.getBoundingClientRect();
			const t = targetEl.getBoundingClientRect();

			// Ensure pixel-perfect calculations by rounding to nearest integer
			const x = Math.round(t.left - p.left - padding);
			const y = Math.round(t.top - p.top - padding);
			const width = Math.round(t.width + padding * 2);
			const height = Math.round(t.height + padding * 2);

			hole.setAttribute('x', String(x));
			hole.setAttribute('y', String(y));
			hole.setAttribute('width', String(width));
			hole.setAttribute('height', String(height));
			hole.setAttribute('rx', String(radius));
			hole.setAttribute('ry', String(radius));
		};

		update();
		const ro = new ResizeObserver(update);
		ro.observe(parent);

		if (typeof target === 'string') {
			parent.querySelectorAll(target).forEach((el) => ro.observe(el));
		} else if (target.current) {
			ro.observe(target.current);
		}

		window.addEventListener('scroll', update, true);

		/* ─── outside-click listener ─── */
		if (onClickOutside)
			parent.addEventListener('click', outsideHandler, true);

		/* ─── cleanup ─── */
		return () => {
			ro.disconnect();
			window.removeEventListener('scroll', update, true);
			cleanup();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		parentSel,
		target,
		color,
		opacity,
		padding,
		radius,
		passThrough,
		active,
		onClickOutside,
	]);
}
