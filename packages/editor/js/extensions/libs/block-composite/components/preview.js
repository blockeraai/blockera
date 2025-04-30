// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { Inserter, Categories } from './';
import type { TPreviewProps } from '../types';
import { useBlockStates } from '../../block-card/block-states/hooks';
import StatesManager from '../../block-card/block-states/components/states-manager';
import {
	InnerBlocksExtension,
	useInnerBlocks,
} from '../../block-card/inner-blocks';

// the instance of in-memory cache.
const deleteCacheData: Object = new Map();

export const Preview = ({
	// General Props.
	block,
	onChange,
	currentBlock,
	currentState,
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
		deleteCacheData,
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	});

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
						setCurrentBlock,
						setBlockClientInners,
						contextValue: innerBlocksContextValue,
					}}
					block={block}
					onChange={onChange}
				/>
			)}
		</StatesManager>
	);
};
