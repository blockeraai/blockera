// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo, useState, useEffect, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { useLateEffect } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { useStateChanges } from './use-state-changes';
import {
	useStylesForBlocks,
	getDefaultStyle,
} from '../../editor/global-styles/panel/ui/utils';
import { getBlockeraGlobalStylesMetaData } from '../../editor/global-styles/helpers';
import { useGlobalStylesPanelContext } from '../../editor/global-styles/panel/context';
import { type T_SET_CURRENT_ACTIVE_STYLE } from '../../editor/global-styles/panel/ui/types';

export const useBlockStyleVariations = ({
	clientId,
	blockName,
	storedAttributes,
	defaultAttributes,
	inGlobalStylesPanel = false,
}: {
	clientId: string,
	blockName: string,
	storedAttributes: Object,
	defaultAttributes: Object,
	inGlobalStylesPanel?: boolean,
}): Object => {
	const { currentBlockStyleVariation } = useGlobalStylesPanelContext();
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const [event, setEvent] = useState('click');
	const onSwitch = useCallback(() => {}, []);
	const {
		onSelect,
		activeStyle,
		isDeletedStyle,
		stylesToRender,
		genericPreviewBlock,
		className: previewClassName,
	} = useStylesForBlocks({
		event,
		clientId,
		blockName,
		onSwitch,
		inGlobalStylesPanel,
	});

	const [currentActiveStyle, _setCurrentActiveStyle] = useState(activeStyle);
	const callbackActivatorStyle: T_SET_CURRENT_ACTIVE_STYLE = (
		style,
		event
	) => {
		setEvent(event);
		_setCurrentActiveStyle(style);
	};
	const setCurrentActiveStyle = useCallback(callbackActivatorStyle, []);
	const [currentPreviewStyle, setCurrentPreviewStyle] = useState(null);

	useEffect(() => {
		if (
			undefined === currentBlockStyleVariation &&
			!currentActiveStyle.isDefault
		) {
			setCurrentActiveStyle(getDefaultStyle(stylesToRender));
		}

		if (
			currentBlockStyleVariation?.name &&
			currentBlockStyleVariation?.name !== currentActiveStyle.name
		) {
			setCurrentActiveStyle(currentBlockStyleVariation);
		}
	}, [
		stylesToRender,
		currentActiveStyle,
		setCurrentActiveStyle,
		currentBlockStyleVariation,
	]);

	// Update cached style when active style changes
	useLateEffect(() => {
		// change back to old style
		if (
			currentPreviewStyle === null &&
			activeStyle?.name !== currentActiveStyle?.name
		) {
			onSelect(currentActiveStyle);
		}
	}, [currentPreviewStyle]);

	const blockeraGlobalStylesMetaData = getBlockeraGlobalStylesMetaData();

	const buttonText = useMemo(() => {
		if (isDeletedStyle) {
			return __('Missing Style Variation', 'blockera');
		}

		return (
			blockeraGlobalStylesMetaData?.blocks?.[blockName]?.variations?.[
				currentActiveStyle?.name
			]?.label ||
			currentActiveStyle.label ||
			currentActiveStyle.name ||
			__('Default', 'blockera')
		);
	}, [
		blockName,
		isDeletedStyle,
		currentActiveStyle,
		blockeraGlobalStylesMetaData,
	]);

	const memoizedStyles = useMemo(
		() => ({
			onSelect,
			stylesToRender,
			genericPreviewBlock,
			activeStyle: currentActiveStyle,
			setCurrentActiveStyle,
			setCurrentPreviewStyle,
			previewClassName,
			popoverAnchor,
			setIsOpen,
		}),
		[
			onSelect,
			stylesToRender,
			genericPreviewBlock,
			currentActiveStyle,
			setCurrentActiveStyle,
			setCurrentPreviewStyle,
			previewClassName,
			popoverAnchor,
			setIsOpen,
		]
	);

	const { hasChangesets, setChangesets, originDefaultAttributes } =
		useStateChanges({
			blockName,
			storedAttributes,
			defaultAttributes,
			currentBlockStyleVariation,
		});

	return {
		isOpen,
		setIsOpen,
		buttonText,
		hasChangesets,
		popoverAnchor,
		setChangesets,
		memoizedStyles,
		setPopoverAnchor,
		originDefaultAttributes,
		currentBlockStyleVariation,
		event,
		setEvent,
		onSelect,
		activeStyle,
		isDeletedStyle,
		stylesToRender,
		previewClassName,
		genericPreviewBlock,
		currentActiveStyle,
		setCurrentActiveStyle,
		isHovered,
		setIsHovered,
		currentPreviewStyle,
		setCurrentPreviewStyle,
		blockeraGlobalStylesMetaData,
	};
};
