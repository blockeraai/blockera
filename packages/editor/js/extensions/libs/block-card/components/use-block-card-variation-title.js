// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';
import {
	useState,
	useMemo,
	useEffect,
	useCallback,
	useRef,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { kebabCase, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { setBlockeraGlobalStylesMetaData } from '../../../../editor/global-styles/helpers';

const DEBOUNCE_DELAY = 1000;

export function useBlockCardVariationTitle({
	blockName,
	currentBlockStyleVariation,
	setCurrentBlockStyleVariation,
	blockeraGlobalStylesMetaData,
	hasUserEdited,
	setHasUserEdited,
}: {
	blockName: string,
	currentBlockStyleVariation: Object,
	setCurrentBlockStyleVariation: (Object) => void,
	blockeraGlobalStylesMetaData: Object,
	hasUserEdited: boolean,
	setHasUserEdited: (boolean) => void,
}): {| title: string, handleTitleChange: (string) => void |} {
	const postId = select('core').__experimentalGetCurrentGlobalStylesId();
	const [globalStyles, setGlobalStyles] = useEntityProp(
		'root',
		'globalStyles',
		'styles',
		postId
	);

	const initializeTitle = useMemo(
		() =>
			blockeraGlobalStylesMetaData?.blocks?.[blockName]?.variations?.[
				currentBlockStyleVariation?.name
			]?.label ||
			currentBlockStyleVariation?.label ||
			'',
		[blockeraGlobalStylesMetaData, blockName, currentBlockStyleVariation]
	);

	const refId = useRef(
		blockeraGlobalStylesMetaData?.blocks?.[blockName]?.variations?.[
			currentBlockStyleVariation?.name
		]?.refId || currentBlockStyleVariation?.name
	);

	const [title, setTitle] = useState(initializeTitle);

	const updateGlobalStyles = useCallback(
		(newTitle: string, isConfirmedChange: boolean = false) => {
			if (!hasUserEdited) {
				return;
			}

			const { blockeraMetaData = blockeraGlobalStylesMetaData } =
				globalStyles;

			const isDefaultProp: Object = currentBlockStyleVariation?.isDefault
				? { isDefault: true }
				: {};

			const editedStyle = {
				...currentBlockStyleVariation,
				label: newTitle,
				...isDefaultProp,
			};

			const getUpdatedMetaData = (newStyle: Object): Object => {
				return mergeObject(blockeraMetaData, {
					blocks: {
						[blockName]: {
							variations: {
								// $FlowFixMe
								[currentBlockStyleVariation?.name]: {
									...newStyle,
									refId: refId.current,
								},
							},
						},
					},
				});
			};

			let updatedMetaData;

			if (isConfirmedChange) {
				editedStyle.name = kebabCase(newTitle);
				updatedMetaData = getUpdatedMetaData(editedStyle);
				setCurrentBlockStyleVariation(editedStyle);

				const editedGlobalStyles = mergeObject(globalStyles, {
					blocks: {
						[blockName]: {
							variations: {
								[editedStyle.name]:
									globalStyles?.blocks?.[blockName]
										?.variations?.[
										currentBlockStyleVariation?.name
									],
							},
						},
					},
				});

				setGlobalStyles({
					...editedGlobalStyles,
					blockeraMetaData: updatedMetaData,
				});

				unregisterBlockStyle(
					blockName,
					currentBlockStyleVariation?.name
				);
				registerBlockStyle(blockName, editedStyle);
			} else {
				updatedMetaData = getUpdatedMetaData(editedStyle);
				setCurrentBlockStyleVariation(editedStyle);

				setGlobalStyles({
					...globalStyles,
					blockeraMetaData: updatedMetaData,
				});
			}

			setBlockeraGlobalStylesMetaData(updatedMetaData);
			setHasUserEdited(true);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			globalStyles,
			blockName,
			currentBlockStyleVariation?.name,
			setGlobalStyles,
			hasUserEdited,
		]
	);

	useEffect(() => {
		refId.current = currentBlockStyleVariation?.name;
	}, [currentBlockStyleVariation?.name]);

	useEffect(() => {
		if (hasUserEdited) {
			return;
		}

		if (
			(!title && initializeTitle) ||
			(title && initializeTitle && title !== initializeTitle)
		) {
			setTitle(initializeTitle);
		}
	}, [title, hasUserEdited, initializeTitle]);

	useEffect(() => {
		if (!title || !initializeTitle || title === initializeTitle) {
			return;
		}

		const timeoutId = setTimeout(
			() => updateGlobalStyles(title),
			DEBOUNCE_DELAY
		);
		return () => clearTimeout(timeoutId);
	}, [title, updateGlobalStyles, initializeTitle, hasUserEdited]);

	const handleTitleChange = useCallback(
		(newTitle: string) => {
			const currentLabel =
				globalStyles?.blockeraMetaData?.blocks?.[blockName]
					?.variations?.[currentBlockStyleVariation?.name]?.label;

			if (currentLabel === newTitle) {
				return;
			}

			setHasUserEdited(true);
			setTitle(newTitle);
		},
		[
			globalStyles,
			blockName,
			currentBlockStyleVariation?.name,
			setHasUserEdited,
		]
	);

	return { title, handleTitleChange };
}
