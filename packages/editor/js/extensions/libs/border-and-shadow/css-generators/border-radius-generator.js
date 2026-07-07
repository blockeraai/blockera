/**
 * Blockera dependencies
 */
import { tryParseLegacyJsonObject } from '@blockera/data';
import { cloneObject } from '@blockera/utils';
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';
import { getBlockSupportStyleEngineConfig } from '../../../utils';

/**
 * When a radius field is a variable whose settings mirror box-border shape
 * (object with `all` length, or legacy JSON with the same shape), use that inner string for CSS output.
 *
 * @param {*} field Border radius field (string, value-addon object, etc.).
 * @return {*} Field suitable for `getValueAddonRealValue` (string or unchanged object).
 */
function unwrapRadiusVariableField(field) {
	if (!field || typeof field !== 'object' || field.valueType !== 'variable') {
		return field;
	}
	const raw = field.settings?.value;
	if (raw && typeof raw === 'object' && typeof raw.all === 'string') {
		if (!raw.type || raw.type === 'all') {
			return raw.all;
		}
	}
	const legacy = tryParseLegacyJsonObject(raw);
	if (
		legacy &&
		typeof legacy.all === 'string' &&
		(!legacy.type || legacy.type === 'all')
	) {
		return legacy.all;
	}
	return field;
}

function getBorderRadiusFieldCss(field) {
	if (!field || typeof field !== 'object') {
		return getValueAddonRealValue(field);
	}
	if (field.valueType === 'variable' && field.settings?.var) {
		const unwrapped = unwrapRadiusVariableField(field);
		if (unwrapped === field) {
			return getValueAddonRealValue(field);
		}
		const fallback =
			typeof unwrapped === 'string'
				? unwrapped
				: getValueAddonRealValue(unwrapped);
		if (fallback !== '' && fallback !== undefined && fallback !== null) {
			return `var(${field.settings.var}, ${fallback})`;
		}
		return `var(${field.settings.var})`;
	}
	return getValueAddonRealValue(unwrapRadiusVariableField(field));
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
		] = getBorderRadiusFieldCss(radius.all);
	} else {
		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'topLeft',
				props.currentBlock,
				'border-top-left-radius'
			)
		] = getBorderRadiusFieldCss(radius.topLeft);

		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'topRight',
				props.currentBlock,
				'border-top-right-radius'
			)
		] = getBorderRadiusFieldCss(radius.topRight);

		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'bottomLeft',
				props.currentBlock,
				'border-bottom-left-radius'
			)
		] = getBorderRadiusFieldCss(radius.bottomLeft);

		properties[
			getBlockSupportStyleEngineConfig(
				clonedSupports,
				'blockeraBorderRadius',
				'bottomRight',
				props.currentBlock,
				'border-bottom-right-radius'
			)
		] = getBorderRadiusFieldCss(radius.bottomRight);
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
