// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { kebabCase } from '@blockera/utils';
import { Tooltip, Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Breadcrumb } from './breadcrumb';
import { default as BlockIcon } from './block-icon';
import { useBlockSection } from '../../../components';
import type { UpdateBlockEditorSettings } from '../../types';
import type { InnerBlockType } from '../inner-blocks/types';
import StateContainer from '../../../components/state-container';
import type { TBreakpoint, TStates } from '../block-states/types';
import { Preview as BlockCompositePreview } from '../../block-composite';
import { useGlobalStylesPanelContext } from '../../../../canvas-editor/components/block-global-styles-panel-screen/context';

export function StyleVariationBlockCard({
	clientId,
	isActive,
	children,
	supports,
	blockName,
	handleOnClick,
	currentBlock,
	currentState,
	setAttributes,
	currentBreakpoint,
	availableStates,
	additional,
	insideBlockInspector,
	currentStateAttributes,
	currentInnerBlockState,
	handleOnChangeAttributes,
}: {
	clientId: string,
	isActive: boolean,
	blockName: string,
	supports: Object,
	currentStateAttributes: Object,
	additional: Object,
	availableStates: Object,
	children?: MixedElement,
	currentBlock: 'master' | InnerBlockType | string,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
	insideBlockInspector: boolean,
	handleOnChangeAttributes: (
		attribute: string,
		value: any,
		options?: Object
	) => void,
	setAttributes: (attributes: Object) => void,
	handleOnClick: UpdateBlockEditorSettings,
}): MixedElement {
	const { currentBlockStyleVariation } = useGlobalStylesPanelContext() || {
		currentBlockStyleVariation: {
			name: '',
			label: '',
		},
	};

	const { onToggle } = useBlockSection('innerBlocksConfig');

	if (!currentBlockStyleVariation?.name) {
		return <></>;
	}

	return (
		<div
			className={extensionClassNames(
				'block-card',
				'block-card--style-variation'
			)}
			data-test={'blockera-block-card'}
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
							{currentBlockStyleVariation?.label}
						</span>

						<Breadcrumb
							clientId={clientId}
							blockName={blockName}
							activeBlock={currentBlockStyleVariation?.name}
							availableStates={availableStates}
							blockeraUnsavedData={
								currentStateAttributes?.blockeraUnsavedData
							}
						/>

						<Tooltip text={__('Close Block Style', 'blockera')}>
							<Icon
								className={extensionInnerClassNames(
									'block-card__close'
								)}
								library="wp"
								icon="close-small"
								iconSize="24"
								data-test={'Close Block Style'}
								onClick={() => {
									onToggle(true, 'switch-to-parent');
									handleOnClick(
										'current-block-style-variation',
										undefined
									);
								}}
							/>
						</Tooltip>
					</h2>
				</div>
			</div>

			<Flex
				gap={10}
				direction="column"
				style={{
					margin: '0 -3px',
				}}
			>
				<StateContainer
					insideBlockInspector={insideBlockInspector}
					availableStates={availableStates}
					blockeraUnsavedData={
						currentStateAttributes?.blockeraUnsavedData
					}
				>
					<Slot
						name={`blockera-${kebabCase(
							currentBlockStyleVariation?.name
						)}-style-variation-block-card-children`}
					/>
				</StateContainer>

				{children}

				{isActive && (
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
							id: `block-states-${kebabCase(
								currentBlockStyleVariation?.name
							)}`,
						}}
					/>
				)}
			</Flex>
		</div>
	);
}
