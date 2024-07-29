// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { detailedDiff } from 'deep-object-diff';
import { SlotFillProvider, Fill } from '@wordpress/components';
import type { Element, MixedElement, ComponentType } from 'react';
import { select, useSelect, dispatch } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	memo,
	useRef,
	useState,
	useEffect,
	// StrictMode,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals, omitWithPattern } from '@blockera/utils';
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
import { SideEffect } from '../libs/base';
import { BlockPartials } from './block-partials';
import { isBaseBreakpoint } from '../../canvas-editor';
import { BlockFillPartials } from './block-fill-partials';
import type { UpdateBlockEditorSettings } from '../libs/types';
import {
	isInnerBlock,
	propsAreEqual,
	prepareAttributesDefaultValues,
} from './utils';
import { ignoreDefaultBlockAttributeKeysRegExp } from '../libs/utils';
import {
	registerBlockExtensionsSupports,
	registerInnerBlockExtensionsSupports,
} from '../libs';

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
			selectedBlock,
			activeVariation,
			currentBreakpoint,
			availableAttributes,
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

			const { getBlockType } = select('core/blocks');
			const { getSelectedBlock } = select('core/block-editor');

			return {
				currentBlock: getExtensionCurrentBlock(),
				activeVariation: getActiveBlockVariation(),
				currentState: getExtensionCurrentBlockState(),
				selectedBlock: (getSelectedBlock() || {})?.name,
				isActiveBlockExtensions: isActiveBlockExtensions(),
				availableAttributes: getBlockType(name)?.attributes,
				currentInnerBlockState: getExtensionInnerBlockState(),
				currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
			};
		});

		const isSelectedBlock = (name: string): boolean =>
			selectedBlock === name;

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
			if ('function' === typeof registerExtensions) {
				registerExtensions(name);

				return;
			}

			registerBlockExtensionsSupports(name);
			registerInnerBlockExtensionsSupports(name, blockeraInnerBlocks);
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
			blockAttributes: defaultAttributes,
			innerBlocks: additional?.blockeraInnerBlocks,
		};

		const { getAttributesWithIds, handleOnChangeAttributes } =
			useAttributes(setAttributes, {
				className,
				blockId: name,
				isNormalState,
				getAttributes,
				blockVariations,
				defaultAttributes,
				availableAttributes,
				masterIsNormalState,
				blockeraInnerBlocks,
				activeBlockVariation,
				getActiveBlockVariation,
				innerBlocks: additional?.blockeraInnerBlocks,
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

		const { supports, selectors } = useSelect((select) => {
			const { getBlockType } = select('core/blocks');

			return getBlockType(name);
		});

		const blockEditRef = useRef(null);
		const currentAttributes = useCalculateCurrentAttributes({
			attributes,
			currentInnerBlock,
			blockeraInnerBlocks,
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

		const FilterAttributes = (): MixedElement => {
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
								prepareAttributesDefaultValues(
									defaultAttributes
								),
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
				[isActive, attributes]
			);

			return <></>;
		};

		// While change active block variation, we should clean up blockeraCompatId because we need to running compatibilities again.
		useEffect(() => {
			// We should not try to clean up blockeraCompatId while not selected block because still not executing compatibility on current block.
			if (!isSelectedBlock(name)) {
				return;
			}

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
			// eslint-disable-next-line
		}, [activeBlockVariation]);

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
					<FilterAttributes />
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
									attributes,
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

				<StylesWrapper clientId={clientId}>
					<Fill name={'blockera-styles-wrapper-' + clientId}>
						<BlockStyle
							{...{
								clientId,
								supports,
								selectors,
								attributes,
								blockName: name,
								currentAttributes,
								defaultAttributes,
								activeDeviceType: getDeviceType(),
							}}
						/>
					</Fill>
				</StylesWrapper>
				{/*</StrictMode>*/}

				{children}
			</BlockEditContextProvider>
		);
	},
	propsAreEqual
);
