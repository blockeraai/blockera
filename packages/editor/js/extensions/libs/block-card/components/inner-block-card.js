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
import type { InnerBlockModel, InnerBlockType } from '../inner-blocks/types';
import StateContainer from '../../../components/state-container';
import { useBlockSection } from '../../../components';
import type { TBreakpoint, TStates } from '../block-states/types';
import { Preview as BlockCompositePreview } from '../../block-composite';

export function InnerBlockCard({
	clientId,
	children,
	supports,
	blockName,
	activeBlock,
	innerBlocks,
	handleOnClick,
	currentBlock,
	currentState,
	setAttributes,
	currentBreakpoint,
	availableStates,
	additional,
	currentStateAttributes,
	currentInnerBlockState,
	handleOnChangeAttributes,
}: {
	clientId: string,
	blockName: string,
	supports: Object,
	currentStateAttributes: Object,
	additional: Object,
	availableStates: Object,
	children?: MixedElement,
	activeBlock: 'master' | InnerBlockType,
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
	const { onToggle } = useBlockSection('innerBlocksConfig');

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
							aria-label={__('Selected Inner Block', 'blockera')}
						>
							{blockInformation?.label}
						</span>

						<Breadcrumb
							clientId={clientId}
							blockName={blockName}
							activeBlock={activeBlock}
							availableStates={availableStates}
							blockeraUnsavedData={
								currentStateAttributes?.blockeraUnsavedData
							}
						/>

						<Tooltip text={__('Close Inner Block', 'blockera')}>
							<Icon
								className={extensionInnerClassNames(
									'block-card__close'
								)}
								library="wp"
								icon="close-small"
								iconSize="24"
								data-test={'Close Inner Block'}
								onClick={() => {
									onToggle(true, 'switch-to-parent');
									handleOnClick('current-block', 'master');
								}}
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

			<StateContainer
				availableStates={availableStates}
				blockeraUnsavedData={
					currentStateAttributes?.blockeraUnsavedData
				}
			>
				<Slot
					name={`blockera-${kebabCase(
						activeBlock
					)}-inner-block-card-children`}
				/>
			</StateContainer>

			{children}

			<BlockCompositePreview
				block={{
					clientId,
					supports,
					blockName,
					setAttributes,
				}}
				availableStates={availableStates}
				onChange={handleOnChangeAttributes}
				currentBlock={currentBlock}
				currentState={currentState}
				currentBreakpoint={currentBreakpoint}
				currentInnerBlockState={currentInnerBlockState}
				blockConfig={additional}
				blockStatesProps={{
					attributes: currentStateAttributes,
					id: `block-states-${kebabCase(currentBlock)}`,
				}}
			/>
		</div>
	);
}
