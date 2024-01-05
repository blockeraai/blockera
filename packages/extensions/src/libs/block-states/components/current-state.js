// @flow

/**
 * External dependencies
 */
import { createRoot, useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { getIcon, Icon } from '@publisher/components';

/**
 * Internal dependencies
 */
import { settings } from '../config';
import type { StateTypes } from '../types';

export function CurrentState({ state }: { state: StateTypes }): null {
	const renderCurrentState = (element: HTMLElement) => {
		const wrapper = document.querySelector('.publisher-current-state');

		if (!wrapper) {
			const wrapper = document.createElement('div');

			wrapper.setAttribute('aria-label', state.label);
			wrapper.classList.add('publisher-current-state');
			wrapper.setAttribute('aria-label', 'Block Current State');
			wrapper.style.setProperty('background', settings[state.type].color);

			const separator = document.querySelector('.publisher-arrow-right');

			if (separator) {
				element = separator;
			}

			element.after(wrapper);

			const root = createRoot(wrapper);

			root.render(state.label);

			if (separator) {
				return;
			}

			const arrow = document.createElement('div');
			arrow.classList.add('publisher-arrow-right');

			const arrowRoot = createRoot(arrow);

			arrowRoot.render(
				<Icon
					library={'wp'}
					icon={getIcon('chevronRight', 'wp')}
					size={16}
					style={{
						top: '3px',
						margin: '0',
						position: 'relative',
						transition: 'all 0.1s',
					}}
				/>
			);

			wrapper.before(arrow);

			return;
		}

		wrapper.textContent = state.label;
		wrapper.style.setProperty('background', settings[state.type].color);
	};

	useEffect(() => {
		const inspector: HTMLElement | null = document.querySelector(
			'.block-editor-block-inspector'
		);

		if (null === inspector) {
			return undefined;
		}

		if ('normal' !== state.type) {
			inspector
				.querySelectorAll('.components-panel__body')
				?.forEach((panel) => {
					if (panel.classList.contains('publisher-control')) {
						return;
					}

					panel.classList.add('publisher-not-allowed');

					panel
						.querySelector('.components-panel__body-toggle')
						?.style.setProperty('pointer-events', 'none');
				});
		} else {
			inspector
				.querySelectorAll('.components-panel__body')
				?.forEach((panel) => {
					if (panel.classList.contains('publisher-control')) {
						return;
					}

					panel
						.querySelector('.components-panel__body-toggle')
						?.style.removeProperty('pointer-events');
					panel.classList.remove('publisher-not-allowed');
				});
		}

		const title = inspector.querySelector(
			'.block-editor-block-card__title'
		);

		const card = inspector.querySelector(
			'.block-editor-block-card__content'
		);

		const description = inspector.querySelector(
			'.block-editor-block-card__description'
		);

		if (!title || !card || !description) {
			return undefined;
		}

		const previousState: HTMLElement | null = document.querySelector(
			'.publisher-current-state'
		);
		const separator: HTMLElement | null = document.querySelector(
			'.publisher-arrow-right'
		);

		if (null !== previousState || null !== separator) {
			renderCurrentState(title);

			return undefined;
		}

		title.style.setProperty('display', 'inline-block');

		description.style.setProperty('display', 'block');
		description.style.setProperty('display', 'block');
		description.style.setProperty('margin', '4px 0 0');
		description.style.setProperty('line-height', '24px');

		renderCurrentState(title);

		return undefined;
		// eslint-disable-next-line
	}, [state]);

	return null;
}
