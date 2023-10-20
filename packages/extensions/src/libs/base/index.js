/**
 * External dependencies
 */
import { useContext, memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isObject } from '@publisher/utils';
import { componentClassNames } from '@publisher/classnames';
import { PanelBodyControl, STORE_NAME } from '@publisher/controls';

/**
 * Internal dependencies
 */
import * as extensions from '../';
import * as config from './config';
import { SideEffect } from './components/side-effect';
import { useDisplayBlockControls } from '../../hooks/hooks';
import { BaseExtensionContextProvider, BaseExtensionContext } from './context';

export const BaseExtension = memo(
	({
		title,
		icon,
		children,
		clientId,
		supports,
		blockName,
		attributes,
		extensionId,
		initialOpen,
		storeName = STORE_NAME,
		...props
	}) => {
		const context = useContext(BaseExtensionContext);
		const ExtensionElement = extensions[`${extensionId}Extension`];

		const contextValue = {
			...props,
			...context,
		};

		return (
			<BaseExtensionContextProvider {...contextValue}>
				<SideEffect />
				{useDisplayBlockControls() && (
					<PanelBodyControl
						title={title}
						initialOpen={initialOpen}
						icon={icon}
						className={componentClassNames(
							'extension',
							'extension-' + extensionId
						)}
					>
						{isObject(ExtensionElement) && (
							<ExtensionElement
								{...props}
								block={{
									clientId,
									storeName,
									blockName,
									attributes,
								}}
								config={config}
							/>
						)}
					</PanelBodyControl>
				)}
				{children}
			</BaseExtensionContextProvider>
		);
	}
);
