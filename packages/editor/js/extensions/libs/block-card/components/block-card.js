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
import type { TBreakpoint, TStates } from '../block-states/types';
import { Preview as BlockCompositePreview } from '../../block-composite';
import type { InnerBlockType, InnerBlockModel } from '../inner-blocks/types';
import { BlockStyleVariations } from '../style-variations';
import { default as BlockVariationTransforms } from '../block-variation-transforms';

export function BlockCard({
	notice,
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
	currentStateAttributes,
	currentInnerBlockState,
	handleOnChangeAttributes,
}: {
	clientId: string,
	blockName: string,
	supports: Object,
	availableStates: Object,
	blockeraInnerBlocks: Object,
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
}): MixedElement {
	const blockInformation = useBlockDisplayInformation(clientId);
	const [name, setName] = useState(blockInformation.name || '');
	const [title, setTitle] = useState(blockInformation.title);

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
	}, [blockInformation.name, blockInformation.title]);

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

					<BlockIcon icon={blockInformation.icon} />

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
										'is-edited': name && name !== title,
									}
								)}
							>
								<EditableBlockName
									placeholder={title}
									content={name}
									onChange={handleTitleChange}
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

						{blockInformation?.description && (
							<span
								className={extensionInnerClassNames(
									'block-card__description'
								)}
							>
								{blockInformation.description}
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
							'block-card__actions'
						)}
					>
						<BlockStyleVariations
							clientId={clientId}
							currentBlock={currentBlock}
							currentState={currentState}
							currentBreakpoint={currentBreakpoint}
						/>

						<BlockVariationTransforms blockClientId={clientId} />
					</div>

					<Slot name={'blockera-block-card-children'} />

					{children}

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
					/>
				</Flex>
			</div>
		</>
	);
}
