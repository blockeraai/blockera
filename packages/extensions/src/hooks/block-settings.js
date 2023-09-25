/**
 * External dependencies
 */
import { select, useSelect } from '@wordpress/data';
import { useMemo, useEffect, useRef } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isObject, isFunction } from '@publisher/utils';
import { extensionClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';
import { BlockEditContextProvider } from './context';
import { useAttributes } from './utils';
import { isBlockTypeExtension, isEnableExtension } from '../api/utils';
import { useIconEffect } from './use-icon-effect';

const { getBlockExtension, getBlockExtensionBy } = select(STORE_NAME);

/**
 * Filters registered WordPress block type settings, extending block settings with settings and block name.
 *
 * @param {Object} settings Original block settings.
 * @param {string} name block id or name.
 * @return {Object} Filtered block settings.
 */
export default function withBlockSettings(
	settings: Object,
	name: Object
): Object {
	const sharedExtension = getBlockExtension('Shared');
	const blockExtension = getBlockExtensionBy('targetBlock', name);

	if (blockExtension && isBlockTypeExtension(blockExtension)) {
		return mergeBlockSettings(settings, {
			...blockExtension,
			attributes: {
				...(sharedExtension?.attributes ?? {}),
				...blockExtension.attributes,
			},
			supports: {
				...(sharedExtension?.supports ?? {}),
				...blockExtension.supports,
			},
		});
	}

	return mergeBlockSettings(settings, sharedExtension);
}

/**
 * Merge settings of block type.
 *
 * @param {Object} settings The default WordPress block type settings
 * @param {Object} additional The additional settings of extension
 * @return {Object} merged settings!
 */
function mergeBlockSettings(settings: Object, additional: Object): Object {
	if (!isEnableExtension(additional)) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			...additional.attributes,
			publisherPropsId: {
				type: 'string',
			},
		},
		supports: {
			...settings.supports,
			...additional.supports,
		},
		selectors: {
			...(settings.selectors || {}),
			...(additional.selectors || {}),
		},
		edit(blockProps) {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { supports } = useSelect((select) => {
				const { getBlockType } = select('core/blocks');

				return getBlockType(blockProps.name);
			});
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const blockEditRef = useRef(null);

			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(
				() => {
					useIconEffect({
						name: blockProps.name,
						clientId: blockProps.clientId,
						publisherIcon: blockProps?.attributes?.publisherIcon,
						publisherIconGap:
							blockProps?.attributes?.publisherIconGap,
						publisherIconSize:
							blockProps?.attributes?.publisherIconSize,
						publisherIconColor:
							blockProps?.attributes?.publisherIconColor,
						publisherIconPosition:
							blockProps?.attributes?.publisherIconPosition,
						blockRefId: blockEditRef,
					});
				},
				// eslint-disable-next-line react-hooks/exhaustive-deps
				[blockProps.attributes]
			);

			if (isFunction(additional?.edit)) {
				const { edit: BlockEditComponent } = additional;

				// eslint-disable-next-line react-hooks/rules-of-hooks
				const props = useMemo(() => {
					return {
						...useAttributes(blockProps),
					};
				}, [blockProps]);

				props.className += ` ${additional.editorProps.className}`;
				props.className = extensionClassNames(
					{
						[props.className]: true,
						'publisher-extension-ref': true,
						[`client-id-${props.clientId}`]: true,
					},
					additional.editorProps.className
				);

				return (
					<>
						<div ref={blockEditRef} />
						<BlockEditContextProvider {...props}>
							<BlockEditComponent
								supports={supports}
								blockName={blockProps.name}
								attributes={props.attributes}
								clientId={blockProps.clientId}
								setAttributes={props.setAttributes}
							/>
						</BlockEditContextProvider>
						{settings.edit(props)}
					</>
				);
			}

			return settings.edit(blockProps);
		},
		deprecated: [
			{
				attributes: settings.attributes,
				supports: settings.supports,
				migrate(attributes) {
					return additional.migrate(attributes);
				},
				edit(blockProps) {
					return settings.edit(blockProps);
				},
				save(blockProps) {
					return settings.save(blockProps);
				},
			},
			...(settings?.deprecated || []),
		].filter(isObject),
		publisherEditorProps: {
			...(settings.publisherEditorProps || {}),
			...additional.editorProps,
		},
		publisherSaveProps: {
			...(settings.publisherSaveProps || {}),
			...additional.saveProps,
		},
		publisherCssGenerators: {
			...additional.cssGenerators,
			...(settings?.publisherCssGenerators || {}),
		},
	};
}
