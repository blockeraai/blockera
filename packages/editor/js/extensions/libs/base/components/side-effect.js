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
	});

	return null;
};
