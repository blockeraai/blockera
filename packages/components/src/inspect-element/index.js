/**
 * WordPress dependencies
 */
import { PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * Render Inspect of Element.
 *
 * @param {string} title
 * @param titleIcon
 * @param {boolean} initialOpen
 * @param {Object} children
 * @param className
 * @param props
 * @return
 */
export default function InspectElement({
	title,
	icon,
	initialOpen,
	children,
	className = '',
	...props
}) {
	return (
		<div {...props}>
			<InspectorControls>
				<PanelBody
					title={title}
					initialOpen={initialOpen}
					className={className}
					icon={icon}
				>
					{children}
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
