// @flow

/**
 * External dependencies
 */
import { SlotFillProvider, Fill } from '@wordpress/components';
import type { Element, MixedElement, ComponentType } from 'react';
import { select, useSelect, dispatch } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	memo,
	useRef,
	useMemo,
	useState,
	useEffect,
	// StrictMode,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omit, isEquals, omitWithPattern } from '@blockera/utils';
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
import { isInnerBlock, propsAreEqual } from './utils';
import { isBaseBreakpoint } from '../../canvas-editor';
import { BlockFillPartials } from './block-fill-partials';
import type { UpdateBlockEditorSettings } from '../libs/types';
import { ignoreBlockeraAttributeKeysRegExp } from '../libs/utils';
import { BlockCompatibility } from './block-compatibility';
import { useExtensionsStore } from '../../hooks/use-extensions-store';

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
		attributes: _attributes,
		setAttributes: _setAttributes,
		className,
		defaultAttributes,
		...props
	}: BlockBaseProps): Element<any> | null => {
		const [attributes, updateAttributes] = useState(_attributes);
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

		// Sets the block "blockeraId" attribute value.
		useEffect(() => {
			if (!attributes?.blockeraId) {
				setAttributes({
					...attributes,
					blockeraId: clientId,
				});
			}
			// eslint-disable-next-line
		}, [clientId]);

		/**
		 * Updating block original attributes state while changed native attributes state.
		 */
		useEffect(() => {
			if (!isEquals(attributes, _attributes) && !isCompatibleWithWP) {
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

		const { availableAttributes, isActiveBlockExtensions } = useSelect(
			(select) => {
				const { isActiveBlockExtensions, getActiveBlockVariation } =
					select('blockera/extensions');

				const { getBlockType } = select('core/blocks');
				const { getSelectedBlock } = select('core/block-editor');

				return {
					activeVariation: getActiveBlockVariation(),
					selectedBlock: (getSelectedBlock() || {})?.name,
					isActiveBlockExtensions: isActiveBlockExtensions(),
					availableAttributes: getBlockType(name)?.attributes,
				};
			}
		);

		const [isActive, setActive] = useState(isActiveBlockExtensions);

		const {
			changeExtensionCurrentBlock: setCurrentBlock,
			changeExtensionCurrentBlockState: setCurrentState,
			changeExtensionInnerBlockState: setInnerBlockState,
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
			blockAttributes: defaultAttributes,
			innerBlocks: additional?.blockeraInnerBlocks,
		};

		const { getAttributesWithIds, handleOnChangeAttributes } =
			useAttributes(setAttributes, {
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

		const originalAttributes = useMemo(() => {
			return omitWithPattern(
				omit(_attributes, ['content']),
				ignoreBlockeraAttributeKeysRegExp()
			);
		}, [_attributes]);

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
					<BlockCompatibility
						{...{
							args,
							isActive,
							defaultAttributes,
							setCompatibilities,
							originalAttributes,
							availableAttributes,
							getAttributesWithIds,
							attributes: _attributes,
						}}
					/>
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
