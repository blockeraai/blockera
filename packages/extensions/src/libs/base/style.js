// @flow
/**
 * External dependencies
 */
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isArray, isFunction } from '@publisher/utils';

/**
 * Internal dependencies
 */
import * as extensionsStack from '../';
import * as config from './config';

export const ExtensionStyle: Object = memo(
	({ clientId, supports, blockName, attributes, extensions }) => {
		const cssRules = extensions?.map((extension) => {
			const getExtensionCssRules = extensionsStack[`${extension}Styles`];

			if (!isFunction(getExtensionCssRules)) {
				return '';
			}

			return getExtensionCssRules({
				...config,
				blockProps: {
					supports,
					clientId,
					blockName,
					attributes,
				},
			});
		});

		return (
			<>
				{isArray(cssRules) && (
					<style
						data-block-type={blockName}
						dangerouslySetInnerHTML={{
							__html: cssRules?.join('\n'),
						}}
					/>
				)}
			</>
		);
	}
);
