// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
// import { ErrorBoundary } from 'react-error-boundary';
import { useMemo, useState, useEffect } from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';
// import { store as blocksStore } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { isEmpty, mergeObject, isEquals } from '@blockera/utils';
import { BaseControlContext } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../../components';
import { SharedBlockExtension } from '../../../extensions/libs/shared';
import { sanitizeDefaultAttributes } from '../../../extensions/hooks/utils';
import { prepareBlockeraDefaultAttributesValues } from '../../../extensions/components/utils';
import {
	BlockApp,
	BlockBase,
	BlockPortals,
} from '../../../extensions/components';
// import { ErrorBoundaryFallback } from '../../../extensions/hooks/block-settings';
import { STORE_NAME } from '../../../extensions/store/constants';

export default function App(props: Object): MixedElement {
	const {
		blockType: { name, attributes },
	} = props;
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

	const originDefaultAttributes = useMemo(() => {
		return mergeObject(attributes, blockeraOverrideBlockAttributes);
	}, [attributes, blockeraOverrideBlockAttributes]);

	const defaultStyles = useMemo(() => {
		return sanitizeDefaultAttributes(originDefaultAttributes, {
			defaultWithoutValue: true,
		});
	}, [originDefaultAttributes]);

	const [styles, setStyles] = useState(
		prepareBlockeraDefaultAttributesValues(defaultStyles)
	);

	const { getBlockStyles } = select('blockera/editor');
	const { setBlockStyles } = dispatch('blockera/editor');

	// Update global styles state when local styles change.
	useEffect(() => {
		if (!isEquals(getBlockStyles(name), styles)) {
			const calculatedBlockStyles = {};

			for (const key in styles) {
				if (
					[
						'blockeraPropsId',
						'blockeraCompatId',
						'className',
					].includes(key)
				) {
					continue;
				}

				if (
					!defaultStyles[key].hasOwnProperty('default') &&
					styles[key]
				) {
					calculatedBlockStyles[key] = styles[key];

					continue;
				}

				if (!isEquals(defaultStyles[key]?.default, styles[key])) {
					calculatedBlockStyles[key] = styles[key];
				}
			}

			setBlockStyles(name, calculatedBlockStyles);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [styles]);

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
						name,
						clientId: props.clientId,
						setAttributes: setStyles,
						defaultAttributes: defaultStyles,
						additional: {
							edit: SharedBlockExtension,
						},
						insideBlockInspector: false,
						className: props?.className,
						attributes: styles,
						originDefaultAttributes,
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
