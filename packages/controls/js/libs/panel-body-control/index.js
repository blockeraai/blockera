//@flow
/**
 * External dependencies
 */
import { forwardRef } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';
import { PanelBody as WPPanelBody } from '@wordpress/components';

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

const PanelBodyControl: ComponentType<PanelBodyControlProps> = forwardRef(
	(
		{
			title,
			initialOpen = true,
			isChanged = false,
			isChangedOnStates = false,
			className,
			icon,
			children,
			onToggle,
			scrollAfterOpen = false,
			showPoweredBy = true,
			...props
		}: PanelBodyControlProps,
		ref: Object
	): MixedElement => {
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
				scrollAfterOpen={scrollAfterOpen}
				{...props}
				ref={ref}
			>
				{children}

				{showPoweredBy && <PoweredBy />}
			</WPPanelBody>
		);
	}
);

export default PanelBodyControl;
