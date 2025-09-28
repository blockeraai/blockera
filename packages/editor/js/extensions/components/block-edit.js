// @flow

/**
 * External dependencies
 */
import { type MixedElement, type ComponentType } from 'react';
import { memo, useMemo, useState } from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Blockera dependencies
 */
import { isFunction, mergeObject } from '@blockera/utils';
import { BaseControlContext } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../components';
import { BlockApp, BlockBase, BlockPortals } from './';
import { sanitizeDefaultAttributes } from '../hooks/utils';
import { ErrorBoundaryFallback } from '../hooks/block-settings';
import bootstrapScripts from '../scripts';

export const Edit: ComponentType<any> = memo(
	({
		settings,
		additional,
		isAvailableBlock,
		...props
	}: Object): MixedElement => {
		// On rendering the block settings, we can bootstrap all scripts.
		bootstrapScripts();

		const baseContextValue = useMemo(
			() => ({
				components: {
					FeatureWrapper: EditorFeatureWrapper,
					AdvancedLabelControl: EditorAdvancedLabelControl,
				},
			}),
			[]
		);

		if (isFunction(additional?.edit) && isAvailableBlock()) {
			// eslint-disable-next-line
			const attributes = useMemo(() => {
				const { content, ...attributes } = props.attributes;

				return attributes;
			}, [props.attributes]);

			const defaultAttributes = !settings.attributes?.blockeraPropsId
				? mergeObject(
						blockeraOverrideBlockAttributes,
						settings.attributes
				  )
				: settings.attributes;

			const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
				// eslint-disable-next-line react-hooks/rules-of-hooks
				useState(false);

			return (
				<ErrorBoundary
					fallbackRender={({ error }) => (
						<ErrorBoundaryFallback
							{...{
								props,
								error,
								from: 'root',
								clientId: props.clientId,
								isReportingErrorCompleted,
								setIsReportingErrorCompleted,
								fallbackComponent: settings.edit,
							}}
						/>
					)}
				>
					<BaseControlContext.Provider value={baseContextValue}>
						<BlockApp>
							<BlockBase
								{...{
									attributes,
									additional,
									name: props.name,
									clientId: props.clientId,
									className: props?.className,
									setAttributes: props.setAttributes,
									originDefaultAttributes: defaultAttributes,
									defaultAttributes:
										sanitizeDefaultAttributes(
											defaultAttributes,
											{ defaultWithoutValue: true }
										),
								}}
							>
								<SlotFillProvider>
									<Slot name={'blockera-block-before'} />

									<BlockPortals
										blockId={`#block-${props.clientId}`}
										mainSlot={'blockera-block-slot'}
										slots={
											// slot selectors is feature on configuration block to create custom slots for anywhere.
											// we can add slotSelectors property on block configuration to handle custom preview of block.
											additional?.slotSelectors || {}
										}
									/>

									<Slot name={'blockera-block-after'} />
								</SlotFillProvider>
							</BlockBase>
						</BlockApp>
					</BaseControlContext.Provider>
					{settings.edit(props)}
				</ErrorBoundary>
			);
		}

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useSharedBlockSideEffect();

		return settings.edit(props);
	}
);
