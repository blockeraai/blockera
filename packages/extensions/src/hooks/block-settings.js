/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isArray, isBoolean, isObject } from 'lodash';

/**
 * Internal dependencies
 */
import { isValidArrayItem } from './utils';
import { STORE_NAME } from '../store/constants';
import { isBlockExtension, isExtension, isFieldExtension } from '../api/utils';

const {
	getBlockExtension,
	getBlockExtensionBy,
	hasBlockExtensionSupport,
	hasBlockExtensionField,
} = select(STORE_NAME);

const prepareExtension = (data) => {
	if (!isObject(data[1]) && !isArray(data[1]) && !data[1]) {
		return null;
	}

	return getBlockExtension(data[0]);
};

function getBlockExtensions(block: Object): Array<Object> {
	return Object.entries(block.extensions)
		.map(prepareExtension)
		.filter(isValidArrayItem)
		.filter(
			({ name: extensionName, ...extension }) =>
				isExtension(extension) &&
				hasBlockExtensionSupport(block?.name, extensionName)
		);
}

function getBlockFields(block: Object): Array<Object> {
	return Object.values(block.extensions)
		.map(({ fields }) => fields.map((field) => field.field || field))
		.flat()
		.map((field) => getBlockExtension(field))
		.filter(isValidArrayItem)
		.flat();
}

function isParentExtension(fieldName: string, { name }: Object): boolean {
	return hasBlockExtensionField(name, fieldName);
}

function mergeBlockFieldSettings(
	field: Object,
	extensions: Object,
	blockExtensions: Object,
	defaultBlockSettings: Object
): Object {
	const parentExtension = extensions.filter((extension) =>
		isParentExtension(field.name, extension.name)
	)[0];

	if (
		parentExtension?.fields &&
		parentExtension?.fields[field.name] &&
		!isBoolean(parentExtension?.fields[field.name])
	) {
		field = {
			...field,
			...parentExtension.fields[field.name],
		};
	}

	if (
		blockExtensions[parentExtension?.name] &&
		blockExtensions[parentExtension?.name][field.name] &&
		!isBoolean(blockExtensions[parentExtension?.name][field.name])
	) {
		field = {
			...field,
			...blockExtensions[parentExtension.name][field.name],
		};
	}

	return mergeSettings(defaultBlockSettings, field);
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
	const currentExtension = getBlockExtensionBy('targetBlock', name);

	if (!currentExtension || !isBlockExtension(currentExtension)) {
		return settings;
	}

	const fields = getBlockFields(currentExtension);
	const extensions = getBlockExtensions(currentExtension);

	fields.forEach(
		(field) =>
			(settings = mergeBlockFieldSettings(
				field,
				extensions,
				currentExtension.extensions,
				settings
			))
	);
	extensions.forEach(
		(extension) => (settings = mergeSettings(settings, extension))
	);

	return mergeSettings(settings, currentExtension, { fields, extensions });
}

/**
 * Merge settings of block type.
 *
 * @param {Object} settings The default WordPress block type settings
 * @param {Object} additional The additional settings of extension
 * @param {Object} blockExtension The blockExtension includes "fields" and "extensions" list props
 * @return {Object} merged settings!
 */
function mergeSettings(
	settings: Object,
	additional: Object,
	blockExtension: Object
): Object {
	const { fields, extensions } = blockExtension || {};

	function getObjectColumn(object: Object, column: string): Object {
		if (!object[column]) {
			return {};
		}
		return Object.fromEntries(
			Object.entries(object[column]).map((columnItem) => columnItem)
		);
	}

	const unSupportFields = isFieldExtension(additional)
		? getObjectColumn(additional, 'supports')
		: {};
	const supportFields = isExtension(additional)
		? Object.values(getObjectColumn(additional, 'fields')).map((item) => {
				return { ...{ [item.field]: true } };
		  })
		: {};
	const getFieldUI = (field, UIName) => {
		const parentExtension = extensions.filter((extension) =>
			isParentExtension(field.name, extension)
		)[0];

		if (!field[UIName]) {
			console.error(`Extension UI for: "${UIName}" was not exists!`);

			return [];
		}

		return { [parentExtension.name]: field[UIName] };
	};
	const ExtensionUI = isExtension(additional) ? additional : null;
	const BlockUI = isBlockExtension(additional) ? additional : null;

	return {
		...settings,
		attributes: {
			...settings.attributes,
			...additional.props,
		},
		supports: {
			...settings.supports,
			...unSupportFields,
			__experimentalPublisherDefaultControls: {
				...(settings.supports
					? settings.supports
							.__experimentalPublisherDefaultControls || {}
					: {}),
				...supportFields,
			},
		},
		publisherEdit: {
			...(settings.publisherEdit || {}),
			BlockUI,
			FieldUI: [
				...(settings.publisherEdit?.FieldUI || []),
				fields
					? fields
							.map((field) => getFieldUI(field, 'Edit'))
							.filter(isValidArrayItem)
					: [],
			]
				.filter(isValidArrayItem)
				.flat(),
			ExtensionUI: [
				...(settings.publisherEdit?.ExtensionUI || []),
				ExtensionUI,
			].filter(isValidArrayItem),
		},
		publisherSave: {
			...(settings.publisherSave || {}),
			BlockUI,
			FieldUI: [
				...(settings.publisherSave?.FieldUI || []),
				fields
					? fields
							.map((field) => getFieldUI(field, 'Save'))
							.filter(isValidArrayItem)
					: [],
			]
				.filter(isValidArrayItem)
				.flat(),
			ExtensionUI: [
				...(settings.publisherSave?.ExtensionUI || []),
				ExtensionUI,
			].filter(isValidArrayItem),
		},
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
