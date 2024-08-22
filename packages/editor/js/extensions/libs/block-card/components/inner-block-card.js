// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';
import { kebabCase } from '@blockera/utils';
import { Icon } from '@blockera/icons';
import { Tooltip } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Breadcrumb } from './breadcrumb';
import { default as BlockIcon } from './block-icon';
import type { UpdateBlockEditorSettings } from '../../types';
import type { InnerBlockModel, InnerBlockType } from '../../inner-blocks/types';
import type { StateTypes } from '../../block-states/types';

export function InnerBlockCard({
	states,
	clientId,
	children,
	blockName,
	activeBlock,
	innerBlocks,
	handleOnClick,
	currentInnerBlock,
}: {
	clientId: string,
	blockName: string,
	states: StateTypes,
	children?: MixedElement,
	currentInnerBlock: InnerBlockModel,
	activeBlock: 'master' | InnerBlockType,
	handleOnClick: UpdateBlockEditorSettings,
	innerBlocks: { [key: 'master' | InnerBlockType | string]: InnerBlockModel },
}): MixedElement {
	const { getBlockType } = select('core/blocks');
	const { getExtensionCurrentBlock } = select('blockera/extensions');

	const getInnerBlockDetails = (): Object => {
		if (innerBlocks[activeBlock]) {
			return innerBlocks[activeBlock];
		}

		const registeredBlock = getBlockType(getExtensionCurrentBlock());

		if (!registeredBlock) {
			return {};
		}

		return {
			...registeredBlock,
			label: registeredBlock?.title,
		};
	};

	const blockInformation = getInnerBlockDetails();

	return (
		<div
			className={extensionClassNames(
				'block-card',
				'block-card--inner-block'
			)}
			data-test={'blockera-block-card'}
		>
			<div className={extensionInnerClassNames('block-card__inner')}>
				<BlockIcon icon={blockInformation?.icon} />

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
								handleOnClick('current-block', activeBlock)
							}
							aria-label={__('Selected Inner Block', 'blockera')}
						>
							{blockInformation?.label}
						</span>

						<Breadcrumb
							states={states}
							clientId={clientId}
							blockName={blockName}
							activeBlock={activeBlock}
							currentInnerBlock={currentInnerBlock}
						/>

						<Tooltip text={__('Close Inner Block', 'blockera')}>
							<Icon
								className={extensionInnerClassNames(
									'block-card__close'
								)}
								library="wp"
								icon="close-small"
								iconSize="24"
								onClick={() =>
									handleOnClick('current-block', 'master')
								}
							/>
						</Tooltip>
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

			<Slot
				name={`blockera-${kebabCase(
					activeBlock
				)}-inner-block-card-children`}
			/>
			{children}
		</div>
	);
}
