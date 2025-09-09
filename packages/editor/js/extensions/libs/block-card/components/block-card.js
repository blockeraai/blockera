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
import { BlockStyleVariations } from '../style-variations';
import type { TBreakpoint, TStates } from '../block-states/types';
import { Preview as BlockCompositePreview } from '../../block-composite';
import type { InnerBlockType, InnerBlockModel } from '../inner-blocks/types';
import { default as BlockVariationTransforms } from '../block-variation-transforms';
import BlockPreviewPanel from '../../../../canvas-editor/components/block-global-styles-panel-screen/block-preview-panel';

export function BlockCard({
	notice,
	isActive,
	clientId,
	supports,
	children,
	blockName,
	additional,
	currentBlock,
	currentState,
	setAttributes,
	availableStates,
	currentInnerBlock,
	currentBreakpoint,
	blockeraInnerBlocks,
	insideBlockInspector,
	currentStateAttributes,
	currentInnerBlockState,
	handleOnChangeAttributes,
	currentBlockStyleVariation,
	setCurrentBlockStyleVariation,
}: {
	isActive: boolean,
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
	innerBlocks: { [key: 'master' | InnerBlockType | string]: InnerBlockModel },
	currentBlockStyleVariation: Object,
	setCurrentBlockStyleVariation: (variation: Object) => void,
}): MixedElement {
	const {
		icon: blockIcon,
		title: blockTitle,
		description: blockDescription,
	} = getBlockType(blockName);
	const blockInformation = useBlockDisplayInformation(clientId);
	const [name, setName] = useState(
		blockInformation?.name || blockTitle || ''
	);
	const [title, setTitle] = useState(blockInformation?.title || blockTitle);

	useEffect(() => {
		// Name changed from outside
		if (blockInformation?.name && blockInformation.name.trim() !== name) {
			setName(blockInformation?.name);
		}

		if (blockTitle && blockTitle.trim() !== name) {
			setName(blockTitle);
		}

		// title changed from outside. For example: changing block variation
		if (blockInformation?.title !== title) {
			setTitle(blockInformation?.title);
		}

		if (blockTitle && blockTitle.trim() !== title) {
			setTitle(blockTitle);
		}

		// eslint-disable-next-line
	}, [
		blockName,
		blockTitle,
		blockInformation?.title,
		blockInformation?.name,
	]);

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

	return (
		<>
			{notice}
			<div
				className={extensionClassNames('block-card', {
					'master-block-card': true,
					'inner-block-is-selected': currentInnerBlock !== null,
				})}
				data-test={'blockera-block-card'}
			>
				<div className={extensionInnerClassNames('block-card__inner')}>
					{parentNavBlockClientId && ( // This is only used by the Navigation block for now. It's not ideal having Navigation block specific code here.
						<Button
							onClick={() => selectBlock(parentNavBlockClientId)}
							label={__(
								'Go to parent Navigation block',
								'blockera'
							)}
							style={{ minWidth: 24, padding: 0, height: 24 }}
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

					<BlockIcon icon={blockInformation?.icon || blockIcon} />

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
										'is-edited': name && name !== title,
									}
								)}
							>
								<EditableBlockName
									content={name}
									placeholder={title}
									onChange={handleTitleChange}
									contentEditable={insideBlockInspector}
								/>
							</Flex>

							<Breadcrumb
								clientId={clientId}
								blockName={blockName}
								blockeraUnsavedData={
									currentStateAttributes?.blockeraUnsavedData
								}
								availableStates={availableStates}
							/>
						</h2>

						{insideBlockInspector &&
							(blockInformation?.description ||
								blockDescription) && (
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

				<Flex
					gap={10}
					direction="column"
					style={{
						margin: '0 -3px',
					}}
				>
					<div
						className={extensionInnerClassNames(
							'block-card__actions',
							{
								'no-flex': !insideBlockInspector,
							}
						)}
					>
						{!insideBlockInspector && (
							<BlockPreviewPanel
								name={blockName}
								variation={''}
							/>
						)}

						<BlockStyleVariations
							clientId={clientId}
							blockName={blockName}
							currentBlock={currentBlock}
							currentState={currentState}
							context={
								insideBlockInspector
									? 'inspector-controls'
									: 'global-styles-panel'
							}
							currentBreakpoint={currentBreakpoint}
							currentBlockStyleVariation={
								currentBlockStyleVariation
							}
							setCurrentBlockStyleVariation={
								setCurrentBlockStyleVariation
							}
						/>

						<BlockVariationTransforms blockClientId={clientId} />
					</div>

					<Slot name={'blockera-block-card-children'} />

					{children}

					{isActive && (
						<BlockCompositePreview
							block={{
								clientId,
								supports,
								blockName,
								setAttributes,
							}}
							blockConfig={additional}
							onChange={handleOnChangeAttributes}
							currentBlock={'master'}
							currentState={currentState}
							currentBreakpoint={currentBreakpoint}
							currentInnerBlockState={currentInnerBlockState}
							blockStatesProps={{
								attributes: currentStateAttributes,
							}}
							availableStates={availableStates}
							innerBlocksProps={{
								values: currentStateAttributes.blockeraInnerBlocks,
								innerBlocks: blockeraInnerBlocks,
							}}
							currentBlockStyleVariation={
								currentBlockStyleVariation
							}
							setCurrentBlockStyleVariation={
								setCurrentBlockStyleVariation
							}
						/>
					)}
				</Flex>
			</div>
		</>
	);
}
