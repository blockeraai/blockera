/**
 * WordPress dependencies
 */
import { PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

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
