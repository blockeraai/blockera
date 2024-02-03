//@flow
/**
 * External dependencies
 */
import { PanelBody as WPPanelBody } from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal Dependencies
 */
import type { PanelBodyControlProps } from './types';

export default function PanelBodyControl({
	title,
	initialOpen = true,
	className,
	icon,
	children,
	onToggle,
	...props
}: PanelBodyControlProps): MixedElement {
	return (
		<WPPanelBody
			title={title}
			initialOpen={initialOpen}
			className={controlClassNames('panel-body', className)}
			icon={icon ? <span>{icon}</span> : ''} // by wrapping icon inside a tag the WPPanelBody wraps it inside a tag with components-panel__icon class
			onToggle={onToggle}
			{...props}
		>
			{children}
		</WPPanelBody>
	);
}
