// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import type {
	InnerBlockModel,
	InnerBlockType,
} from '@publisher/extensions/src/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { StateStyle } from './';
import type { InnerBlockStyleProps } from './types';
import { useBlockContext } from '@publisher/extensions/src/hooks';

export const InnerBlockStyle = (
	props: InnerBlockStyleProps
): Array<MixedElement> => {
	const keys: Array<InnerBlockType | string> = Object.keys(
		props.attributes.publisherInnerBlocks
	);
	const { publisherInnerBlocks } = useBlockContext();

	return Object.values(props.attributes.publisherInnerBlocks).map(
		(innerBlock: InnerBlockModel, index): MixedElement => {
			const type: 'master' | InnerBlockType | string = keys[index];
			const { selectors = {} } = publisherInnerBlocks[type] || {};

			return (
				<StateStyle
					key={index + type}
					{...{
						...{
							...props,
							selectors,
							attributes: innerBlock.attributes,
						},
						currentBlock: type,
					}}
				/>
			);
		}
	);
};
