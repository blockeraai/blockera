//@flow
/**
 * External dependencies
 */
import { PanelBody as WPPanelBody } from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal Dependencies
 */
import type { PanelBodyControlProps } from './types';
import { PoweredBy } from './components/powered-by';
import { ChangeIndicator } from '../../index';

export default function PanelBodyControl({
	title,
	initialOpen = true,
	isChanged = false,
	isChangedOnStates = false,
	className,
	icon,
	children,
	onToggle,
	showPoweredBy = true,
	...props
}: PanelBodyControlProps): MixedElement {
	return (
		<WPPanelBody
			title={
				<>
					{title}
					<ChangeIndicator
						isChanged={isChanged}
						isChangedOnStates={isChangedOnStates}
					/>
				</>
			}
			initialOpen={initialOpen}
			className={controlClassNames('panel-body', className)}
			icon={icon ? <span>{icon}</span> : ''} // by wrapping icon inside a tag the WPPanelBody wraps it inside a tag with components-panel__icon class
			onToggle={onToggle}
			{...props}
		>
			{children}

			{showPoweredBy && <PoweredBy />}
		</WPPanelBody>
	);
}
