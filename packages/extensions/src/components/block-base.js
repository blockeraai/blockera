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
	StrictMode,
} from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isEquals, omitWithPattern } from '@publisher/utils';
import { BlockStyle } from '@publisher/style-engine';
import { isLaptopBreakpoint } from '@publisher/editor';

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
import { ignoreDefaultBlockAttributeKeysRegExp } from '../libs';

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
		const [isOpenGridBuilder, setOpenGridBuilder] = useState(false);

		const {
			currentBlock,
			currentState,
			currentBreakpoint,
			currentInnerBlockState,
			isActiveBlockExtensions,
		} = useSelect((select) => {
			const {
				isActiveBlockExtensions,
				getExtensionCurrentBlock,
				getExtensionInnerBlockState,
				getExtensionCurrentBlockState,
				getExtensionCurrentBlockStateBreakpoint,
			} = select('publisher-core/extensions');

			return {
				currentBlock: getExtensionCurrentBlock(),
				currentState: getExtensionCurrentBlockState(),
				isActiveBlockExtensions: isActiveBlockExtensions(),
				currentInnerBlockState: getExtensionInnerBlockState(),
				currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
			};
		});

		const [isActive, setActive] = useState(isActiveBlockExtensions);

		const {
			changeExtensionCurrentBlock: setCurrentBlock,
			changeExtensionCurrentBlockState: setCurrentState,
			changeExtensionInnerBlockState: setInnerBlockState,
		} = dispatch('publisher-core/extensions') || {};

		const { getDeviceType } = select('publisher-core/editor');

		const { currentInnerBlock, publisherInnerBlocks } = useInnerBlocksInfo({
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
				publisherInnerBlocks,
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
			publisherInnerBlocks,
		});

		useIconEffect(
			{
				name,
				clientId,
				blockRefId: blockEditRef,
				publisherIcon: currentAttributes?.publisherIcon,
				publisherIconGap: currentAttributes?.publisherIconGap,
				publisherIconSize: currentAttributes?.publisherIconSize,
				publisherIconColor: currentAttributes?.publisherIconColor,
				publisherIconPosition: currentAttributes?.publisherIconPosition,
			},
			[currentAttributes]
		);

		const { edit: BlockEditComponent } = additional;

		const FilterAttributes = (): MixedElement => {
			/**
			 * Filterable attributes before initializing block edit component.
			 *
			 * hook: 'publisherCore.blockEdit.attributes'
			 *
			 * @since 1.0.0
			 */
			useEffect(
				() => {
					const args = {
						blockId: name,
						blockClientId: clientId,
						isNormalState: isNormalState(),
						isMasterBlock: !isInnerBlock(currentBlock),
						isBaseBreakpoint: isBaseBreakpoint(currentBreakpoint),
						currentBreakpoint,
						currentBlock,
						currentState,
					};
					// Creat mutable constant to prevent directly change to immutable state constant.
					let filteredAttributes = { ...attributes };

					/**
					 * Filtering block attributes based on "publisherPropsId" attribute.
					 *
					 * hook: 'publisherCore.blockEdit.attributes'
					 *
					 * @since 1.0.0
					 */
					if (!attributes?.publisherPropsId) {
						filteredAttributes = applyFilters(
							'publisherCore.blockEdit.attributes',
							getAttributesWithIds(
								filteredAttributes,
								'publisherPropsId'
							),
							args
						);
					}

					/**
					 * Filtering block attributes based on "publisherCompatId" attribute value to running WordPress compatibilities.
					 *
					 * hook: 'publisherCore.blockEdit.compatibility.attributes'
					 *
					 * @since 1.0.0
					 */
					if (!attributes?.publisherCompatId) {
						filteredAttributes = applyFilters(
							'publisherCore.blockEdit.compatibility.attributes',
							getAttributesWithIds(
								filteredAttributes,
								'publisherCompatId'
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
									'publisher-core-block': true,
									[`publisher-core-block-${clientId}`]: true,
								},
								additional.editorProps.className || ''
							),
						};
					} else if ('undefined' !== typeof className) {
						filteredAttributes = {
							...filteredAttributes,
							className: classnames(
								{
									[className]: true,
									'publisher-core-block': true,
									[`publisher-core-block-${clientId}`]: true,
								},
								additional.editorProps.className || ''
							),
						};
					}

					// Assume disabled publisher panel, so filtering attributes to clean up all publisher attributes.
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
						storeName: 'publisher-core/controls',
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
					isOpenGridBuilder,
					setOpenGridBuilder,
					masterIsNormalState,
					publisherInnerBlocks,
					handleOnChangeAttributes,
					updateBlockEditorSettings,
					BlockComponent: () => children,
					activeDeviceType: getDeviceType(),
					getBlockType: () =>
						select('core/blocks').getBlockType(name),
				}}
			>
				<StrictMode>
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
									currentState,
									currentBlock,
									currentInnerBlock,
									BlockEditComponent,
									currentBreakpoint,
									publisherInnerBlocks,
									currentInnerBlockState,
									updateBlockEditorSettings,
									states: attributes.publisherBlockStates,
									blockProps: {
										// Sending props like exactly "edit" function props of WordPress Block.
										// Because needs total block props in outside overriding component like "publisher-blocks" in overriding process.
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
											publisherInnerBlocks,
											currentInnerBlockState,
											handleOnChangeAttributes,
										},
										currentStateAttributes:
											currentAttributes,
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
				</StrictMode>

				{children}
			</BlockEditContextProvider>
		);
	},
	propsAreEqual
);
