// @flow

/**
 * External dependencies
 */
import classnames from 'classnames';
import { SlotFillProvider } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
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
import { BlockStyle } from '@blockera/style-engine';
import { isLaptopBreakpoint } from '@blockera/editor';

/**
 * Internal dependencies
 */
import {
	useIconEffect,
	useAttributes,
	useInnerBlocksInfo,
	BlockEditContextProvider,
	useCalculateCurrentAttributes,
} from '../hooks';
import { SideEffect } from '../libs/base';
import { BlockPartials } from './block-partials';
import { BlockFillPartials } from './block-fill-partials';
import type { UpdateBlockEditorSettings } from '../libs/types';
import {
	isBaseBreakpoint,
	isInnerBlock,
	prepareAttributesDefaultValues,
	propsAreEqual,
} from './utils';
import {
	sharedBlockExtensionAttributes,
	ignoreDefaultBlockAttributeKeysRegExp,
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
			} = select('blockera-core/extensions');

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
		} = dispatch('blockera-core/extensions') || {};

		const { getDeviceType } = select('blockera-core/editor');

		const { currentInnerBlock, blockeraInnerBlocks } = useInnerBlocksInfo({
			name,
			additional,
			attributes,
			currentBlock,
			currentState,
			currentBreakpoint,
		});

		const masterIsNormalState = (): boolean =>
			'normal' === currentState && isLaptopBreakpoint(getDeviceType());

		const isNormalState = (): boolean => {
			if (isInnerBlock(currentBlock)) {
				return (
					'normal' === currentInnerBlockState &&
					isLaptopBreakpoint(getDeviceType())
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

		const { getAttributesWithIds, handleOnChangeAttributes } =
			useAttributes(setAttributes, {
				isNormalState,
				getAttributes,
				blockId: name,
				masterIsNormalState,
				blockeraInnerBlocks,
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

		const { edit: BlockEditComponent } = additional;

		const FilterAttributes = (): MixedElement => {
			const { activeBlockVariation, variations } = useSelect((select) => {
				const { getActiveBlockVariation, getBlockVariations } =
					select('core/blocks');
				const { getBlockName, getBlockAttributes } =
					select('core/block-editor');
				const name = clientId && getBlockName(clientId);
				return {
					activeBlockVariation: getActiveBlockVariation(
						name,
						getBlockAttributes(clientId)
					),
					variations: name && getBlockVariations(name, 'transform'),
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
				variations,
				activeBlockVariation,
				innerBlocks: additional?.blockeraInnerBlocks,
				blockAttributes: sharedBlockExtensionAttributes,
			};

			/**
			 * Filterable attributes before initializing block edit component.
			 *
			 * hook: 'blockeraCore.blockEdit.attributes'
			 *
			 * @since 1.0.0
			 */
			useEffect(
				() => {
					// Creat mutable constant to prevent directly change to immutable state constant.
					let filteredAttributes = { ...attributes };

					/**
					 * Filtering block attributes based on "blockeraPropsId" attribute.
					 *
					 * hook: 'blockeraCore.blockEdit.attributes'
					 *
					 * @since 1.0.0
					 */
					if (!attributes?.blockeraPropsId) {
						filteredAttributes = applyFilters(
							'blockeraCore.blockEdit.attributes',
							getAttributesWithIds(
								filteredAttributes,
								'blockeraPropsId'
							),
							args
						);
					}

					/**
					 * Filtering block attributes based on "blockeraCompatId" attribute value to running WordPress compatibilities.
					 *
					 * hook: 'blockeraCore.blockEdit.compatibility.attributes'
					 *
					 * @since 1.0.0
					 */
					if (!attributes?.blockeraCompatId) {
						filteredAttributes = applyFilters(
							'blockeraCore.blockEdit.compatibility.attributes',
							getAttributesWithIds(
								filteredAttributes,
								'blockeraCompatId'
							),
							args
						);
					}

					// Merging block classnames ...
					if (!attributes?.className) {
						filteredAttributes = {
							...filteredAttributes,
							className: classnames(
								{
									'blockera-core-block': true,
									[`blockera-core-block-${clientId}`]: true,
								},
								additional.editorProps.className || ''
							),
						};
					} else if ('' === className) {
						filteredAttributes = {
							...filteredAttributes,
							className: classnames(
								{
									'blockera-core-block': true,
									[`blockera-core-block-${clientId}`]: true,
								},
								additional.editorProps.className || ''
							),
						};
					}

					// Assume disabled blockera panel, so filtering attributes to clean up all blockera attributes.
					if (!isActive) {
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

					setAttributes(filteredAttributes);
				},
				// eslint-disable-next-line
				[]
			);

			useEffect(() => {
				// Creat mutable constant to prevent directly change to immutable state constant.
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

			return <></>;
		};

		return (
			<BlockEditContextProvider
				{...{
					block: {
						blockName: name,
						clientId,
						handleOnChangeAttributes,
						attributes: currentAttributes,
						storeName: 'blockera-core/controls',
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
					<FilterAttributes />
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
								states: attributes.blockeraBlockStates,
								blockProps: {
									// Sending props like exactly "edit" function props of WordPress Block.
									// Because needs total block props in outside overriding component like "blockera-core" in overriding process.
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
									currentStateAttributes: currentAttributes,
									...props,
								},
							}}
						/>
					</SlotFillProvider>
				</InspectorControls>
				<div ref={blockEditRef} />

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
				{/*</StrictMode>*/}

				{children}
			</BlockEditContextProvider>
		);
	},
	propsAreEqual
);
