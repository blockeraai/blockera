// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, useSelect } from '@wordpress/data';
import type { MixedElement } from 'react';
import { Slot } from '@wordpress/components';
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
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { kebabCase, mergeObject } from '@blockera/utils';
import { Tooltip, Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Breadcrumb } from './breadcrumb';
import { default as BlockIcon } from './block-icon';
import { EditableBlockName } from './editable-block-name';
import type { TStyleVariationBlockCardProps } from '../types';
import StateContainer from '../../../components/state-container';
import { Preview as BlockCompositePreview } from '../../block-composite';
import { setBlockeraGlobalStylesMetaData } from '../../../../editor/global-styles/helpers';
import BlockPreviewPanel from '../../../../editor/global-styles/panel/block-preview-panel';
import { useResetBlockStateToNormal } from '../block-states/hooks';
import { useGlobalStylesPanelContext } from '../../../../editor/global-styles/panel/context';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../../../../editor/global-styles/panel/variation-surfaces';
import { BLOCK_SIZE_VARIATION_CLASS_PREFIX } from '../../../../editor/global-styles/panel/size-variations';

const DEBOUNCE_DELAY = 1000;

export const DEFAULT_STYLE_VARIATION_BLOCK_CARD_SLOT_NAME =
	'blockera-style-variation-block-card';

export function getStyleVariationBlockCardSlotNames(
	slotNamespace: string,
	variationName: string
): {|
	menu: string,
	afterPreview: string,
	children: string,
|} {
	const key = variationName ?? '';
	const kebabVariation = kebabCase(key);

	const children =
		slotNamespace === DEFAULT_STYLE_VARIATION_BLOCK_CARD_SLOT_NAME
			? `blockera-${kebabVariation}-style-variation-block-card-children`
			: `${slotNamespace}-children-${kebabVariation}`;

	return {
		menu: `${slotNamespace}-menu-${key}`,
		afterPreview: `${slotNamespace}-after-preview-${key}`,
		children,
	};
}

