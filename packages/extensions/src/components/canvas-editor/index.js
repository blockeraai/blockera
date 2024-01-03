// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useEffect, useRef, createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Breakpoints } from './components';

export const CanvasEditor = (): null => {
	const ref = useRef(null);
	const { getSelectedBlock } = select('core/block-editor');
	const selectedBlock = getSelectedBlock();

	const identifier = 'publisher-core-canvas-editor';

	useEffect(() => {
		const className = 'publisher-core-canvas-breakpoints';

		const toolbar = document.querySelector('div[aria-label="Block tools"]');

		if (toolbar) {
			toolbar.style.width = 'calc(100% - 75%)';
		}

		if (ref.current?.rootElement?.querySelector(`#${identifier}`)) {
			ref.current?.rootElement.querySelector(`#${identifier}`).remove();
		}

		ref.current = {
			rootElement:
				document.querySelector(
					'div[aria-label="Editor top bar"] .edit-post-header__center'
				) || document.querySelector('div[role="toolbar"]'),
			previewElement: document.querySelector('a[aria-label="View Post"]'),
			dropDownPreview: document.querySelector(
				'div.block-editor-post-preview__dropdown'
			),
		};

		const wrapper = document.createElement('div');
		wrapper.id = identifier;

		const root = createRoot(wrapper);

		root.render(<Breakpoints className={className} refId={ref} />);

		ref.current.rootElement.append(wrapper);

		ref.current.previewElement.style.display = 'none';
		ref.current.dropDownPreview.style.display = 'none';
	}, [selectedBlock]);

	return null;
};
