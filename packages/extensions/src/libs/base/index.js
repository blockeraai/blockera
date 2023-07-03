/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Publisher dependencies
 */
import { componentClassNames } from '@publisher/classnames';
import { isFunction } from '@publisher/utils';
import { PanelBodyControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import * as extensions from '../';
import * as config from './config';
import { BaseExtensionContextProvider, BaseExtensionContext } from './context';
import { useDisplayBlockControls } from '../../hooks/hooks';

export function BaseExtension({
	title,
	icon,
	children,
	blockName,
	extensionId,
	initialOpen,
	...props
}) {
	const context = useContext(BaseExtensionContext);
	const ExtensionTypeUI = extensions[`${extensionId}Extension`];
	const ExtensionTypeCssRules = extensions[`${extensionId}Styles`];

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
						{isFunction(ExtensionTypeUI) && (
							<ExtensionTypeUI {...{ ...props, config }} />
						)}
					</PanelBodyControl>
				</InspectorControls>
			)}
			{children}
			{isFunction(ExtensionTypeCssRules) && (
				<style
					/* eslint-disable-next-line react/no-unknown-property */
					datablocktype={blockName}
					dangerouslySetInnerHTML={{
						__html: ExtensionTypeCssRules(config),
					}}
				/>
			)}
		</BaseExtensionContextProvider>
	);
}
