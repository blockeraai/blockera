// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import {
	useBlockDisplayInformation,
	__experimentalBlockVariationTransforms as BlockVariationTransforms,
} from '@wordpress/block-editor';
import { Slot } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { Breadcrumb } from './breadcrumb';
import { default as BlockIcon } from './block-icon';
import type { TStates } from '../../block-states/types';
import type { UpdateBlockEditorSettings } from '../../types';
import type { InnerBlockModel, InnerBlockType } from '../../inner-blocks/types';

export function BlockCard({
	states,
	clientId,
	children,
	activeState,
	activeBlock,
	innerBlocks,
	handleOnClick,
	currentInnerBlock,
	activeInnerBlockState,
}: {
	states: Object,
	clientId: string,
	activeState: TStates,
	children?: MixedElement,
	activeInnerBlockState: TStates,
	currentInnerBlock: InnerBlockModel,
	activeBlock: 'master' | InnerBlockType,
	handleOnClick: UpdateBlockEditorSettings,
	innerBlocks: { [key: 'master' | InnerBlockType | string]: InnerBlockModel },
}): MixedElement {
	const blockInformation = useBlockDisplayInformation(clientId);

	return (
		<div className={extensionClassNames('block-card')}>
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
						onClick={() => handleOnClick('current-block', 'master')}
					>
						{blockInformation.title}
						<Breadcrumb
							states={states}
							activeBlock={activeBlock}
							activeState={activeState}
							innerBlocks={innerBlocks}
							currentInnerBlock={currentInnerBlock}
							activeInnerBlockState={activeInnerBlockState}
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

			<Slot name={'publisher-core-block-card-children'} />
			{children}
		</div>
	);
}
