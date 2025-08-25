// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select } from '@wordpress/data';
// import { ErrorBoundary } from 'react-error-boundary';
import { useMemo, useState } from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';
// import { store as blocksStore } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { isEmpty } from '@blockera/utils'; //mergeObject
import { BaseControlContext } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../../components';
import { SharedBlockExtension } from '../../../extensions/libs/shared';
// import { sanitizeDefaultAttributes } from '../../../extensions/hooks/utils';
import { prepareBlockeraDefaultAttributesValues } from '../../../extensions/components/utils';
import {
	BlockApp,
	BlockBase,
	BlockPortals,
} from '../../../extensions/components';
// import { ErrorBoundaryFallback } from '../../../extensions/hooks/block-settings';
import { STORE_NAME } from '../../../extensions/store/constants';

export default function App(props: Object): MixedElement {
	const { name } = props;
	const { getSelectedBlockStyle } = select('blockera/editor');
	const selectedBlockStyle = getSelectedBlockStyle();
	const {
		// getBlockExtensionBy,
		getBlockTypeAttributes,
		getSharedBlockAttributes,
	} = select(STORE_NAME) || {};
	// const blockExtension = getBlockExtensionBy('targetBlock', name);
	const blockeraOverrideBlockTypeAttributes = getBlockTypeAttributes(name);
	const blockeraOverrideBlockAttributes = isEmpty(
		blockeraOverrideBlockTypeAttributes
	)
		? getSharedBlockAttributes()
		: blockeraOverrideBlockTypeAttributes;

	const baseContextValue = useMemo(
		() => ({
			components: {
				FeatureWrapper: EditorFeatureWrapper,
				AdvancedLabelControl: EditorAdvancedLabelControl,
			},
		}),
		[]
	);

	const [defaultAttributes, setDefaultAttributes] = useState(
		prepareBlockeraDefaultAttributesValues(
			blockeraOverrideBlockAttributes,
			{ defaultWithoutValue: true }
		)
	);

	if (selectedBlockStyle !== name || !selectedBlockStyle || !name) {
		return <></>;
	}

	// const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
	// 	useState(false);

	return (
		// <ErrorBoundary
		// 	fallbackRender={({ error }) => (
		// 		<ErrorBoundaryFallback
		// 			{...{
		// 				props,
		// 				error,
		// 				from: 'root',
		// 				isReportingErrorCompleted,
		// 				setIsReportingErrorCompleted,
		// 				fallbackComponent: settings.edit,
		// 			}}
		// 		/>
		// 	)}
		// >
		<>
			<BaseControlContext.Provider value={baseContextValue}>
				<BlockApp
					{...{
						name: props.name,
						clientId: props.clientId,
						setAttributes: setDefaultAttributes,
						defaultAttributes: {
							...defaultAttributes,
							blockeraBlockStates: {
								default: {
									normal: {
										breakpoints: {},
										isVisible: true,
									},
								},
							},
						},
						additional: {
							edit: SharedBlockExtension,
						},
						insideBlockInspector: false,
						className: props?.className,
						attributes: defaultAttributes,
						originDefaultAttributes: defaultAttributes,
					}}
				>
					<div className="blockera-block-global-panel" />
					<BlockBase>
						<SlotFillProvider>
							<Slot name={'blockera-block-before'} />

							<BlockPortals
								blockId={`#block-${props.clientId}`}
								mainSlot={'blockera-block-slot'}
								slots={
									// slot selectors is feature on configuration block to create custom slots for anywhere.
									// we can add slotSelectors property on block configuration to handle custom preview of block.
									{}
								}
							/>

							<Slot name={'blockera-block-after'} />
						</SlotFillProvider>
					</BlockBase>
				</BlockApp>
			</BaseControlContext.Provider>
			{/* </ErrorBoundary> */}
		</>
	);
}
