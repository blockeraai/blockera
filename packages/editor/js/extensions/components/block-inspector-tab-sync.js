/**
 * External dependencies
 */
import { useLayoutEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useSyncBlockInspectorTab } from './use-sync-block-inspector-tab';

/**
 * Runs inspector tab sync only for the selected block (avoids hover re-renders on all BlockBase instances).
 *
 * @param {Object}   props
 * @param {Function} props.onAlignedSetter Receives the aligned `setCurrentTab` from the hook.
 */
export function BlockInspectorTabSync({
	onAlignedSetter,
	blockName,
	blockVariation,
	inspectorClientId,
	insideBlockInspector,
	currentTab,
	setCurrentTab,
}) {
	const { setCurrentTab: setCurrentTabAligned } = useSyncBlockInspectorTab({
		blockName,
		blockVariation,
		inspectorClientId,
		insideBlockInspector,
		enabled: true,
		currentTab,
		setCurrentTab,
	});

	useLayoutEffect(() => {
		onAlignedSetter(setCurrentTabAligned);

		return () => {
			onAlignedSetter(setCurrentTab);
		};
	}, [onAlignedSetter, setCurrentTab, setCurrentTabAligned]);

	return null;
}
