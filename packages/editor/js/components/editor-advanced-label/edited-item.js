// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf, isRTL } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Tooltip, ConditionalWrapper } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../../extensions';
import { useExtensionsStore } from '../../hooks/use-extensions-store';
import type { TStates } from '../../extensions/libs/block-card/block-states/types';
import StateChangePreview, {
	type StateGraphPreviewConfig,
} from './state-change-preview';

export default function EditedItem({
	state,
	label,
	breakpoint,
	breakpointLabel,
	current = false,
	onClick = () => {},
	previewConfig,
	previewValue,
	previewObjectPickKey,
	changesetGraphPreviewRender,
	...props
}: {
	state: TStates,
	label: string,
	breakpoint: string,
	breakpointLabel: string,
	current: boolean,
	onClick: () => void,
	previewConfig?: void | null | StateGraphPreviewConfig,
	previewValue?: mixed,
	previewObjectPickKey?: ?string,
	changesetGraphPreviewRender?: ?(value: mixed) => mixed,
}): MixedElement {
	const {
		currentState,
		currentInnerBlockState,
		currentBlock,
		currentBreakpoint,
	} = useExtensionsStore();

	// current can be come from props to manipulate current state
	if (!current && currentBreakpoint === breakpoint) {
		current = isInnerBlock(currentBlock)
			? currentInnerBlockState === state
			: currentState === state;
	}

	return (
		<ConditionalWrapper
			condition={!current}
			wrapper={(children) => (
				<Tooltip
					text={sprintf(
						/* translators: %1$s: Breakpoint name, %2$s: Block state name */
						__('Switch To: %1$s → %2$s', 'blockera'),
						breakpointLabel,
						label
					)}
				>
					{children}
				</Tooltip>
			)}
		>
			<div
				className={controlInnerClassNames(
					'states-changes-item',
					'state-' + state,
					{
						'is-current-active-item': current,
					}
				)}
				onClick={onClick}
				{...props}
			>
				{label}

				{current ? (
					<Icon
						icon="pen"
						iconSize="18"
						className={controlInnerClassNames(
							'states-changes-item-current'
						)}
					/>
				) : null}

				<Icon
					library="wp"
					icon={isRTL() ? 'chevron-left' : 'chevron-right'}
					iconSize="18"
					className={controlInnerClassNames(
						'states-changes-item__edit-icon'
					)}
				/>

				{(previewConfig || changesetGraphPreviewRender) && (
					<div
						className={controlInnerClassNames(
							'states-changes-item__end'
						)}
					>
						<div
							className={controlInnerClassNames(
								'states-changes-item__preview'
							)}
							data-test="state-graph-row-preview"
						>
							<StateChangePreview
								previewConfig={previewConfig}
								value={previewValue}
								objectPickKey={previewObjectPickKey}
								changesetGraphPreviewRender={
									changesetGraphPreviewRender
								}
							/>
						</div>
					</div>
				)}
			</div>
		</ConditionalWrapper>
	);
}
