// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, isRTL } from '@wordpress/i18n';
import {
	store as blockEditorStore,
	useBlockDisplayInformation,
} from '@wordpress/block-editor';
import { Slot } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { getBlockType } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import {
	classNames,
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';
import { Button, Flex } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Breadcrumb } from './breadcrumb';
import { default as BlockIcon } from './block-icon';
import { EditableBlockName } from './editable-block-name';
import type { TBreakpoint, TStates } from '../block-states/types';
import { Preview as BlockCompositePreview } from '../../block-composite';
import type { InnerBlockType, InnerBlockModel } from '../inner-blocks/types';
import {
	BlockStyleVariations,
	BlockSizeVariations,
} from '../../../../editor/global-styles/panel/ui';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../../../../editor/global-styles/panel/variation-surfaces';
import { useBlockVariationSupport } from '../../../../editor/global-styles/panel/use-block-variation-support';
import { useGlobalStylesPanelContext } from '../../../../editor/global-styles/panel/context';
import { isEphemeralDefaultSizeVariation } from '../../../../editor/global-styles/panel/size-variations';
import { STORE_NAME } from '../../../../store/constants';
import { default as BlockVariationTransforms } from '../block-variation-transforms';
import { BlockCardSettings } from './block-card-settings';
import { BlockCardVariationView } from './block-card-variation-view';
import type { TStyleVariationBlockCardLabels } from '../types';
import type { UpdateBlockEditorSettings } from '../../types';

const closeVariationPicker = (pickerProps: Object): void => {
	pickerProps.setIsOpen(false);
	pickerProps.setCurrentPreviewStyle(null);
};

