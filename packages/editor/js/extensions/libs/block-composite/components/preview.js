// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useCallback, useEffect } from '@wordpress/element';

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
	insideBlockInspector = true,
	currentInnerBlockState,

	// States Manager props.
	blockStatesProps,
	onStatesManagerReady,

	// Inner Blocks props.
	innerBlocksProps,

	// External props.
	setCurrentTab,
}: TPreviewProps): MixedElement => {
	const {
		blocks,
		elements,
		maxItems,
		getBlockInners,
		setCurrentBlock,
		setBlockClientInners,
		onReset: onInnerBlocksReset,
		contextValue: innerBlocksContextValue,
	} = useInnerBlocks({
		block,
		onChange,
		currentBlock,
		insideBlockInspector,
		maxItems: blockConfig?.maxInnerBlocks,
		values: innerBlocksProps?.values || {},
		innerBlocks: innerBlocksProps?.innerBlocks || {},
	});

	const {
		states,
		onReset,
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
		setCurrentTab?.('style');
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
	}, [
		states,
		currentState,
		setCurrentTab,
		handleOnChange,
		currentInnerBlockState,
	]);

	// Expose handleOnChange to parent component if callback is provided
	useEffect(() => {
		if (onStatesManagerReady) {
			onStatesManagerReady(handleOnChange);
		}
	}, [onStatesManagerReady, handleOnChange]);

	return (
		<StatesManager
			states={states}
			onReset={onReset}
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
						onReset: onInnerBlocksReset,
						contextValue: innerBlocksContextValue,
					}}
					block={block}
					onChange={onChange}
				/>
			)}
		</StatesManager>
	);
};
