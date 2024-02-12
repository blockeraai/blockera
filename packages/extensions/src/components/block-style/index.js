// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { useCssSelectors, useMedia } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
// import { useBlocksStore } from '../../hooks';
import type { TBlockProps } from '../../libs/types';
import {
	convertToStringStyleRule,
	convertToStylesheet,
	getCssRules,
	getSelector,
} from './helpers';
import { useBlockContext } from '../../hooks';
import type { InnerBlockModel } from '../../libs/inner-blocks/types';
import { default as blockStates } from '../../libs/block-states/states';
import type { TBreakpoint, TStates } from '../../libs/block-states/types';
import { usePrepareStylesheetDeps } from './use-prepare-stylesheet-deps';

export const BlockStyle = ({
	clientId,
	supports,
	blockName,
	attributes,
	setAttributes,
	activeDeviceType,
}: {
	...TBlockProps,
	activeDeviceType: TBreakpoint,
}): MixedElement => {
	const { getCurrentState, publisherInnerBlocks } = useBlockContext();
	const states: Array<TStates | string> = Object.keys(blockStates);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const selectors = useCssSelectors({
		blockName,
		fallbackSupportId: '',
		supportId: 'publisherSize',
		currentState: getCurrentState(),
		innerBlocks: publisherInnerBlocks,
	});

	// const { getBlockType } = useBlocksStore();

	// const { selectors: blockSelectors } = getBlockType(blockName);

	const medias = useMedia();

	const styles = states.map((state: TStates | string): string => {
		const blockProps = {
			clientId,
			supports,
			blockName,
			attributes,
			setAttributes,
		};

		if ('normal' === state) {
			return convertToStringStyleRule({
				cssRules: getCssRules(attributes, blockProps).join('\n'),
				selector: getSelector({
					state,
					clientId,
					selectors,
					currentBlock: 'master',
					className: attributes?.className,
				}),
			});
		}

		// eslint-disable-next-line react-hooks/rules-of-hooks
		return usePrepareStylesheetDeps(state, selectors, blockProps).join(
			'\n'
		);
	});

	const innerBlocksStyles = states.map(
		(state: TStates | string): Array<string> => {
			const styles = [];

			Object.values(publisherInnerBlocks).forEach(
				(innerBlock: InnerBlockModel): void => {
					if (
						!selectors[state][innerBlock.type] ||
						!attributes.publisherInnerBlocks[innerBlock.type]
							?.attributes
					) {
						return;
					}

					styles.push(
						// eslint-disable-next-line react-hooks/rules-of-hooks
						convertToStringStyleRule({
							cssRules: getCssRules(
								attributes.publisherInnerBlocks[innerBlock.type]
									?.attributes,
								{
									clientId,
									supports,
									blockName,
									attributes:
										attributes.publisherInnerBlocks[
											innerBlock.type
										]?.attributes,
									setAttributes,
								}
							).join('\n'),
							selector: getSelector({
								state,
								clientId,
								selectors,
								currentBlock: innerBlock.type,
								className: innerBlock?.attributes?.className,
							}),
						})
					);
				}
			);

			return styles;
		}
	);

	return (
		<>
			<style
				data-block-type={blockName}
				dangerouslySetInnerHTML={{
					__html: Object.entries(medias)
						.map(([type, media]) => {
							if (type !== activeDeviceType.toLowerCase()) {
								return '';
							}

							return convertToStylesheet(
								media,
								[...styles, ...innerBlocksStyles].join('\n')
							);
						})
						.flat()
						.filter((style: string) => style)
						.join('\n')
						.trim(),
				}}
			/>
		</>
	);
};
