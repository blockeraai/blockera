// @flow

/**
 * External dependencies
 */
import { ErrorBoundary } from 'react-error-boundary';
import { SlotFillProvider, Fill } from '@wordpress/components';
import type { Element, ComponentType, MixedElement } from 'react';
import { select, useSelect, dispatch } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	memo,
	useRef,
	useMemo,
	useState,
	useEffect,
	useCallback,
	// StrictMode,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omit, isEquals, omitWithPattern, cloneObject } from '@blockera/utils';
import { experimental } from '@blockera/env';

/**
 * Internal dependencies
 */
import { BlockStyle, StylesWrapper } from '../../style-engine';
import { BlockEditContextProvider } from '../hooks';
import {
	useIconEffect,
	useAttributes,
	useInnerBlocksInfo,
	useCalculateCurrentAttributes,
} from '../../hooks';
import { isInnerBlock } from './utils';
import { SideEffect } from '../libs/base';
// import { BlockPortals } from './block-portals';
import { BlockPartials } from './block-partials';
import { useBlockAppContext } from './block-app';
import { isBaseBreakpoint } from '../../canvas-editor';
import { sanitizeBlockAttributes } from '../hooks/utils';
import { BlockFillPartials } from './block-fill-partials';
import { BlockCompatibility } from './block-compatibility';
import type { UpdateBlockEditorSettings } from '../libs/types';
import { ErrorBoundaryFallback } from '../hooks/block-settings';
import { ignoreBlockeraAttributeKeysRegExp } from '../libs/utils';
import { useCleanupStyles } from '../../hooks/use-cleanup-styles';
import { useExtensionsStore } from '../../hooks/use-extensions-store';

