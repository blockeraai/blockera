/**
 * Internal dependencies
 */
import { useBlockSideEffects } from '../../../../hooks';

export const SideEffect = ({
	clientId = '',
	blockName,
	currentBlock,
	currentTab,
	currentState,
	isActive,
	activeBlockVariation,
	insideBlockInspector = true,
	availableStates,
	blockeraUnsavedData,
}) => {
	useBlockSideEffects({
		clientId,
		activeBlockVariation,
		blockName,
		currentBlock,
		isActive,
		currentTab,
		currentState,
		insideBlockInspector,
		availableStates,
		blockeraUnsavedData,
	});

	return null;
};
