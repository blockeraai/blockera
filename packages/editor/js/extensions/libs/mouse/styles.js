// @flow

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import { getCssSelector, computedCssDeclarations } from '../../../style-engine';

export const MouseStyles = ({
	state,
	clientId,
	blockName,
	currentBlock,
	// supports,
	// activeDeviceType,
	selectors: blockSelectors,
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
		currentBlock,
		blockSelectors,
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
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraCursor',
			support: 'blockeraCursor',
			fallbackSupportId: 'cursor',
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
				blockProps
			),
		});
	}

	if (
		isActiveField(blockeraUserSelect) &&
		currBlockAttributes.blockeraUserSelect !==
			attributes.blockeraUserSelect.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraUserSelect',
			support: 'blockeraUserSelect',
			fallbackSupportId: 'userSelect',
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
				blockProps
			),
		});
	}

	if (
		isActiveField(blockeraPointerEvents) &&
		currBlockAttributes.blockeraPointerEvents !==
			attributes.blockeraPointerEvents.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraPointerEvents',
			support: 'blockeraPointerEvents',
			fallbackSupportId: 'pointerEvent',
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
				blockProps
			),
		});
	}

	return styleGroup;
};
