// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { usePreviewInjectableStyles } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { BlockStyleProps } from './types';
import { StateStyle } from '../';
import {
	useExtensionsStore,
	getExtensionConfig,
} from '../../hooks/use-extensions-store';

export const BlockStyle = ({
	customCss,
	isGlobalStylesWrapper = false,
	...props
}: BlockStyleProps): MixedElement => {
	const previewInjectable = usePreviewInjectableStyles();
	const extraPreviewCss =
		typeof previewInjectable?.extraPreviewCss === 'string'
			? previewInjectable.extraPreviewCss.trim()
			: '';

	const {
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	} = useExtensionsStore({
		name: props.blockName,
		clientId: props.clientId,
	});

	const hasBlockeraProps = Boolean(props?.attributes?.blockeraPropsId);

	// Skip unless Blockera styles apply or inspector preview CSS is active.
	if (!hasBlockeraProps && !extraPreviewCss) {
		return <></>;
	}

	const config = hasBlockeraProps
		? getExtensionConfig(props.blockName, currentBlock)
		: null;
	const shouldPrintCustomCss =
		hasBlockeraProps &&
		typeof customCss === 'string' &&
		customCss.trim().length > 0;

	return (
		<>
			{extraPreviewCss ? (
				<style
					id={`blockera-preview-inject-${props.clientId}`}
					data-blockera-preview-inject="1"
				>
					{extraPreviewCss}
				</style>
			) : null}
			{hasBlockeraProps && config ? (
				<>
					{shouldPrintCustomCss ? <style>{customCss}</style> : <></>}
					<StateStyle
						{...{
							...props,
							config,
							currentState,
							currentBlock,
							currentBreakpoint,
							isGlobalStylesWrapper,
							currentInnerBlockState,
							styleEngineConfig:
								props.supports?.blockeraStyleEngine,
						}}
					/>
				</>
			) : null}
		</>
	);
};