export function StyleVariationBlockCard({
	clientId,
	isActive,
	children,
	supports,
	blockName,
	labels,
	slotName = DEFAULT_STYLE_VARIATION_BLOCK_CARD_SLOT_NAME,
	handleOnClick,
	currentBlock,
	currentState,
	setAttributes,
	currentBreakpoint,
	availableStates,
	additional,
	currentInnerBlock,
	blockeraInnerBlocks,
	insideBlockInspector,
	currentStateAttributes,
	currentInnerBlockState,
	handleOnChangeAttributes,
	currentBlockStyleVariation,
	setCurrentBlockStyleVariation,
}: TStyleVariationBlockCardProps): MixedElement {
	const resolvedLabels = {
		closeTooltip: __('Close Block Style', 'blockera'),
		closeButtonDataTest: 'Close Block Style',
		rootDataTest: 'blockera-style-variation-block-card',
		...labels,
	};

	const variationKey = currentBlockStyleVariation?.name ?? '';

	const {
		menu: slotMenuName,
		afterPreview: slotAfterPreviewName,
		children: slotChildrenName,
	} = getStyleVariationBlockCardSlotNames(slotName, variationKey);

	const {
		selectedBlockClientId,
		statesManagerHandleOnChangeRef,
		variationSurface = VARIATION_SURFACE_STYLE,
	} = useGlobalStylesPanelContext();

	const variationClassPrefix =
		variationSurface === VARIATION_SURFACE_SIZE
			? BLOCK_SIZE_VARIATION_CLASS_PREFIX
			: 'is-style-';
	const blockeraGlobalStylesMetaData = useSelect(
		(select) =>
			select('blockera/editor')?.getBlockeraGlobalStylesMetaData?.() ||
			{},
		[]
	);

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
	const resetBlockStateToNormal = useResetBlockStateToNormal({
		clientId,
		blockName,
		statesManagerHandleOnChangeRef,
	});
	const [title, setTitle] = useState(initializeTitle);
	const [hasUserEdited, setHasUserEdited] = useState(false);

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
				const updatedMetaData = mergeObject(blockeraMetaData, {
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

				return updatedMetaData;
			};

			let updatedMetaData;

			// Is user confirmed the change style name?
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

	if (!currentBlockStyleVariation?.name) {
		return <></>;
	}

	const handleTitleChange = (newTitle: string) => {
		const currentLabel =
			globalStyles?.blockeraMetaData?.blocks?.[blockName]?.variations?.[
				currentBlockStyleVariation?.name
			]?.label;

		if (currentLabel === newTitle) {
			return;
		}

		setHasUserEdited(true);
		setTitle(newTitle);
	};

	const handleClose = () => {
		// Reset block state to normal using the reusable hook
		resetBlockStateToNormal();
		handleOnClick('current-block-style-variation', undefined);
	};

	return (
		<div
			className={extensionClassNames(
				'block-card',
				'block-card--style-variation',
				{
					'inner-block-is-selected': currentInnerBlock !== null,
				}
			)}
			data-test={resolvedLabels.rootDataTest}
		>
			<div
				className={extensionInnerClassNames(
					'block-card__style-variation'
				)}
			>
				<BlockIcon
					icon={
						<Icon
							icon="style-variations-animated"
							iconSize={24}
							isAnimated={true}
						/>
					}
				/>

				<div
					className={extensionInnerClassNames('block-card__content')}
				>
					<h2
						className={extensionInnerClassNames(
							'block-card__title'
						)}
					>
						<Flex
							justifyContent="center"
							alignItems="center"
							className={extensionInnerClassNames(
								'block-card__title__input',
								{
									'is-edited': true,
									'inside-block-inspector': true,
								}
							)}
						>
							<EditableBlockName
								content={title}
								placeholder={
									resolvedLabels.editableNamePlaceholder ??
									currentBlockStyleVariation?.label
								}
								onChange={handleTitleChange}
								contentEditable={true}
							/>
						</Flex>

						<Breadcrumb
							clientId={clientId}
							blockName={blockName}
							availableStates={availableStates}
							blockeraUnsavedData={
								currentStateAttributes?.blockeraUnsavedData
							}
						/>

						<div
							className={extensionInnerClassNames(
								'block-card__settings'
							)}
						>
							<Slot name={slotMenuName} />

							<Tooltip text={resolvedLabels.closeTooltip}>
								<Icon
									className={extensionInnerClassNames(
										'block-card__close'
									)}
									library="wp"
									icon="close-small"
									iconSize="24"
									data-test={
										resolvedLabels.closeButtonDataTest
									}
									onClick={handleClose}
								/>
							</Tooltip>
						</div>
					</h2>
				</div>
			</div>

			<BlockPreviewPanel
				name={blockName}
				variation={currentBlockStyleVariation?.name}
				attributes={currentStateAttributes}
				variationClassPrefix={variationClassPrefix}
				afterPreviewSlotName={slotAfterPreviewName}
			/>

			<Flex
				gap={10}
				direction="column"
				style={{
					margin: '0 -3px',
				}}
			>
				<StateContainer
					name={blockName}
					clientId={clientId}
					isGlobalStylesCard={true}
					availableStates={availableStates}
					insideBlockInspector={insideBlockInspector}
					blockeraUnsavedData={
						currentStateAttributes?.blockeraUnsavedData
					}
				>
					<Slot name={slotChildrenName} />
				</StateContainer>

				{children}

				{isActive && (
					<BlockCompositePreview
						block={{
							supports,
							clientId,
							blockName,
							setAttributes,
							selectedBlockClientId,
							currentBlockStyleVariation,
						}}
						insideBlockInspector={false}
						availableStates={availableStates}
						onChange={handleOnChangeAttributes}
						currentBlock={currentBlock}
						currentState={currentState}
						currentBreakpoint={currentBreakpoint}
						currentInnerBlockState={currentInnerBlockState}
						blockConfig={additional}
						blockStatesProps={{
							attributes: currentStateAttributes,
						}}
						innerBlocksProps={{
							values: currentStateAttributes.blockeraInnerBlocks,
							innerBlocks: blockeraInnerBlocks,
						}}
						onStatesManagerReady={(handleOnChange) => {
							statesManagerHandleOnChangeRef.current =
								handleOnChange;
						}}
					/>
				)}
			</Flex>
		</div>
	);
}
