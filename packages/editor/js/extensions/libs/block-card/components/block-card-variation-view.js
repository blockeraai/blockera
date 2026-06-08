// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import type { MixedElement } from 'react';
import { Slot } from '@wordpress/components';
import { useState, useMemo, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { Tooltip, Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Breadcrumb } from './breadcrumb';
import { default as BlockIcon } from './block-icon';
import { EditableBlockName } from './editable-block-name';
import type { TStyleVariationBlockCardLabels } from '../types';
import type { TBreakpoint, TStates } from '../block-states/types';
import type { InnerBlockType, InnerBlockModel } from '../inner-blocks/types';
import StateContainer from '../../../components/state-container';
import { Preview as BlockCompositePreview } from '../../block-composite';
import BlockPreviewPanel from '../../../../editor/global-styles/panel/block-preview-panel';
import { VariationBlockCardSettingsMenu } from '../../../../editor/global-styles/panel/ui/variation-block-card-settings-menu';
import { useResetBlockStateToNormal } from '../block-states/hooks';
import { useGlobalStylesPanelContext } from '../../../../editor/global-styles/panel/context';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../../../../editor/global-styles/panel/variation-surfaces';
import { BLOCK_SIZE_VARIATION_CLASS_PREFIX } from '../../../../editor/global-styles/panel/size-variations';
import { getStyleVariationBlockCardSlotNames } from './block-card-variation-slots';
import { useBlockCardVariationTitle } from './use-block-card-variation-title';
import type { UpdateBlockEditorSettings } from '../../types';

export function BlockCardVariationView({
	clientId,
	isActive,
	children,
	supports,
	blockName,
	labels,
	slotName,
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
	variationsProps,
}: {
	clientId: string,
	isActive: boolean,
	blockName: string,
	labels?: TStyleVariationBlockCardLabels,
	slotName: string,
	supports: Object,
	currentStateAttributes: Object,
	additional: Object,
	availableStates: Object,
	children?: MixedElement,
	currentInnerBlock: InnerBlockModel,
	blockeraInnerBlocks: Object,
	currentBlockStyleVariation: Object,
	setCurrentBlockStyleVariation: (Object) => void,
	variationsProps?: Object,
	currentBlock: 'master' | InnerBlockType | string,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
	insideBlockInspector: boolean,
	handleOnChangeAttributes: Function,
	setAttributes: (Object) => void,
	handleOnClick: UpdateBlockEditorSettings,
}): MixedElement {
	const resolvedLabels = {
		closeTooltip: __('Close Block Style', 'blockera'),
		closeButtonDataTest: 'Close Block Style',
		settingsTooltip: __('Style Variation Settings', 'blockera'),
		settingsButtonDataTest: 'Style Variation Settings',
		rootDataTest: 'blockera-style-variation-block-card',
		...labels,
	};

	const variationKey = currentBlockStyleVariation?.name ?? '';

	const { afterPreview: slotAfterPreviewName, children: slotChildrenName } =
		getStyleVariationBlockCardSlotNames(slotName, variationKey);

	const {
		selectedBlockClientId,
		statesManagerHandleOnChangeRef,
		extensionsUiContext,
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

	const [hasUserEdited, setHasUserEdited] = useState(false);

	const { title, handleTitleChange } = useBlockCardVariationTitle({
		blockName,
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
		blockeraGlobalStylesMetaData,
		hasUserEdited,
		setHasUserEdited,
	});

	const resetBlockStateToNormal = useResetBlockStateToNormal({
		clientId,
		blockName,
		statesManagerHandleOnChangeRef,
		extensionsUiContext,
	});

	const compositePreviewBlock = useMemo(
		() => ({
			supports,
			clientId,
			blockName,
			setAttributes,
			selectedBlockClientId,
			currentBlockStyleVariation,
		}),
		[
			supports,
			clientId,
			blockName,
			setAttributes,
			selectedBlockClientId,
			variationKey,
			currentBlockStyleVariation?.isDefault,
		]
	);

	const compositeBlockStatesProps = useMemo(
		() => ({
			attributes: currentStateAttributes,
		}),
		[
			currentStateAttributes?.blockeraBlockStates,
			currentStateAttributes?.blockeraUnsavedData?.states,
			currentStateAttributes?.blockeraInnerBlocks,
		]
	);

	const compositeInnerBlocksProps = useMemo(
		() => ({
			values: currentStateAttributes.blockeraInnerBlocks,
			innerBlocks: blockeraInnerBlocks,
		}),
		[currentStateAttributes.blockeraInnerBlocks, blockeraInnerBlocks]
	);

	const handleStatesManagerReady = useCallback((handleOnChange) => {
		statesManagerHandleOnChangeRef.current = handleOnChange;
	}, []);

	const handleClose = () => {
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
							icon={
								variationSurface === VARIATION_SURFACE_SIZE
									? 'size-variations'
									: 'style-variations'
							}
							iconSize={24}
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
								'block-card__settings',
								'block-card__settings--has-menu'
							)}
						>
							{variationsProps && (
								<VariationBlockCardSettingsMenu
									blockName={blockName}
									pickerVariationSurface={variationSurface}
									currentBlockStyleVariation={
										currentBlockStyleVariation
									}
									variationsProps={variationsProps}
								/>
							)}

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
					insideBlockInspector={insideBlockInspector}
					variationSurface={variationSurface}
					availableStates={availableStates}
					blockeraUnsavedData={
						currentStateAttributes?.blockeraUnsavedData
					}
				>
					<Slot name={slotChildrenName} />
				</StateContainer>

				{children}

				{isActive && (
					<BlockCompositePreview
						block={compositePreviewBlock}
						insideBlockInspector={false}
						variationSurface={variationSurface}
						availableStates={availableStates}
						onChange={handleOnChangeAttributes}
						currentBlock={currentBlock}
						currentState={currentState}
						currentBreakpoint={currentBreakpoint}
						currentInnerBlockState={currentInnerBlockState}
						blockConfig={additional}
						blockStatesProps={compositeBlockStatesProps}
						innerBlocksProps={compositeInnerBlocksProps}
						onStatesManagerReady={handleStatesManagerReady}
					/>
				)}
			</Flex>
		</div>
	);
}
