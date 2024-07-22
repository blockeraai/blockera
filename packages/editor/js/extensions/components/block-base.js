// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { detailedDiff } from 'deep-object-diff';
import { SlotFillProvider } from '@wordpress/components';
import type { Element, MixedElement, ComponentType } from 'react';
import { select, useSelect, dispatch } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	memo,
	useRef,
	useState,
	useEffect,
	createPortal,
	// StrictMode,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	omit,
	isEquals,
	getIframeTag,
	mergeObject,
	// prependPortal,
	omitWithPattern,
} from '@blockera/utils';
import { experimental } from '@blockera/env';

/**
 * Internal dependencies
 */
import { BlockStyle } from '../../style-engine';
import { BlockEditContextProvider } from '../hooks';
import {
	useIconEffect,
	useAttributes,
	useInnerBlocksInfo,
	useCalculateCurrentAttributes,
} from '../../hooks';
import { SideEffect } from '../libs/base';
import { BlockPartials } from './block-partials';
import { isBaseBreakpoint } from '../../canvas-editor';
import { BlockFillPartials } from './block-fill-partials';
import type { UpdateBlockEditorSettings } from '../libs/types';
import {
	isInnerBlock,
	prepareAttributesDefaultValues,
	propsAreEqual,
} from './utils';
import { ignoreDefaultBlockAttributeKeysRegExp } from '../libs/utils';
import { attributes as sharedBlockExtensionAttributes } from '../libs/shared/attributes';
import {
	registerBlockExtensionsSupports,
	registerInnerBlockExtensionsSupports,
} from '../libs';
import { blockeraExtensionsBootstrap } from '../libs/bootstrap';

export type BlockBaseProps = {
	additional: Object,
	children: MixedElement,
	name: string,
	clientId: string,
	attributes: Object,
	setAttributes: (attributes: Object) => void,
	className: string,
	defaultAttributes: Object,
};

