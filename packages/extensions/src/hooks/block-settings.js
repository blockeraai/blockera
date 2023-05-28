/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { useMemo, useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import { isArray, isObject } from 'lodash';

/**
 * Internal dependencies
 */
import {
	isBlockTypeExtension,
	isEnableExtension,
	isExtensionType,
} from '../api/utils';
import { STORE_NAME } from '../store/constants';
import { InspectElement } from '@publisher/components';
import { isValidArrayItem, useAttributes } from './utils';
import { computedCssRules } from '@publisher/style-engine';
import { extensionClassNames } from '@publisher/classnames';
import { getExtendedProps, useDisplayBlockControls } from './hooks';

const {
	getBlockExtension,
	getBlockExtensionBy,
	hasBlockExtensionSupport,
	hasBlockExtensionField,
} = select(STORE_NAME);

/**
 * Retrieve registered extension type with data object name!
 *
 * @param {Object} data the data object
 * @return {Object} The registered block extension type
 */
const prepareExtension = (data) => {
	if (!isObject(data[1]) && !isArray(data[1]) && !data[1]) {
		return null;
	}

	return getBlockExtension(data[0]);
};

/**
 * Get block extension "extensions" column!
 *
 * @param {Object} block The block extension props
 * @return {Array<Object>} array of block extension "extensions" property
 */
function getBlockExtensions(block: Object): Array<Object> {
	return Object.entries(block.extensions)
		.map(prepareExtension)
		.filter(isValidArrayItem)
		.filter(
			({ name: extensionName, ...extension }) =>
				isExtensionType(extension) &&
				hasBlockExtensionSupport(block?.name, extensionName)
		)
		.map((extension) => merge(extension, block.extensions[extension.name]));
}

/**
 * Get block extension "fields" column!
 *
 * @param {Object} block The block extension props
 * @return {Array<Object>} array of block extension "fields" property
 */
function getBlockFields(block: Object): Array<Object> {
	return Object.values(block.extensions)
		.map(({ fields }) => fields.map((field) => field.field || field))
		.flat()
		.map((field) => getBlockExtension(field))
		.filter(isValidArrayItem)
		.flat();
}

/**
 * Merging shared process between extension and field types!
 *
 * @param {Object} origin The original extension props
 * @param {Object} additional The addition extension props
 * @return {Object} merged original extension props with additional props
 */
function sharedMergeProcess(origin, additional) {
	return {
		...origin,
		attributes: {
			...origin.attributes,
			...additional.attributes,
		},
		saveProps: getExtendedProps(origin.saveProps, additional.saveProps),
		editorProps: getExtendedProps(
			origin.editorProps,
			additional.editorProps
		),
		cssGenerators: {
			...origin.cssGenerators,
			...additional.cssGenerators,
		},
	};
}

/**
 * Merging objects
 *
 * @param {Object} a the object first
 * @param {Object} b the object second
 * @return {Object} merged second object into first
 */
const merge = (a: Object, b: Object): Object => {
	for (const key in b) {
		if (!Object.hasOwnProperty.call(b, key)) {
			continue;
		}

		const element = b[key];

		if (!element) {
			continue;
		}

		if (isObject(element)) {
			a = {
				...a,
				key: {
					...(a[key] || {}),
					...element,
				},
			};

			continue;
		}

		if (isArray(element)) {
			a = {
				...a,
				key: [...(a[key] || []), ...element],
			};

			continue;
		}

		a = {
			...a,
			[!a[key] ? key : a[key]]: b[key],
		};
	}

	return a;
};

/**
 * Merging field type settings with parent block extension.
 *
 * @param {Object} field the target field type props
 * @param {Object} extensions the block extension "extensions" property list
 * @param {Object} blockExtension the block extension props
 * @return {Object} merged block extension!
 */
function mergeFieldType(
	field: Object,
	extensions: Object,
	blockExtension: Object
): Object {
	const parentExtension = extensions.filter((extension) =>
		hasBlockExtensionField(extension.name, field.name)
	)[0];

	if (!parentExtension?.fields || !isEnableExtension(parentExtension)) {
		return blockExtension;
	}

	parentExtension.fields.forEach((_field, index) => {
		field = {
			...field,
			...merge(
				_field,
				blockExtension?.extensions[parentExtension.name]?.fields[index]
			),
		};

		if (!isEnableExtension(field)) {
			return;
		}

		const fieldUI = [
			...(blockExtension?.UI?.fields[parentExtension.name] || []),
			field,
		];

		blockExtension = {
			...blockExtension,
			...sharedMergeProcess(blockExtension, field),
			supports: {
				...blockExtension.supports,
				...field.supports,
				__experimentalPublisherDefaultControls: {
					...(blockExtension?.supports
						?.__experimentalPublisherDefaultControls || {}),
					[field.name]: true, //NOTICE: Turn on the current field support for gutenberg block!
				},
			},
			UI: {
				...(blockExtension.UI || {}),
				fields: {
					...(blockExtension?.UI?.fields || {}),
					[parentExtension.name]: fieldUI.filter(
						(obj, _index) =>
							fieldUI.findIndex(
								(item) => item.name === obj.name
							) === _index
					),
				},
			},
		};
	});

	return blockExtension;
}

/**
 * Merging extension type settings with parent block extension.
 *
 * @param {Object} extension the target extension type props
 * @param {Object} blockExtension the block extensions props
 * @return {Object} merged block extension!
 */
function mergeExtensionType(extension, blockExtension) {
	if (!isEnableExtension(extension)) {
		return blockExtension;
	}

	return {
		...blockExtension,
		...sharedMergeProcess(blockExtension, extension),
		supports: {
			...blockExtension.supports,
			...extension.supports,
		},
		fields: {
			...blockExtension.fields,
			...extension.fields,
		},
		UI: {
			...(blockExtension.UI || {}),
			extensions: [...(blockExtension?.UI?.extensions || []), extension],
		},
	};
}

/**
 * 	Preparing block extension resources!
 *
 * @param {Object} blockExtension The current block extension details
 * @return {Object} merged fields, extensions and any other rewriteable properties of block extension with self.
 */
function prepareBlockExtensionResources(blockExtension) {
	const fields = getBlockFields(blockExtension);
	const extensions = getBlockExtensions(blockExtension);

	fields.forEach(
		(field) =>
			(blockExtension = mergeFieldType(field, extensions, blockExtension))
	);

	extensions.forEach(
		(extension) =>
			(blockExtension = mergeExtensionType(extension, blockExtension))
	);

	return blockExtension;
}

/**
 * Filters registered block settings, extending block settings with settings and block name.
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
		return mergeBlockSettings(
			settings,
			prepareBlockExtensionResources(
				//NOTICE: merge current target block extension with shared extension!
				{
					...blockExtension,
					extensions: {
						...sharedExtension.extensions,
						...blockExtension.extensions,
					},
				}
			)
		);
	}

	return mergeBlockSettings(
		settings,
		prepareBlockExtensionResources(sharedExtension, name)
	);
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
		},
		supports: {
			...settings.supports,
			...additional.supports,
		},
		edit(blockProps) {
			if ('function' === typeof additional?.sideEffect) {
				useEffect(() => additional.sideEffect(blockProps), []);
			}
			if ('function' === typeof additional?.edit) {
				const { edit: BlockEditComponent } = additional;

				const props = useMemo(() => {
					return {
						...useAttributes(blockProps),
					};
				}, [blockProps]);

				const __cssRules = computedCssRules(additional, props);

				props.className += ` ${additional.editorProps.className}`;

				props.className = extensionClassNames(
					{
						[props.className]: true,
						'publisher-extension-ref': true,
						[`client-id-${props.clientId}`]: true,
					},
					additional.editorProps.className
				);

				const { onRemove, onReplace, ..._props } = props;

				return (
					<>
						{useDisplayBlockControls() && (
							<BlockEditComponent {..._props}>
								{additional.UI.extensions?.map(
									(
										{
											edit: ExtensionEditComponent,
											name,
											label,
											isOpen,
											...extension
										},
										index
									) => (
										<InspectElement
											title={label}
											initialOpen={isOpen}
											key={`${name}-${index}`}
										>
											<ExtensionEditComponent
												key={`extension-${index}`}
												{...{ ..._props, ...extension }}
											>
												{additional.UI.fields[
													name
												]?.map((field, _index) => {
													const {
														edit: FieldEditComponent,
														..._field
													} = field;

													return (
														<FieldEditComponent
															key={`field-${index}-${_index}`}
															{...{
																..._props,
																..._field,
															}}
														/>
													);
												})}
											</ExtensionEditComponent>
										</InspectElement>
									)
								)}
							</BlockEditComponent>
						)}
						{settings.edit(props)}
						{0 !== __cssRules?.length && (
							<style
								datablocktype={blockProps.name}
								dangerouslySetInnerHTML={{
									__html: __cssRules,
								}}
							/>
						)}
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
				save(props) {
					return settings.save(props);
				},
			},
			...(settings?.deprecated || []),
		].filter(isValidArrayItem),
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
