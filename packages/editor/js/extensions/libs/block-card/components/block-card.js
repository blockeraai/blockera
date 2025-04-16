// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, isRTL } from '@wordpress/i18n';
import {
	store as blockEditorStore,
	useBlockDisplayInformation,
	__experimentalBlockVariationTransforms as BlockVariationTransforms,
} from '@wordpress/block-editor';
import { Slot } from '@wordpress/components';
import { useState, useRef, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';
import { ConditionalWrapper, Tooltip, Button } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Breadcrumb } from './breadcrumb';
import { default as BlockIcon } from './block-icon';
import type { UpdateBlockEditorSettings } from '../../types';
import type { InnerBlockModel, InnerBlockType } from '../../inner-blocks/types';
import { useBlockSection } from '../../../components';

export function BlockCard({
	notice,
	clientId,
	children,
	blockName,
	handleOnClick,
	currentInnerBlock,
}: {
	clientId: string,
	blockName: string,
	notice: MixedElement,
	children?: MixedElement,
	currentInnerBlock: InnerBlockModel,
	handleOnClick: UpdateBlockEditorSettings,
	innerBlocks: { [key: 'master' | InnerBlockType | string]: InnerBlockModel },
}): MixedElement {
	const blockInformation = useBlockDisplayInformation(clientId);

	const contentRef = useRef(null);
	const [isHovered, setIsHovered] = useState(false);
	const [height, setHeight] = useState('auto');
	const maxHeight = '55px';

	useEffect(() => {
		if (currentInnerBlock !== null) {
			if (isHovered) {
				// Calculate the full height of the content
				setHeight(`${contentRef.current.scrollHeight}px`);
			} else {
				// Set to the initial limited height
				setHeight(maxHeight);
			}
		} else {
			setHeight('auto');
		}
	}, [isHovered, currentInnerBlock]);

	// This is only used by the Navigation block for now. It's not ideal having Navigation block specific code here.
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
	const { onToggle } = useBlockSection('innerBlocksConfig');

	return (
		<>
			{notice}
			<div
				ref={contentRef}
				className={extensionClassNames('block-card', {
					'master-block-card': true,
					'inner-block-is-selected': currentInnerBlock !== null,
				})}
				data-test={'blockera-block-card'}
				onMouseEnter={() => {
					setIsHovered(true);
				}}
				onMouseLeave={() => {
					setIsHovered(false);
				}}
				style={{
					height,
				}}
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
							<ConditionalWrapper
								condition={currentInnerBlock !== null}
								wrapper={(children) => (
									<Tooltip
										text={__(
											'Switch to parent block',
											'blockera'
										)}
									>
										{children}
									</Tooltip>
								)}
							>
								<span
									className={extensionInnerClassNames(
										'block-card__title__block',
										{
											'title-is-clickable':
												currentInnerBlock !== null,
										}
									)}
									onClick={() => {
										if (currentInnerBlock !== null) {
											handleOnClick(
												'current-block',
												'master'
											);
											onToggle(true, 'switch-to-parent');
										}
									}}
									aria-label={__(
										'Selected Block',
										'blockera'
									)}
								>
									{blockInformation.name ||
										blockInformation.title}
								</span>
							</ConditionalWrapper>

							<Breadcrumb
								clientId={clientId}
								blockName={blockName}
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

						<BlockVariationTransforms blockClientId={clientId} />
					</div>
				</div>

				<Slot name={'blockera-block-card-children'} />
				{children}
			</div>
		</>
	);
}
