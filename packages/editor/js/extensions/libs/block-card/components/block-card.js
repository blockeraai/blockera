// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import {
	useBlockDisplayInformation,
	__experimentalBlockVariationTransforms as BlockVariationTransforms,
} from '@wordpress/block-editor';
import { Slot } from '@wordpress/components';
import { useState, useRef, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { Breadcrumb } from './breadcrumb';
import { default as BlockIcon } from './block-icon';
import type { StateTypes } from '../../block-states/types';
import type { UpdateBlockEditorSettings } from '../../types';
import type { InnerBlockModel, InnerBlockType } from '../../inner-blocks/types';

export function BlockCard({
	states,
	clientId,
	children,
	blockName,
	handleOnClick,
	currentInnerBlock,
}: {
	clientId: string,
	blockName: string,
	states: StateTypes,
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

	return (
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
				<BlockIcon icon={blockInformation.icon} />

				<div
					className={extensionInnerClassNames('block-card__content')}
				>
					{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
					<h2
						className={extensionInnerClassNames(
							'block-card__title'
						)}
					>
						<span
							className={extensionInnerClassNames(
								'block-card__title__block'
							)}
							onClick={() =>
								handleOnClick('current-block', 'master')
							}
							aria-label={__('Selected Block', 'blockera')}
						>
							{blockInformation.title}
						</span>

						<Breadcrumb
							states={states}
							clientId={clientId}
							blockName={blockName}
							currentInnerBlock={currentInnerBlock}
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
	);
}