export function BlockCard({
	notice,
	isActive,
	setActive,
	clientId,
	supports,
	children,
	blockName,
	additional,
	currentBlock,
	currentState,
	setAttributes,
	setCurrentTab,
	availableStates,
	currentInnerBlock,
	currentBreakpoint,
	blockeraInnerBlocks,
	insideBlockInspector,
	currentStateAttributes,
	currentInnerBlockState,
	handleOnChangeAttributes,
	blockStyleVariationsProps,
	blockSizeVariationsProps = {},
	currentBlockStyleVariation,
	activeBlockVariation = '',
	editorClientId,
	handleOnClick,
	setCurrentBlockStyleVariation,
	variationBlockCardSlotName,
	variationBlockCardLabels,
}: {
	isActive: boolean,
	setActive: (isActive: boolean) => void,
	clientId: string,
	blockName: string,
	supports: Object,
	availableStates: Object,
	blockeraInnerBlocks: Object,
	insideBlockInspector: boolean,
	currentStateAttributes: Object,
	additional: Object,
	notice: MixedElement,
	children?: MixedElement,
	currentInnerBlock: InnerBlockModel,
	setCurrentTab: (tab: string) => void,
	currentBlock: 'master' | InnerBlockType | string,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
	handleOnChangeAttributes: (
		attribute: string,
		value: any,
		options?: Object
	) => void,
	setAttributes: (attributes: Object) => void,
	currentBlockStyleVariation?: {
		name: string,
		label: string,
		isDefault?: boolean,
	},
	innerBlocks: { [key: 'master' | InnerBlockType | string]: InnerBlockModel },
	activeBlockVariation: string,
	blockStyleVariationsProps: Object,
	blockSizeVariationsProps?: Object,
	editorClientId?: string,
	handleOnClick?: UpdateBlockEditorSettings,
	setCurrentBlockStyleVariation?: (style: {
		name: string,
		label: string,
		isDefault?: boolean,
	}) => void,
	variationBlockCardSlotName?: string,
	variationBlockCardLabels?: TStyleVariationBlockCardLabels,
}): MixedElement {
	const {
		variationSurface: panelVariationSurface = VARIATION_SURFACE_STYLE,
	} = useGlobalStylesPanelContext();
	const { hasStyleVariations, hasSizeVariations } =
		useBlockVariationSupport(blockName);

	const { selectedStyleSurfaceVariation, selectedSizeSurfaceVariation } =
		useSelect((select) => {
			const editorStore = select(STORE_NAME);

			return {
				selectedStyleSurfaceVariation:
					editorStore.getSelectedBlockStyleVariation(),
				selectedSizeSurfaceVariation:
					editorStore.getSelectedBlockSizeVariation?.(),
			};
		}, []);

	const isStyleSurfaceVariationActive =
		Boolean(selectedStyleSurfaceVariation?.name) ||
		selectedStyleSurfaceVariation?.isDefault === true;

	const isSizeSurfaceVariationActive =
		Boolean(selectedSizeSurfaceVariation?.name) ||
		(hasSizeVariations &&
			isEphemeralDefaultSizeVariation(selectedSizeSurfaceVariation));

	const isOppositeSurfaceVariationActive =
		!insideBlockInspector &&
		(panelVariationSurface === VARIATION_SURFACE_STYLE
			? isSizeSurfaceVariationActive
			: isStyleSurfaceVariationActive);

	const {
		icon: blockIcon,
		title: blockTitle,
		description: blockDescription,
	} = getBlockType(blockName);
	const blockInformation = useBlockDisplayInformation(clientId);
	const [name, setName] = useState(
		insideBlockInspector
			? blockInformation?.name || ''
			: blockInformation?.name || blockTitle || ''
	);
	const [title, setTitle] = useState(blockInformation?.title || blockTitle);
	const [hasSelectionDelay, setHasSelectionDelay] = useState(false);

	useEffect(() => {
		// Name changed from outside
		if (blockInformation?.name && blockInformation.name.trim() !== name) {
			setName(blockInformation?.name);
		}

		// title changed from outside. For example: changing block variation
		if (blockInformation?.title !== title) {
			setTitle(blockInformation?.title);
		}

		// eslint-disable-next-line
	}, [blockInformation?.name, blockInformation?.title]);

	useEffect(() => {
		// Check if inner block or style variation is selected
		const isSelected =
			currentInnerBlock !== null ||
			Boolean(currentBlockStyleVariation?.name) ||
			isEphemeralDefaultSizeVariation(currentBlockStyleVariation);

		if (isSelected) {
			// Add delay class instantly
			setHasSelectionDelay(true);

			// Remove delay class after 300ms
			const timer = setTimeout(() => {
				setHasSelectionDelay(false);
			}, 1000);

			return () => clearTimeout(timer);
		}
		// Reset delay when nothing is selected
		setHasSelectionDelay(false);
	}, [currentInnerBlock, currentBlockStyleVariation]);

	const { parentNavBlockClientId } = useSelect((select) => {
		const { getSelectedBlockClientId, getBlockParentsByBlockName } =
			select(blockEditorStore);

		const _selectedBlockClientId = getSelectedBlockClientId();

		return {
			parentNavBlockClientId: getBlockParentsByBlockName(
				_selectedBlockClientId,
				'core/navigation',
				true
			)[0],
		};
	}, []);

	const { selectBlock } = useDispatch(blockEditorStore);

	const handleTitleChange = (newTitle: string) => {
		setName(newTitle);

		if (newTitle.trim() === '') {
			// If input is cleared, remove the name attribute and show block title
			handleOnChangeAttributes('name', null, {});
			setName(''); // clear name then placeholder shows block title
		} else if (newTitle !== title) {
			// Only update if the new title is different from the block title
			handleOnChangeAttributes('name', newTitle.trim(), {});
		}
	};

	const hasExclusiveInspectorVariationPickers =
		hasStyleVariations && hasSizeVariations;

	const blockInspectorVariationUI = (
		<>
			<div
				data-style-variations-anchor
				className={extensionInnerClassNames(
					'block-card__variations-picker-anchor'
				)}
			>
				{hasStyleVariations && (
					<BlockStyleVariations
						{...blockStyleVariationsProps}
						variationUiSurface={VARIATION_SURFACE_STYLE}
						clientId={clientId}
						blockName={blockName}
						currentBlock={currentBlock}
						currentState={currentState}
						context={'inspector-controls'}
						currentBreakpoint={currentBreakpoint}
						closeSiblingPicker={
							hasExclusiveInspectorVariationPickers
								? () =>
										closeVariationPicker(
											blockSizeVariationsProps
										)
								: undefined
						}
					/>
				)}
				{hasSizeVariations && (
					<BlockSizeVariations
						{...blockSizeVariationsProps}
						clientId={clientId}
						blockName={blockName}
						currentBlock={currentBlock}
						currentState={currentState}
						context={'inspector-controls'}
						currentBreakpoint={currentBreakpoint}
						closeSiblingPicker={
							hasExclusiveInspectorVariationPickers
								? () =>
										closeVariationPicker(
											blockStyleVariationsProps
										)
								: undefined
						}
					/>
				)}
			</div>
			<BlockVariationTransforms blockClientId={clientId} />
		</>
	);

	const globalStylesPanelVariationUI = (() => {
		if (panelVariationSurface === VARIATION_SURFACE_SIZE) {
			if (!hasSizeVariations) {
				return null;
			}

			return (
				<BlockSizeVariations
					{...blockSizeVariationsProps}
					clientId={clientId}
					blockName={blockName}
					currentBlock={currentBlock}
					currentState={currentState}
					context={'global-styles-panel'}
					currentBreakpoint={currentBreakpoint}
				/>
			);
		}

		if (!hasStyleVariations) {
			return null;
		}

		return (
			<BlockStyleVariations
				{...blockStyleVariationsProps}
				variationUiSurface={VARIATION_SURFACE_STYLE}
				clientId={clientId}
				blockName={blockName}
				currentBlock={currentBlock}
				currentState={currentState}
				context={'global-styles-panel'}
				currentBreakpoint={currentBreakpoint}
			/>
		);
	})();

	const variationActionsUI = insideBlockInspector
		? blockInspectorVariationUI
		: globalStylesPanelVariationUI;

	const showSizeVariationActions =
		hasSizeVariations &&
		insideBlockInspector &&
		Array.isArray(blockSizeVariationsProps?.stylesToRender) &&
		blockSizeVariationsProps.stylesToRender.length > 0;

	const isStyleVariationSelected =
		Boolean(currentBlockStyleVariation?.name) ||
		(hasSizeVariations &&
			isEphemeralDefaultSizeVariation(currentBlockStyleVariation));
	const showStyleVariationBlockCard =
		!insideBlockInspector && isStyleVariationSelected;

	const canRenderVariationBlockCard =
		showStyleVariationBlockCard &&
		Boolean(currentBlockStyleVariation) &&
		Boolean(setCurrentBlockStyleVariation) &&
		Boolean(handleOnClick) &&
		Boolean(variationBlockCardSlotName);

	const showVariationPickerUi =
		!showStyleVariationBlockCard && !isOppositeSurfaceVariationActive;

	const isGlobalStylesVariationIdentityActive =
		!insideBlockInspector && showStyleVariationBlockCard;

	const showMasterBlockHeader =
		insideBlockInspector ||
		isGlobalStylesVariationIdentityActive ||
		(panelVariationSurface === VARIATION_SURFACE_STYLE &&
			!isOppositeSurfaceVariationActive);

	const showBlockCardSettings =
		insideBlockInspector ||
		isGlobalStylesVariationIdentityActive ||
		(panelVariationSurface === VARIATION_SURFACE_STYLE &&
			!isOppositeSurfaceVariationActive &&
			!showStyleVariationBlockCard);

	const showMasterBlockCard =
		insideBlockInspector || showMasterBlockHeader || showVariationPickerUi;

	return (
		<>
			{notice}
			{showMasterBlockCard && (
				<div
					className={extensionClassNames('block-card', {
						'master-block-card': true,
						'outside-block-inspector': !insideBlockInspector,
						'inner-block-is-selected': currentInnerBlock !== null,
						'style-variation-is-selected': isStyleVariationSelected,
						'is-selected-delay': hasSelectionDelay,
					})}
					data-test={'blockera-block-card'}
				>
					{showMasterBlockHeader && (
						<div
							className={extensionInnerClassNames(
								'block-card__inner'
							)}
						>
							{parentNavBlockClientId && (
								<Button
									onClick={() =>
										selectBlock(parentNavBlockClientId)
									}
									label={__(
										'Go to parent Navigation block',
										'blockera'
									)}
									style={{
										minWidth: 24,
										padding: 0,
										height: 24,
									}}
									icon={
										<Icon
											library="wp"
											icon={
												isRTL()
													? 'chevron-right'
													: 'chevron-left'
											}
											size={16}
										/>
									}
									size="small"
									className="no-border"
									data-test="back-to-parent-navigation"
								/>
							)}

							<BlockIcon
								icon={blockInformation?.icon || blockIcon}
							/>

							<div
								className={extensionInnerClassNames(
									'block-card__content'
								)}
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
												'inside-block-inspector':
													insideBlockInspector,
												'is-edited':
													name && name !== title,
											}
										)}
									>
										<EditableBlockName
											content={name}
											placeholder={title}
											onChange={handleTitleChange}
											contentEditable={
												insideBlockInspector
											}
										/>
									</Flex>

									{insideBlockInspector && (
										<Breadcrumb
											clientId={clientId}
											blockName={blockName}
											blockeraUnsavedData={
												currentStateAttributes?.blockeraUnsavedData
											}
											availableStates={availableStates}
										/>
									)}
								</h2>

								{(blockInformation?.description ||
									blockDescription) &&
									!showStyleVariationBlockCard && (
										<span
											className={extensionInnerClassNames(
												'block-card__description'
											)}
										>
											{blockInformation?.description ||
												blockDescription}
										</span>
									)}
							</div>
						</div>
					)}

					{isGlobalStylesVariationIdentityActive ? (
						showBlockCardSettings && (
							<BlockCardSettings
								blockName={blockName}
								activeBlockVariation={activeBlockVariation}
								isActive={isActive}
								setActive={setActive}
								actionsMenu={insideBlockInspector}
								poweredBy={true}
							/>
						)
					) : (
						<Flex
							gap={10}
							direction="column"
							style={{
								margin: insideBlockInspector ? '0 -3px' : '0',
							}}
						>
							<Flex
								className={classNames(
									extensionInnerClassNames(
										'block-card__actions',
										{
											'no-flex': !insideBlockInspector,
										}
									),
									showSizeVariationActions &&
										'justify-content-flex-start'
								)}
							>
								{showVariationPickerUi && variationActionsUI}
							</Flex>

							<Slot name={'blockera-block-card-children'} />

							{showBlockCardSettings && (
								<BlockCardSettings
									blockName={blockName}
									activeBlockVariation={activeBlockVariation}
									isActive={isActive}
									setActive={setActive}
									actionsMenu={insideBlockInspector}
									poweredBy={true}
								/>
							)}

							{children}

							{isActive && insideBlockInspector && (
								<BlockCompositePreview
									block={{
										clientId,
										supports,
										blockName,
										setAttributes,
										currentBlockStyleVariation,
									}}
									setCurrentTab={setCurrentTab}
									blockConfig={additional}
									onChange={handleOnChangeAttributes}
									currentBlock={'master'}
									currentState={currentState}
									currentBreakpoint={currentBreakpoint}
									currentInnerBlockState={
										currentInnerBlockState
									}
									blockStatesProps={{
										attributes: currentStateAttributes,
									}}
									availableStates={availableStates}
									innerBlocksProps={{
										values: currentStateAttributes.blockeraInnerBlocks,
										innerBlocks: blockeraInnerBlocks,
									}}
								/>
							)}
						</Flex>
					)}
				</div>
			)}

			{canRenderVariationBlockCard &&
				currentBlockStyleVariation &&
				setCurrentBlockStyleVariation &&
				handleOnClick &&
				variationBlockCardSlotName && (
					<BlockCardVariationView
						clientId={editorClientId || clientId}
						isActive={isActive}
						blockName={blockName}
						labels={variationBlockCardLabels}
						slotName={variationBlockCardSlotName}
						variationsProps={
							panelVariationSurface === VARIATION_SURFACE_SIZE
								? blockSizeVariationsProps
								: blockStyleVariationsProps
						}
						supports={supports}
						currentStateAttributes={currentStateAttributes}
						additional={additional}
						availableStates={availableStates}
						currentInnerBlock={currentInnerBlock}
						blockeraInnerBlocks={blockeraInnerBlocks}
						currentBlockStyleVariation={currentBlockStyleVariation}
						setCurrentBlockStyleVariation={
							setCurrentBlockStyleVariation
						}
						currentBlock={currentBlock}
						currentState={currentState}
						currentBreakpoint={currentBreakpoint}
						currentInnerBlockState={currentInnerBlockState}
						insideBlockInspector={insideBlockInspector}
						handleOnChangeAttributes={handleOnChangeAttributes}
						setAttributes={setAttributes}
						handleOnClick={handleOnClick}
					>
						{children}
					</BlockCardVariationView>
				)}
		</>
	);
}