export const BlockBase: ComponentType<any> = memo((): Element<any> | null => {
	const { props: _props } = useBlockAppContext();
	const {
		additional,
		children,
		name,
		clientId,
		attributes: blockAttributes,
		setAttributes: _setAttributes,
		className,
		defaultAttributes,
		originDefaultAttributes,
		...props
	} = _props;

	const _attributes = useMemo(
		() => sanitizeBlockAttributes(cloneObject(blockAttributes)),
		[blockAttributes]
	);

	const [attributes, updateAttributes] = useState(blockAttributes);

	const sanitizedAttributes = useMemo(
		() => sanitizeBlockAttributes(cloneObject(attributes)),
		[attributes]
	);

	const [notice, setNotice] = useState(null);
	const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
		useState(false);
	const [currentTab, setCurrentTab] = useState(
		additional?.activeTab || 'style'
	);
	const [isCompatibleWithWP, setWPCompatibility] = useState(false);

	/**
	 * Sets attributes and wp compatibility states.
	 *
	 * @param {Object} newAttributes the next attributes state.
	 */
	const setAttributes = (newAttributes: Object): void => {
		setWPCompatibility(false);
		updateAttributes(newAttributes);
	};

	/**
	 * Sets native attributes and wp compatibility and block original states.
	 *
	 * @param {Object} newAttributes the next attributes state.
	 */
	const setCompatibilities = (newAttributes: Object): void => {
		setWPCompatibility(true);
		_setAttributes(newAttributes);
		updateAttributes(newAttributes);
	};

	/**
	 * Updating block original attributes state while changed native attributes state.
	 */
	useEffect(() => {
		if (!isEquals(attributes, blockAttributes) && !isCompatibleWithWP) {
			_setAttributes(attributes);
		}
		// eslint-disable-next-line
	}, [attributes]);

	const {
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	} = useExtensionsStore({ name, clientId });

	const { availableAttributes, selectedBlock } = useSelect((select) => {
		const { getActiveBlockVariation } = select('blockera/extensions');

		const { getBlockType } = select('core/blocks');
		const { getSelectedBlock } = select('core/block-editor');

		return {
			activeVariation: getActiveBlockVariation(),
			selectedBlock: (getSelectedBlock() || {})?.name,
			availableAttributes: getBlockType(name)?.attributes,
		};
	});

	const [isActive, _setActive] = useState(true);
	const setActive = useCallback(
		(_isActive: boolean): void => _setActive(_isActive),
		// eslint-disable-next-line
		[]
	);

	const {
		changeExtensionCurrentBlock: setCurrentBlock,
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
	} = dispatch('blockera/extensions') || {};

	const { getDeviceType } = select('blockera/editor');

	const { currentInnerBlock, blockeraInnerBlocks } = useInnerBlocksInfo({
		additional,
		currentBlock,
		currentState,
		currentBreakpoint,
		defaultAttributes,
		currentInnerBlockState,
		attributes: sanitizedAttributes,
	});

	const { edit: BlockEditComponent } = additional;

	const masterIsNormalState = (): boolean =>
		'normal' === currentState && isBaseBreakpoint(getDeviceType());

	const isNormalState = (): boolean => {
		if (isInnerBlock(currentBlock)) {
			return (
				'normal' === currentInnerBlockState &&
				isBaseBreakpoint(getDeviceType())
			);
		}

		return masterIsNormalState();
	};

	const getAttributes = (key: string = ''): any => {
		if (key && sanitizedAttributes[key]) {
			return sanitizedAttributes[key];
		}

		return sanitizedAttributes;
	};

	const { activeBlockVariation, blockVariations, getActiveBlockVariation } =
		useSelect((select) => {
			const { getActiveBlockVariation, getBlockVariations } =
				select('core/blocks');

			const { getBlockName, getBlockAttributes } =
				select('core/block-editor');

			const name = clientId && getBlockName(clientId);

			return {
				getActiveBlockVariation,
				activeBlockVariation: getActiveBlockVariation(
					name,
					getBlockAttributes(clientId)
				),
				blockVariations: name && getBlockVariations(name, 'transform'),
			};
		});

	const args = {
		blockId: name,
		blockClientId: clientId,
		isMasterNormalState: masterIsNormalState(),
		isNormalState: isNormalState(),
		isMasterBlock: !isInnerBlock(currentBlock),
		isBaseBreakpoint: isBaseBreakpoint(currentBreakpoint),
		currentBreakpoint,
		currentBlock,
		currentState: isInnerBlock(currentBlock)
			? currentInnerBlockState
			: currentState,
		blockVariations,
		activeBlockVariation,
		getActiveBlockVariation,
		blockAttributes: originDefaultAttributes,
		innerBlocks: additional?.blockeraInnerBlocks,
	};

	const { getAttributesWithIds, handleOnChangeAttributes } = useAttributes(
		setAttributes,
		{
			clientId,
			className,
			blockId: name,
			isNormalState,
			getAttributes,
			currentBlock,
			currentState,
			blockVariations,
			defaultAttributes,
			currentBreakpoint,
			availableAttributes,
			masterIsNormalState,
			blockeraInnerBlocks,
			activeBlockVariation,
			currentInnerBlockState,
			getActiveBlockVariation,
			innerBlocks: additional?.blockeraInnerBlocks,
		}
	);

	const updateBlockEditorSettings: UpdateBlockEditorSettings = (
		key: string,
		value: any
	): void => {
		switch (key) {
			case 'current-block':
				setCurrentBlock(value);
				break;
			case 'current-state':
				if (isInnerBlock(currentBlock)) {
					return setInnerBlockState(value);
				}

				setCurrentState(value);
				break;
		}
	};

	const { supports, selectors } = useSelect((select) => {
		const { getBlockType } = select('core/blocks');

		return getBlockType(name);
	});

	const blockEditRef = useRef(null);
	const currentAttributes = useCalculateCurrentAttributes({
		currentInnerBlock,
		blockeraInnerBlocks,
		attributes: sanitizedAttributes,
		blockAttributes: defaultAttributes,
	});

	useIconEffect(
		{
			name,
			clientId,
			blockRefId: blockEditRef,
			blockeraIcon: currentAttributes?.blockeraIcon,
			blockeraIconGap: currentAttributes?.blockeraIconGap,
			blockeraIconSize: currentAttributes?.blockeraIconSize,
			blockeraIconColor: currentAttributes?.blockeraIconColor,
			blockeraIconPosition: currentAttributes?.blockeraIconPosition,
		},
		[currentAttributes]
	);

	const inlineStyles = useCleanupStyles({ clientId }, [
		selectedBlock,
		attributes,
	]);

	const originalAttributes = useMemo(() => {
		return omitWithPattern(
			omit(_attributes, ['content']),
			ignoreBlockeraAttributeKeysRegExp()
		);
	}, [_attributes]);

	const blockStyleProps = {
		clientId,
		supports,
		selectors,
		additional,
		inlineStyles,
		attributes: sanitizedAttributes,
		blockName: name,
		currentAttributes,
		defaultAttributes,
		customCss: attributes?.blockeraCustomCSS?.value?.replace(
			/(.|#)block/gi,
			`#block-${clientId}`
		),
		activeDeviceType: getDeviceType(),
	};

	return (
		<BlockEditContextProvider
			{...{
				block: {
					blockName: name,
					clientId,
					handleOnChangeAttributes,
					attributes: currentAttributes,
					storeName: 'blockera/controls',
				},
				currentTab,
				currentBlock,
				currentState,
				setCurrentTab,
				isNormalState,
				setAttributes,
				getAttributes,
				currentBreakpoint,
				currentInnerBlock,
				masterIsNormalState,
				blockeraInnerBlocks,
				currentInnerBlockState,
				handleOnChangeAttributes,
				updateBlockEditorSettings,
				BlockComponent: () => children,
				attributes: sanitizedAttributes,
				activeDeviceType: getDeviceType(),
				getBlockType: () => select('core/blocks').getBlockType(name),
			}}
		>
			{/*<StrictMode>*/}
			<InspectorControls>
				<BlockCompatibility
					{...{
						args,
						isActive,
						setCompatibilities,
						originalAttributes,
						availableAttributes,
						getAttributesWithIds,
						attributes: blockAttributes,
						defaultAttributes: originDefaultAttributes,
					}}
				/>
				<SideEffect
					{...{
						blockName: name,
						currentBlock,
						currentTab,
						currentState: isInnerBlock(currentBlock)
							? currentInnerBlockState
							: currentState,
						isActive,
					}}
				/>
				<SlotFillProvider>
					<BlockPartials
						clientId={clientId}
						isActive={isActive}
						setActive={setActive}
					/>
					<BlockFillPartials
						{...{
							notice,
							clientId,
							isActive,
							currentState,
							currentBlock,
							currentInnerBlock,
							BlockEditComponent,
							currentBreakpoint,
							blockeraInnerBlocks,
							currentInnerBlockState,
							updateBlockEditorSettings,
							blockProps: {
								// Sending props like exactly "edit" function props of WordPress Block.
								// Because needs total block props in outside overriding component like "blockera" in overriding process.
								name,
								clientId,
								supports,
								className,
								attributes: sanitizedAttributes,
								setAttributes,
								defaultAttributes,
								currentAttributes,
								controllerProps: {
									currentTab,
									currentBlock,
									currentState,
									currentBreakpoint,
									blockeraInnerBlocks,
									currentInnerBlockState,
									handleOnChangeAttributes,
								},
								additional,
								currentStateAttributes: currentAttributes,
								...props,
							},
						}}
					/>
				</SlotFillProvider>
			</InspectorControls>
			{experimental().get('editor.extensions.iconExtension') && (
				<div ref={blockEditRef} />
			)}

			<ErrorBoundary
				fallbackRender={({ error }): MixedElement => (
					<ErrorBoundaryFallback
						{...{
							error,
							notice,
							clientId,
							setNotice,
							from: 'style-wrapper',
							props: blockStyleProps,
							isReportingErrorCompleted,
							setIsReportingErrorCompleted,
							fallbackComponent: BlockStyle,
						}}
					/>
				)}
			>
				<StylesWrapper clientId={clientId}>
					<Fill name={'blockera-styles-wrapper-' + clientId}>
						<BlockStyle {...blockStyleProps} />
					</Fill>
				</StylesWrapper>
			</ErrorBoundary>
			{/*</StrictMode>*/}

			{children}
		</BlockEditContextProvider>
	);
});
