// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { FeatureWrapper } from '@blockera/controls';
import { isBoolean, isArray } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { EditorFeatureWrapperProps } from './types';
import { useEditorStore } from '../../hooks/use-editor-store';
import { useExtensionsStore } from '../../hooks/use-extensions-store';
import { isBaseBreakpoint, getBaseBreakpoint } from '../../editor/header-ui';
import { isInnerBlock, isNormalState } from '../../extensions/components/utils';
import type { TStates } from '../../extensions/libs/block-card/block-states/types';

export default function EditorFeatureWrapper({
	config,
	isActive = true,
	children,
	name,
	clientId,
	...props
}: EditorFeatureWrapperProps): Node {
	const {
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	} = useExtensionsStore({ name, clientId });
	const { availableStates, availableBreakpoints, availableInnerStates } =
		useEditorStore(
			applyFilters(
				'blockera.editor.components.editorFeatureWrapper.editorStoreParams',
				{}
			)
		);

	const getCurrentState = (): TStates =>
		isInnerBlock(currentBlock) ? currentInnerBlockState : currentState;

	const feature = {
		onStates: true,
		onNative: false,
		onBreakpoints: true,
		onInnerBlocks: true,
		onNativeOnInnerBlocks: true,
		onNativeOnBreakpoints: availableBreakpoints,
		onNativeOnStates: availableStates.concat(availableInnerStates),
		...config,
	};

	if (!isActive) {
		return <></>;
	}

	const isCompanionPlugin = applyFilters(
		'blockera.products.isCompanionPlugin',
		false
	);

	const renderCompanionNotice = (): Node => (
		<FeatureWrapper type="companion" {...props}>
			{children}
		</FeatureWrapper>
	);

	const renderNativeNotice = (): Node => (
		<FeatureWrapper type="native" {...props}>
			{children}
		</FeatureWrapper>
	);

	const renderInnerBlockNotice = (): Node => (
		<FeatureWrapper type="inner-block" {...props}>
			{children}
		</FeatureWrapper>
	);

	/**
	 * Companion gating:
	 * - `isCompanionPlugin` is driven by products via a filter and allows the "main"
	 *   product to disable companion notices globally.
	 * - When the companion isn't present, we prefer showing the companion notice in
	 *   places where we would otherwise show a limitation notice.
	 */
	if (feature.onCompanion && !isCompanionPlugin) {
		return renderCompanionNotice();
	}

	if (feature.onNative) {
		return isCompanionPlugin
			? renderNativeNotice()
			: renderCompanionNotice();
	}

	if (isInnerBlock(currentBlock)) {
		if (isBoolean(feature.onInnerBlocks) && !feature.onInnerBlocks) {
			return isCompanionPlugin
				? renderInnerBlockNotice()
				: renderCompanionNotice();
		} else if (
			isArray(feature.onInnerBlocks) &&
			//$FlowFixMe[prop-missing]
			!feature.onInnerBlocks.includes(currentBlock)
		) {
			return isCompanionPlugin
				? renderInnerBlockNotice()
				: renderCompanionNotice();
		}

		if (
			isBoolean(feature.onNativeOnInnerBlocks) &&
			feature.onNativeOnInnerBlocks
		) {
			return isCompanionPlugin
				? renderNativeNotice()
				: renderCompanionNotice();
		} else if (
			isArray(feature.onNativeOnInnerBlocks) &&
			//$FlowFixMe[prop-missing]
			!feature.onNativeOnInnerBlocks.includes(currentBlock)
		) {
			return isCompanionPlugin
				? renderNativeNotice()
				: renderCompanionNotice();
		}
	}

	if (!isNormalState(getCurrentState())) {
		if (isBoolean(feature.onStates) && !feature.onStates) {
			return isCompanionPlugin ? (
				<FeatureWrapper type="state" typeName={'normal'} {...props}>
					{children}
				</FeatureWrapper>
			) : (
				renderCompanionNotice()
			);
		} else if (
			isArray(feature.onStates) &&
			//$FlowFixMe[prop-missing]
			!feature.onStates.includes(getCurrentState())
		) {
			return isCompanionPlugin ? (
				<FeatureWrapper
					type="state"
					typeName={availableStates.join(', ')}
					{...props}
				>
					{children}
				</FeatureWrapper>
			) : (
				renderCompanionNotice()
			);
		}

		if (isBoolean(feature.onNativeOnStates) && feature.onNativeOnStates) {
			return isCompanionPlugin
				? renderNativeNotice()
				: renderCompanionNotice();
		} else if (
			isArray(feature.onNativeOnStates) &&
			//$FlowFixMe[prop-missing]
			!feature.onNativeOnStates.includes(getCurrentState())
		) {
			return isCompanionPlugin
				? renderNativeNotice()
				: renderCompanionNotice();
		}
	}

	if (!isBaseBreakpoint(currentBreakpoint)) {
		if (isBoolean(feature.onBreakpoints) && !feature.onBreakpoints) {
			return isCompanionPlugin ? (
				<FeatureWrapper
					type="breakpoint"
					typeName={getBaseBreakpoint()}
					{...props}
				>
					{children}
				</FeatureWrapper>
			) : (
				renderCompanionNotice()
			);
		} else if (
			isArray(feature.onBreakpoints) &&
			//$FlowFixMe[prop-missing]
			!feature.onBreakpoints.includes(currentBreakpoint)
		) {
			return isCompanionPlugin ? (
				<FeatureWrapper
					type="breakpoint"
					typeName={getBaseBreakpoint()}
					{...props}
				>
					{children}
				</FeatureWrapper>
			) : (
				renderCompanionNotice()
			);
		}

		if (
			isBoolean(feature.onNativeOnBreakpoints) &&
			feature.onNativeOnBreakpoints
		) {
			return isCompanionPlugin
				? renderNativeNotice()
				: renderCompanionNotice();
		} else if (
			isArray(feature.onNativeOnBreakpoints) &&
			//$FlowFixMe[prop-missing]
			!feature.onNativeOnBreakpoints.includes(currentBreakpoint)
		) {
			return isCompanionPlugin
				? renderNativeNotice()
				: renderCompanionNotice();
		}
	}

	return <>{children}</>;
}
