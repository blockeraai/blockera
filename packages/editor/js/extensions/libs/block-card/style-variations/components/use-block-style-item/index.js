// @flow

/**
 * External dependencies
 */
import { useCallback } from '@wordpress/element';
import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { getCalculatedNewStyle } from './helpers';

export const useBlockStyleItem = ({
	styles,
	blockName,
	setStyles,
	blockStyles,
	setBlockStyles,
	setCurrentBlockStyleVariation,
}: {
	styles: Object,
	blockName: string,
	blockStyles: Array<Object>,
	setStyles: (styles: Object) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	setCurrentBlockStyleVariation: (style: Object) => void,
}) => {
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

			setBlockStyles([...blockStyles, duplicateStyle]);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[styles, blockStyles]
	);

	const handleOnClearAllCustomizations = (currentStyle) => {
		setStyles({
			...styles,
			variations: {
				...(styles.variations || {}),
				[currentStyle.name]: {},
			},
		});
	};

	const handleOnEnable = (status) => {
		console.log(status);
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
