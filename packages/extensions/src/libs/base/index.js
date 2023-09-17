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
							<SideEffect />
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
							__html: getExtensionCssRules({
								...config,
								blockProps: {
									supports,
									clientId,
									blockName,
									attributes,
								},
							}),
						}}
					/>
				)}
			</BaseExtensionContextProvider>
		);
	}
);
