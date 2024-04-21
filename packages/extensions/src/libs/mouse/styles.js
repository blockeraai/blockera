// @flow

/**
 * Publisher dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@publisher/style-engine';
import type { CssRule } from '@publisher/style-engine/src/types';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';

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
	const { publisherCursor, publisherUserSelect, publisherPointerEvents } =
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
		isActiveField(publisherCursor) &&
		currBlockAttributes.publisherCursor !==
			attributes.publisherCursor.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherCursor',
			support: 'publisherCursor',
			fallbackSupportId: 'cursor',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherCursor: [
						{
							...staticDefinitionParams,
							properties: {
								cursor: currBlockAttributes.publisherCursor,
							},
						},
					],
				},
				blockProps
			),
		});
	}

	if (
		isActiveField(publisherUserSelect) &&
		currBlockAttributes.publisherUserSelect !==
			attributes.publisherUserSelect.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherUserSelect',
			support: 'publisherUserSelect',
			fallbackSupportId: 'userSelect',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherUserSelect: [
						{
							...staticDefinitionParams,
							properties: {
								'user-select':
									currBlockAttributes.publisherUserSelect,
							},
						},
					],
				},
				blockProps
			),
		});
	}

	if (
		isActiveField(publisherPointerEvents) &&
		currBlockAttributes.publisherPointerEvents !==
			attributes.publisherPointerEvents.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherPointerEvents',
			support: 'publisherPointerEvents',
			fallbackSupportId: 'pointerEvent',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherPointerEvents: [
						{
							...staticDefinitionParams,
							properties: {
								'pointer-events':
									currBlockAttributes.publisherPointerEvents,
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
