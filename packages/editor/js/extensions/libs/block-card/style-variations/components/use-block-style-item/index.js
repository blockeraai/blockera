// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';
import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */

/**
 * Internal dependencies
 */
import { getDefaultStyle } from '../../utils';
import { getCalculatedNewStyle } from './helpers';

export const useBlockStyleItem = ({
	styles,
	blockName,
	setStyles,
	blockStyles,
	cachedStyle,
	setBlockStyles,
	setCachedStyle,
	setIsOpenContextMenu,
	setCurrentActiveStyle,
	setCurrentBlockStyleVariation,
}: {
	styles: Object,
	blockName: string,
	cachedStyle: Object,
	blockStyles: Array<Object>,
	setStyles: (styles: Object) => void,
	setCachedStyle: (style: Object) => void,
	setCurrentActiveStyle: (style: Object) => void,
	setIsOpenContextMenu: (isOpen: boolean) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	setCurrentBlockStyleVariation: (style: Object) => void,
}) => {
	const postId = select('core').__experimentalGetCurrentGlobalStylesId();
	const [globalStyles, setGlobalStyles] = useEntityProp(
		'root',
		'globalStyles',
		'styles',
		postId
	);

	const handleOnDuplicate = useCallback(
		(currentStyle) => {
			const duplicateStyle = getCalculatedNewStyle({
				styles,
				blockStyles,
				currentStyle,
				action: 'duplicate',
			});

			// Register the new block style
			registerBlockStyle(blockName, duplicateStyle);

			// Update styles context with new variation
			setStyles({
				...styles,
				variations: {
					...(styles.variations || {}),
					[duplicateStyle.name]: currentStyle,
				},
			});

			setCurrentBlockStyleVariation(duplicateStyle);

			setCurrentActiveStyle(duplicateStyle);

			setBlockStyles([...blockStyles, duplicateStyle]);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[styles, blockStyles]
	);

	const handleOnClearAllCustomizations = (currentStyle) => {
		setStyles(
			{
				variations: {
					[currentStyle.name]: {},
				},
			},
			{
				action: 'clear-all-customizations',
			}
		);

		setIsOpenContextMenu(false);
	};

	const handleOnEnable = (status: boolean, currentStyle: Object) => {
		const { blockeraMetaData = {} } = globalStyles;
		const updatedMetaData = mergeObject(blockeraMetaData, {
			blocks: {
				[blockName]: {
					variations: {
						[currentStyle.name]: {
							status,
						},
					},
				},
			},
		});

		setGlobalStyles({
			...globalStyles,
			blockeraMetaData: updatedMetaData,
		});
		window.blockeraGlobalStylesMetaData = updatedMetaData;

		setCachedStyle({
			...cachedStyle,
			status,
		});

		if (false === status) {
			setCurrentBlockStyleVariation(undefined);
			setCurrentActiveStyle(getDefaultStyle(blockStyles));
		}
	};

	const handleOnDelete = (currentStyleName) => {
		setBlockStyles(
			blockStyles.filter((style) => style.name !== currentStyleName)
		);

		unregisterBlockStyle(blockName, currentStyleName);

		setStyles({
			...styles,
			variations: Object.fromEntries(
				Object.entries(styles.variations).filter(
					([key]) => key !== currentStyleName
				)
			),
		});

		setCurrentBlockStyleVariation(undefined);
	};

	return {
		handleOnEnable,
		handleOnDelete,
		handleOnDuplicate,
		handleOnClearAllCustomizations,
	};
};
