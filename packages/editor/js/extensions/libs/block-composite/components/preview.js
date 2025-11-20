// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	InnerBlocksExtension,
	useInnerBlocks,
} from '../../block-card/inner-blocks';
import { Inserter, Categories } from './';
import type { TPreviewProps } from '../types';
import { useBlockStates } from '../../block-card/block-states/hooks';
import type { TStates, StateTypes } from '../../block-card/block-states/types';
import StatesManager from '../../block-card/block-states/components/states-manager';

// the instance of in-memory cache.
const deleteCacheData: Object = new Map();

export const Preview = ({
	// General Props.
	block,
	onChange,
	blockConfig,
	currentBlock,
	currentState,
	availableStates,
	currentBreakpoint,
	currentInnerBlockState,

	// States Manager props.
	blockStatesProps,

	// Inner Blocks props.
	innerBlocksProps,
}: TPreviewProps): MixedElement => {
	const {
		blocks,
		elements,
		maxItems,
		getBlockInners,
		setCurrentBlock,
		setBlockClientInners,
		contextValue: innerBlocksContextValue,
	} = useInnerBlocks({
		block,
		onChange,
		currentBlock,
		maxItems: blockConfig?.maxInnerBlocks,
		values: innerBlocksProps?.values || {},
		innerBlocks: innerBlocksProps?.innerBlocks || {},
	});
	const {
		states,
		onDelete,
		overrideItem,
		defaultStates,
		handleOnChange,
		preparedStates,
		calculatedValue: calculatedStates,
		contextValue: blockStatesContextValue,
		defaultRepeaterItemValue,
		getDynamicDefaultRepeaterItem,
	} = useBlockStates({
		...blockStatesProps,
		block,
		onChange,
		currentBlock,
		currentState,
		setCurrentBlock,
		availableStates,
		deleteCacheData,
		currentBreakpoint,
		currentInnerBlockState,
	});

	const doingSwitchToInner = useCallback(() => {
		const { getState, getInnerState } = select('blockera/editor');
		const {
			settings: { supportsInnerBlocks },
		} = getState(currentState) ||
			getInnerState(currentInnerBlockState) || {
				settings: { supportsInnerBlocks: true },
			};

		if (false === supportsInnerBlocks) {
			const newStates: {
				[key: TStates]: StateTypes,
				// $FlowFixMe
			} = {
				...states,
				normal: {
					...states.normal,
					isSelected: true,
					selectable: true,
				},
			};

			// Reset isSelected flag for all other states
			Object.keys(newStates).forEach((stateName) => {
				if (stateName !== 'normal') {
					// $FlowFixMe
					newStates[stateName].isSelected = false;
				}
			});

			handleOnChange(newStates);
		}
	}, [states, handleOnChange, currentState, currentInnerBlockState]);

	return (
		<StatesManager
			states={states}
			onDelete={onDelete}
			overrideItem={overrideItem}
			defaultStates={defaultStates}
			preparedStates={preparedStates}
			handleOnChange={handleOnChange}
			deleteCacheData={deleteCacheData}
			contextValue={blockStatesContextValue}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			maxItems={Object.keys(preparedStates).length + (maxItems || 0)}
			getDynamicDefaultRepeaterItem={getDynamicDefaultRepeaterItem}
			{...{
				InserterComponent: (props: Object) => (
					<Inserter
						{...{
							...props,
							maxItems:
								maxItems + Object.keys(preparedStates).length,
							AvailableBlocks: () => (
								<Categories
									blocks={blocks}
									elements={elements}
									states={preparedStates}
									clientId={block?.clientId}
									savedStates={calculatedStates}
									setBlockState={handleOnChange}
									getBlockInners={getBlockInners}
									setCurrentBlock={setCurrentBlock}
									doingSwitchToInner={doingSwitchToInner}
									getBlockStates={() => calculatedStates}
									setBlockClientInners={setBlockClientInners}
								/>
							),
						}}
					/>
				),
			}}
		>
			{innerBlocksContextValue && (
				<InnerBlocksExtension
					{...{
						...innerBlocksProps,
						maxItems,
						currentState,
						setCurrentBlock,
						currentBreakpoint,
						doingSwitchToInner,
						setBlockClientInners,
						currentInnerBlockState,
						contextValue: innerBlocksContextValue,
					}}
					block={block}
					onChange={onChange}
				/>
			)}
		</StatesManager>
	);
};
