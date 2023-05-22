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
	const { getBlockExtension, getBlockExtensionBy, hasBlockExtensionField } =
		select(STORE_NAME);
	const currentExtension = getBlockExtensionBy('targetBlock', name);

	if (!currentExtension || !isBlockExtension(currentExtension)) {
		return settings;
	}

	const prepareExtension = (data) => {
		if (!isObject(data[1]) && !isArray(data[1]) && !data[1]) {
			return null;
		}

		return getBlockExtension(data[0]);
	};

	const extensions = Object.entries(currentExtension.fields)
		.map(prepareExtension)
		.filter(isValidArrayItem)
		.filter(
			({ name: extensionName, ...extension }) =>
				isExtension(extension) &&
				hasBlockExtensionField(currentExtension?.name, extensionName)
		);

	const fields = Object.keys(currentExtension.fields)
		.map((extensionName) => {
			return Object.entries(currentExtension.fields[extensionName])
				.map(prepareExtension)
				.filter(isValidArrayItem);
		})
		.filter(isValidArrayItem)
		.flat();

	fields.forEach((field) => {
		const parentExtension = extensions.filter(
			(extension) => extension.fields[field.name]
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
			currentExtension.fields[parentExtension?.name] &&
			currentExtension.fields[parentExtension?.name][field.name] &&
			!isBoolean(
				currentExtension.fields[parentExtension?.name][field.name]
			)
		) {
			field = {
				...field,
				...currentExtension.fields[parentExtension.name][field.name],
			};
		}

		settings = mergeSettings(settings, field);
	});
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
		? getObjectColumn(additional, 'fields')
		: {};
	const getFieldUI = (field, UIName) => {
		const parentExtension = extensions.filter(
			(extension) => extension.fields[field.name]
		)[0];

		if (!parentExtension?.fields || !parentExtension?.fields[field.name]) {
			return [];
		}

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