export const BlockBase: ComponentType<BlockBaseProps> = memo(
	({
		additional,
		children,
		name,
		clientId,
		attributes,
		setAttributes,
		className,
		defaultAttributes,
		...props
	}: BlockBaseProps): Element<any> | null => {
		const [currentTab, setCurrentTab] = useState(
			additional?.activeTab || 'style'
		);

		const {
			currentBlock,
			currentState,
			activeVariation,
			currentBreakpoint,
			currentInnerBlockState,
			isActiveBlockExtensions,
		} = useSelect((select) => {
			const {
				isActiveBlockExtensions,
				getActiveBlockVariation,
				getExtensionCurrentBlock,
				getExtensionInnerBlockState,
				getExtensionCurrentBlockState,
				getExtensionCurrentBlockStateBreakpoint,
			} = select('blockera/extensions');

			return {
				currentBlock: getExtensionCurrentBlock(),
				currentState: getExtensionCurrentBlockState(),
				isActiveBlockExtensions: isActiveBlockExtensions(),
				currentInnerBlockState: getExtensionInnerBlockState(),
				activeVariation: getActiveBlockVariation(),
				currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
			};
		});

		const [isActive, setActive] = useState(isActiveBlockExtensions);

		const {
			changeExtensionCurrentBlock: setCurrentBlock,
			changeExtensionCurrentBlockState: setCurrentState,
			changeExtensionInnerBlockState: setInnerBlockState,
			setExtensionsActiveBlockVariation: setActiveBlockVariation,
		} = dispatch('blockera/extensions') || {};

		const { getDeviceType } = select('blockera/editor');

		const { currentInnerBlock, blockeraInnerBlocks } = useInnerBlocksInfo({
			name,
			additional,
			attributes,
			currentBlock,
			currentState,
			currentBreakpoint,
			currentInnerBlockState,
		});

		const { edit: BlockEditComponent, registerExtensions = null } =
			additional;

		// On mounting block base component, we're firing bootstrapper scripts and add experimental extensions support.
		useEffect(() => {
			// Bootstrap functions for extensions.
			blockeraExtensionsBootstrap();

			if ('function' === typeof registerExtensions) {
				registerExtensions(clientId);

				return;
			}

			registerBlockExtensionsSupports(clientId);
			registerInnerBlockExtensionsSupports(clientId, blockeraInnerBlocks);
			// eslint-disable-next-line
		}, []);

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
			if (key && attributes[key]) {
				return attributes[key];
			}

			return attributes;
		};

		const {
			activeBlockVariation,
			blockVariations,
			getActiveBlockVariation,
		} = useSelect((select) => {
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
			innerBlocks: additional?.blockeraInnerBlocks,
			blockAttributes: sharedBlockExtensionAttributes,
		};

		/**
		 * We should compare saved attributes value with initialize attributes value,
		 * to clean up unnecessary blockera attributes of block after executing compatibility filters,
		 * while not really changed blockera attributes by user interactions.
		 *
		 * we're cleaning blockera attributes when unmounting BlockEdit component.
		 */
		useEffect(() => {
			return () => {
				const { getBlockAttributes } = select('core/block-editor');
				const savedAttributes = getBlockAttributes(clientId);

				if (!savedAttributes?.blockeraCompatId) {
					return;
				}

				const compatibleAttributes = mergeObject(
					attributes,
					applyFilters(
						'blockera.blockEdit.attributes',
						attributes,
						args
					)
				);

				if (
					isEquals(
						omit(compatibleAttributes, ['blockeraCompatId']),
						omit(savedAttributes, ['blockeraCompatId'])
					)
				) {
					setAttributes(attributes);
				}
			};
			// eslint-disable-next-line
		}, []);

		const { getAttributesWithIds, handleOnChangeAttributes } =
			useAttributes(setAttributes, {
				className,
				isNormalState,
				getAttributes,
				blockId: name,
				masterIsNormalState,
				blockeraInnerBlocks,
				innerBlocks: additional?.blockeraInnerBlocks,
				blockVariations,
				activeBlockVariation,
				getActiveBlockVariation,
			});

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

		const { supports } = useSelect((select) => {
			const { getBlockType } = select('core/blocks');

			return getBlockType(name);
		});

		const blockEditRef = useRef(null);
		const currentAttributes = useCalculateCurrentAttributes({
			attributes,
			currentInnerBlock,
			blockeraInnerBlocks,
			blockAttributes: sharedBlockExtensionAttributes,
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

		useEffect(
			() => {
				// Create mutable constant to prevent directly change to immutable state constant.
				let filteredAttributes = { ...attributes };

				const hasPropsId = attributes?.blockeraPropsId;
				const hasCompatId = attributes?.blockeraCompatId;

				/**
				 * Filtering block attributes based on "blockeraCompatId" attribute value to running WordPress compatibilities.
				 *
				 * hook: 'blockera.blockEdit.compatibility.attributes'
				 *
				 * @since 1.0.0
				 */
				if (!hasCompatId) {
					filteredAttributes = applyFilters(
						'blockera.blockEdit.attributes',
						getAttributesWithIds(
							filteredAttributes,
							'blockeraCompatId'
						),
						args
					);
				}

				// Assume disabled blockera panel, so filtering attributes to clean up all blockera attributes.
				if (!isActive && hasCompatId && hasPropsId) {
					filteredAttributes = {
						...attributes,
						...omitWithPattern(
							prepareAttributesDefaultValues(defaultAttributes),
							ignoreDefaultBlockAttributeKeysRegExp()
						),
					};
				}

				// Prevent redundant set state!
				if (isEquals(attributes, filteredAttributes)) {
					return;
				}

				const filteredAttributesWithoutIds = {
					...filteredAttributes,
					blockeraPropsId: '',
					blockeraCompatId: '',
					...(attributes.hasOwnProperty('className')
						? { className: attributes?.className || '' }
						: {}),
				};

				const { added, updated } = detailedDiff(
					filteredAttributesWithoutIds,
					prepareAttributesDefaultValues(defaultAttributes)
				);

				// Our Goal is cleanup blockera attributes of core blocks when not changed anything!
				if (
					!Object.keys(added).length &&
					!Object.keys(updated).length &&
					isEquals(attributes, filteredAttributesWithoutIds)
				) {
					return;
				}

				setAttributes(filteredAttributes);
			},
			// eslint-disable-next-line
			[attributes]
		);

		useEffect(() => {
			// Create mutable constant to prevent directly change to immutable state constant.
			let filteredAttributes = { ...attributes };

			if (!isEquals(activeVariation, activeBlockVariation)) {
				setActiveBlockVariation(activeBlockVariation);

				filteredAttributes = {
					...attributes,
					blockeraCompatId: '',
				};

				// Prevent redundant set state!
				if (isEquals(attributes, filteredAttributes)) {
					return;
				}

				setAttributes(filteredAttributes);
			}
		}, [activeBlockVariation]);

		const stylesWrapperId = 'blockera-styles-wrapper';
		const iframeBodyElement = getIframeTag('body');
		const stylesWrapperElement = getIframeTag(`body #${stylesWrapperId}`);

		// WordPress block editor sometimes wrapped body into iframe, so we should append generated styles into iframe to apply user styles.
		useEffect(() => {
			const div = document.createElement('div');
			div.id = stylesWrapperId;

			if (!iframeBodyElement) {
				return;
			}

			if (!iframeBodyElement?.querySelector(`#${stylesWrapperId}`)) {
				iframeBodyElement.append(div);
			}
		}, [iframeBodyElement]);

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
					attributes,
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
					activeDeviceType: getDeviceType(),
					getBlockType: () =>
						select('core/blocks').getBlockType(name),
				}}
			>
				{/*<StrictMode>*/}
				<InspectorControls>
					<SideEffect
						{...{
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
									setAttributes,
									attributes: currentAttributes,
									controllerProps: {
										currentTab,
										currentBlock,
										currentState,
										currentBreakpoint,
										blockeraInnerBlocks,
										currentInnerBlockState,
										handleOnChangeAttributes,
									},
									availableBlockStates:
										additional.availableBlockStates,
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

				{stylesWrapperElement &&
					createPortal(
						<BlockStyle
							{...{
								clientId,
								supports,
								blockName: name,
								attributes,
								currentAttributes,
								activeDeviceType: getDeviceType(),
							}}
						/>,
						stylesWrapperElement
					)}

				{!iframeBodyElement && (
					<BlockStyle
						{...{
							clientId,
							supports,
							blockName: name,
							attributes,
							currentAttributes,
							activeDeviceType: getDeviceType(),
						}}
					/>
				)}
				{/*</StrictMode>*/}

				{children}
			</BlockEditContextProvider>
		);
	},
	propsAreEqual
);
