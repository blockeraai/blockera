// @flow
/**
 * External dependencies
 */
import { Fill, SlotFillProvider } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import type { Element, MixedElement, ComponentType } from 'react';
import { select, useSelect, dispatch } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	memo,
	useRef,
	useMemo,
	useState,
	useEffect,
	StrictMode,
} from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { omitWithPattern } from '@publisher/utils';
import { isLaptopBreakpoint } from '@publisher/editor';
import { extensionClassNames } from '@publisher/classnames';

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
import { BlockStyle } from './block-style';
import { BlockCard } from '../libs/block-card';
import { BlockPartials } from './block-partials';
import { isInnerBlock, propsAreEqual } from './utils';
import { sanitizedBlockAttributes } from '../hooks/utils';
import type { UpdateBlockEditorSettings } from '../libs/types';
import { ignoreDefaultBlockAttributeKeysRegExp } from '../libs';

export type BlockBaseProps = {
	additional: Object,
	children: MixedElement,
	name: string,
	clientId: string,
	attributes: Object,
	setAttributes: (attributes: Object) => void,
	className: string,
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
		...props
	}: BlockBaseProps): Element<any> | null => {
		const [currentTab, setCurrentTab] = useState(
			additional?.activeTab || 'style'
		);
		const [isOpenGridBuilder, setOpenGridBuilder] = useState(false);

		const {
			currentBlock,
			currentState,
			innerBlockState,
			currentBreakpoint,
		} = useSelect((select) => {
			const {
				getExtensionCurrentBlock,
				getExtensionInnerBlockState,
				getExtensionCurrentBlockState,
				getExtensionCurrentBlockStateBreakpoint,
			} = select('publisher-core/extensions');

			return {
				currentBlock: getExtensionCurrentBlock(),
				currentState: getExtensionCurrentBlockState(),
				currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
				innerBlockState: getExtensionInnerBlockState(),
			};
		});
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
		});

		const masterIsNormalState = (): boolean =>
			'normal' === currentState && isLaptopBreakpoint(getDeviceType());

		const isNormalState = (): boolean => {
			if (isInnerBlock(currentBlock)) {
				return (
					'normal' === innerBlockState &&
					isLaptopBreakpoint(getDeviceType())
				);
			}

			return masterIsNormalState();
		};

		/**
		 * Filterable attributes before initializing block edit component.
		 *
		 * hook: 'publisherCore.blockEdit.attributes'
		 *
		 * @since 1.0.0
		 */
		attributes = applyFilters(
			'publisherCore.blockEdit.attributes',
			attributes,
			{
				blockId: name,
				blockClientId: clientId,
				isNormalState,
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

		const { supports } = useSelect((select) => {
			const { getBlockType } = select('core/blocks');

			return getBlockType(name);
		});

		const blockEditRef = useRef(null);
		const currentAttributes = useCalculateCurrentAttributes({
			attributes,
			currentBlock,
			currentState,
			isNormalState,
			innerBlockState,
			currentBreakpoint,
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

		useEffect(() => {
			const publisherAttributes = omitWithPattern(
				sanitizedBlockAttributes(attributes),
				ignoreDefaultBlockAttributeKeysRegExp()
			);

			if (
				'' === attributes.publisherPropsId &&
				2 < Object.keys(publisherAttributes)?.length
			) {
				const d = new Date();
				setAttributes({
					...attributes,
					publisherPropsId:
						'' +
						d.getMonth() +
						d.getDate() +
						d.getHours() +
						d.getMinutes() +
						d.getSeconds() +
						d.getMilliseconds(),
				});
			} else if (
				'' !== attributes.publisherPropsId &&
				2 === Object.keys(publisherAttributes)?.length &&
				!Object.keys(attributes.publisherInnerBlocks).length
			) {
				setAttributes({
					...attributes,
					publisherPropsId: '',
				});
			}

			return undefined;
			// eslint-disable-next-line
		}, [attributes]);

		const _attributes: Object = useMemo(() => {
			const _className = extensionClassNames(
				{
					[className]: true,
					'publisher-extension-ref': true,
					[`client-id-${clientId}`]: true,
				},
				additional.editorProps.className
			);

			return {
				...attributes,
				_className,
			};
			// eslint-disable-next-line
		}, []);

		const getAttributes = (key: string = ''): any => {
			if (key && attributes[key]) {
				return attributes[key];
			}

			return attributes;
		};

		const { handleOnChangeAttributes } = useAttributes(setAttributes, {
			currentBlock,
			currentState,
			isNormalState,
			getAttributes,
			blockId: name,
			currentBreakpoint,
			masterIsNormalState,
			publisherInnerBlocks,
		});

		const FillComponents = (): MixedElement => {
			return (
				<>
					<Fill name={`publisher-block-card-content-${clientId}`}>
						<BlockCard
							clientId={clientId}
							activeState={currentState}
							activeBlock={currentBlock}
							innerBlocks={publisherInnerBlocks}
							currentInnerBlock={currentInnerBlock}
							activeInnerBlockState={innerBlockState}
							states={attributes.publisherBlockStates}
							handleOnClick={updateBlockEditorSettings}
						/>
					</Fill>
					<Fill name={`publisher-block-edit-content-${clientId}`}>
						<BlockEditComponent
							{...{
								// Sending props like exactly "edit" function props of WordPress Block.
								// Because needs total block props in outside overriding component like "publisher-blocks" in overriding process.
								name,
								clientId,
								supports,
								className,
								setAttributes,
								currentStateAttributes: currentAttributes,
								attributes: currentAttributes,
								...props,
							}}
						/>
					</Fill>
				</>
			);
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
					currentTab,
					currentState,
					setCurrentTab,
					isNormalState,
					setAttributes,
					getAttributes,
					currentBreakpoint,
					currentInnerBlock,
					isOpenGridBuilder,
					setOpenGridBuilder,
					publisherInnerBlocks,
					attributes: _attributes,
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
									? innerBlockState
									: currentState,
							}}
						/>
						<SlotFillProvider>
							<BlockPartials clientId={clientId} />
							<FillComponents />
						</SlotFillProvider>
					</InspectorControls>
					<div ref={blockEditRef} />

					<BlockStyle
						{...{
							clientId,
							supports,
							attributes,
							// currentBlock,
							setAttributes,
							blockName: name,
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
