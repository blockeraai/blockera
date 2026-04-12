// @flow

/**
 * Internal dependencies
 */
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import {
	getCompatibleBlockCssSelector,
	computedCssDeclarations,
} from '../../../style-engine';
import { getBlockSupportCategory, getBlockSupportFallback } from '../../utils';

const supports = getBlockSupportCategory('layout');

/**
 * Parse a positive integer span from block attributes.
 * Grid child span is plain `{ value: string|number }` (no value-addons). Using
 * getValueAddonRealValue() on that object returns '' (controls helper treats
 * non-addon objects as empty), so we read `.value` explicitly—same idea as
 * PHP GridChild* definitions after BaseStyleDefinition unwraps single-key `value`.
 */
function parsePositiveGridSpan(raw: mixed): ?number {
	if (raw === null || raw === undefined) {
		return null;
	}
	let v: mixed = raw;
	if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
		const envelope: { +value?: mixed } = (raw: any);
		if (!('value' in envelope)) {
			return null;
		}
		v = envelope.value;
	}
	if (v === '' || v === false || v === null || v === undefined) {
		return null;
	}
	if (typeof v === 'object') {
		return null;
	}
	const n = parseInt(String(v), 10);
	if (!Number.isFinite(n) || n < 1) {
		return null;
	}
	return n;
}

export const GridChildStyles = ({
	state,
	config,
	clientId,
	blockName,
	masterState,
	currentBlock,
	activeDeviceType,
	supports: blockSupports,
	selectors: blockSelectors,
	defaultAttributes: attributes,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> => {
	const gridChildConfig = config.gridChildConfig;
	if (!gridChildConfig) {
		return [];
	}
	const { blockeraGridChildColumnSpan, blockeraGridChildRowSpan } =
		gridChildConfig;
	const blockProps = {
		state,
		clientId,
		blockName,
		currentBlock,
		attributes: currentBlockAttributes,
	};
	const { attributes: _attributes } = blockProps;
	const sharedParams = {
		...props,
		state,
		clientId,
		blockName,
		masterState,
		currentBlock,
		blockSelectors,
		activeDeviceType,
		supports: blockSupports,
		className: currentBlockAttributes?.className,
	};
	const staticDefinitionParams = {
		type: 'static',
		options: {
			important: true,
		},
	};
	const styleGroup: Array<CssRule> = [];

	const colSpan = parsePositiveGridSpan(
		_attributes.blockeraGridChildColumnSpan
	);
	if (
		isActiveField(blockeraGridChildColumnSpan) &&
		colSpan !== null &&
		_attributes.blockeraGridChildColumnSpan !==
			attributes.blockeraGridChildColumnSpan.default
	) {
		const col = colSpan;
		const properties = { 'grid-column': 'span ' + String(col) };
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraGridChildColumnSpan',
			support: 'blockeraGridChildColumnSpan',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraGridChildColumnSpan'
			),
		});
		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraGridChildColumnSpan: [
						{
							...staticDefinitionParams,
							properties,
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	const rowSpan = parsePositiveGridSpan(_attributes.blockeraGridChildRowSpan);
	if (
		isActiveField(blockeraGridChildRowSpan) &&
		rowSpan !== null &&
		_attributes.blockeraGridChildRowSpan !==
			attributes.blockeraGridChildRowSpan.default
	) {
		const row = rowSpan;
		const properties = { 'grid-row': 'span ' + String(row) };
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraGridChildRowSpan',
			support: 'blockeraGridChildRowSpan',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraGridChildRowSpan'
			),
		});
		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraGridChildRowSpan: [
						{
							...staticDefinitionParams,
							properties,
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	return styleGroup;
};
