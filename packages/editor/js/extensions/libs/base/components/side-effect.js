/**
 * Internal dependencies
 */
import { useBlockSideEffects } from '../../../../hooks';

export const SideEffect = ({
	blockName,
	currentBlock,
	currentTab,
	currentState,
	isActive,
	activeBlockVariation,
	insideBlockInspector = true,
}) => {
	useBlockSideEffects({
		activeBlockVariation,
		blockName,
		currentBlock,
		isActive,
		currentTab,
		currentState,
		insideBlockInspector,
	});

	return null;
};
