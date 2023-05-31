/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import * as extensions from '../';
import * as config from './config';
import { InspectElement } from '@publisher/components';
import { BaseExtensionContextProvider, BaseExtensionContext } from './context';

export function BaseExtension({
	title,
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
			<InspectElement title={title} initialOpen={initialOpen}>
				{'function' === typeof ExtensionTypeUI && (
					<ExtensionTypeUI {...{ ...props, config }} />
				)}
			</InspectElement>
			{children}
			{'function' === typeof ExtensionTypeCssRules && (
				<style
					datablocktype={blockName}
					dangerouslySetInnerHTML={{
						__html: ExtensionTypeCssRules(config),
					}}
				/>
			)}
		</BaseExtensionContextProvider>
	);
}
