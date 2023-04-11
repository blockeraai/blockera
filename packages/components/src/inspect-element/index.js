/**
 * WordPress dependencies
 */
import { PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Render Inspect of Element.
 *
 * @param {string} title
 * @param {boolean} initialOpen
 * @param {object} children
 * @returns
 */
export default function InspectElement({
	title,
	initialOpen,
	children,
	...props
}) {
	return (
		<div {...props}>
			<InspectorControls>
				<PanelBody title={title} initialOpen={initialOpen}>
					{children}
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
