/**
 * Blockera dependencies
 */
import { cloneObject } from '@blockera/utils';
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';
import { getBlockSupportStyleEngineConfig } from '../../../utils';

/**
 * When a radius field is a variable whose serialized settings mirror box-border
 * (JSON with an `all` length), use that inner string for CSS output.
 *
 * @param {*} field Border radius field (string, value-addon object, etc.).
 * @return {*} Field suitable for `getValueAddonRealValue` (string or unchanged object).
 */
function unwrapRadiusVariableField(field) {
	if (!field || typeof field !== 'object' || field.valueType !== 'variable') {
		return field;
	}
	const raw = field.settings?.value;
	if (typeof raw !== 'string' || !raw.trim().startsWith('{')) {
		return field;
	}
	try {
		const parsed = JSON.parse(raw);
		if (
			parsed &&
			typeof parsed === 'object' &&
			typeof parsed.all === 'string' &&
			(!parsed.type || parsed.type === 'all')
		) {
			return parsed.all;
		}
	} catch (e) {
		// Plain preset sizes are non-JSON strings; keep the variable field as-is.
	}
	return field;
}

export function BorderRadiusGenerator(id, props, options) {
	const { attributes, supports, blockeraStyleEngineConfig } = props;

	if (!attributes?.blockeraBorderRadius) {
		return '';
	}

	// We should not change the original supports object.
	const clonedSupports = cloneObject(supports);

	if (blockeraStyleEngineConfig?.blockeraBorderRadius) {
		clonedSupports.blockeraBorderRadius['style-engine-config'] =
			blockeraStyleEngineConfig.blockeraBorderRadius;
	}

	const radius = attributes.blockeraBorderRadius;

	if (radius?.isValueAddon) {
		return createCssDeclarations({
			options,
			properties: {
				[getBlockSupportStyleEngineConfig(
					clonedSupports,
					'blockeraBorderRadius',
					'all',
					props.currentBlock,
					'border-radius'
				)]: getValueAddonRealValue(radius),
			},
		});
	}

	const properties = {};

	if (radius?.type === 'all') {
		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'all',
				props.currentBlock,
				'border-radius'
			)
		] = getValueAddonRealValue(unwrapRadiusVariableField(radius.all));
	} else {
		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'topLeft',
				props.currentBlock,
				'border-top-left-radius'
			)
		] = getValueAddonRealValue(unwrapRadiusVariableField(radius.topLeft));

		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'topRight',
				props.currentBlock,
				'border-top-right-radius'
			)
		] = getValueAddonRealValue(unwrapRadiusVariableField(radius.topRight));

		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'bottomLeft',
				props.currentBlock,
				'border-bottom-left-radius'
			)
		] = getValueAddonRealValue(
			unwrapRadiusVariableField(radius.bottomLeft)
		);

		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'bottomRight',
				props.currentBlock,
				'border-bottom-right-radius'
			)
		] = getValueAddonRealValue(
			unwrapRadiusVariableField(radius.bottomRight)
		);
	}

	for (const key of Object.keys(properties)) {
		const v = properties[key];
		if (v === '' || v === undefined || v === null) {
			delete properties[key];
		}
	}

	if (!Object.keys(properties).length) {
		return '';
	}

	return createCssDeclarations({
		options,
		properties,
	});
}
