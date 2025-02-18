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

const supports = getBlockSupportCategory('mouse');

export const MouseStyles = ({
	state,
	config,
	clientId,
	blockName,
	masterState,
	currentBlock,
	activeDeviceType,
	selectors: blockSelectors,
	defaultAttributes: attributes,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> => {
	const { blockeraCursor, blockeraUserSelect, blockeraPointerEvents } =
		config.mouseConfig;
	const blockProps = {
		attributes: currentBlockAttributes,
		clientId,
		blockName,
	};
	const { attributes: currBlockAttributes } = blockProps;
	const sharedParams = {
		...props,
		state,
		clientId,
		blockName,
		masterState,
		currentBlock,
		blockSelectors,
		activeDeviceType,
		className: currentBlockAttributes?.className,
	};
	const staticDefinitionParams = {
		type: 'static',
		options: {
			important: true,
		},
	};
	const styleGroup: Array<CssRule> = [];

	if (
		isActiveField(blockeraCursor) &&
		currBlockAttributes.blockeraCursor !== attributes.blockeraCursor.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraCursor',
			support: 'blockeraCursor',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraCursor'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraCursor: [
						{
							...staticDefinitionParams,
							properties: {
								cursor: currBlockAttributes.blockeraCursor,
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	if (
		isActiveField(blockeraUserSelect) &&
		currBlockAttributes.blockeraUserSelect !==
			attributes.blockeraUserSelect.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraUserSelect',
			support: 'blockeraUserSelect',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraUserSelect'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraUserSelect: [
						{
							...staticDefinitionParams,
							properties: {
								'user-select':
									currBlockAttributes.blockeraUserSelect,
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	if (
		isActiveField(blockeraPointerEvents) &&
		currBlockAttributes.blockeraPointerEvents !==
			attributes.blockeraPointerEvents.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraPointerEvents',
			support: 'blockeraPointerEvents',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraPointerEvents'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraPointerEvents: [
						{
							...staticDefinitionParams,
							properties: {
								'pointer-events':
									currBlockAttributes.blockeraPointerEvents,
							},
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
