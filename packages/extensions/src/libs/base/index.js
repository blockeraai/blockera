/**
 * External dependencies
 */
import { useContext, memo } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Publisher dependencies
 */
import { isFunction, isObject } from '@publisher/utils';
import { componentClassNames } from '@publisher/classnames';
import { PanelBodyControl, STORE_NAME } from '@publisher/controls';

/**
 * Internal dependencies
 */
import * as extensions from '../';
import * as config from './config';
import { BaseExtensionContextProvider, BaseExtensionContext } from './context';
import { useDisplayBlockControls } from '../../hooks/hooks';

export const BaseExtension = memo(
	({
		title,
		icon,
		children,
		blockName,
		clientId,
		extensionId,
		initialOpen,
		storeName = STORE_NAME,
		...props
	}) => {
		const context = useContext(BaseExtensionContext);
		const ExtensionElement = extensions[`${extensionId}Extension`];
		const getExtensionCssRules = extensions[`${extensionId}Styles`];

		const contextValue = {
			...props,
			...context,
		};

		return (
			<BaseExtensionContextProvider {...contextValue}>
				{useDisplayBlockControls() && (
					<InspectorControls>
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
									}}
									config={config}
								/>
							)}
						</PanelBodyControl>
					</InspectorControls>
				)}
				{children}
				{isFunction(getExtensionCssRules) && (
					<style
						/* eslint-disable-next-line react/no-unknown-property */
						datablocktype={blockName}
						/* eslint-disable-next-line react/no-unknown-property */
						datablockclientid={clientId}
						dangerouslySetInnerHTML={{
							__html: getExtensionCssRules(config),
						}}
					/>
				)}
			</BaseExtensionContextProvider>
		);
	}
);
