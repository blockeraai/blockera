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
import { useCssGenerator } from '@publisher/style-engine';
import { extensionClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import {
	useIconEffect,
	useAttributes,
	useBlockStateInfo,
	useInnerBlocksInfo,
	BlockEditContextProvider,
	useCalculateCurrentAttributes,
} from '../hooks';
import { sanitizedBlockAttributes } from '../hooks/utils';
import { SideEffect } from '../libs/base';
import { BlockCard } from '../libs/block-card';
import { BlockPartials } from './block-partials';
import * as config from '../libs/base/config';
import styleGenerators from '../libs/shared/style-generators';
import { isInnerBlock, propsAreEqual } from './utils';
import type { InnerBlockType } from '../libs/inner-blocks/types';
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

		const { currentBlock = 'master' } = useSelect((select) => {
			const { getExtensionCurrentBlock } = select(
				'publisher-core/extensions'
			);

			return {
				currentBlock: getExtensionCurrentBlock(),
			};
		});
		const { changeExtensionCurrentBlock: setCurrentBlock } =
			dispatch('publisher-core/extensions') || {};

		const {
			__experimentalGetPreviewDeviceType: getDeviceType = () => 'desktop',
		} =
			(window?.wp?.editPost
				? select('core/edit-post')
				: select('core/edit-site')) || {};

		const { innerBlockId, currentInnerBlock, publisherInnerBlocks } =
			useInnerBlocksInfo({ name, additional, attributes });

		const masterIsNormalState = (): boolean =>
			'normal' === attributes?.publisherCurrentState &&
			/desktop/i.test(getDeviceType());

		const isNormalState = (): boolean => {
			if (isInnerBlock(currentBlock)) {
				return (
					'normal' ===
						currentInnerBlock?.attributes?.publisherCurrentState &&
					/desktop/i.test(getDeviceType())
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

		const handleOnSwitchBlockSettings = (
			_currentBlock: 'master' | InnerBlockType
		): void => {
			setCurrentBlock(_currentBlock);
		};

		const { supports } = useSelect((select) => {
			const { getBlockType } = select('core/blocks');

			return getBlockType(name);
		});

		const blockEditRef = useRef(null);
		const { blockStateId, breakpointId } = useBlockStateInfo({
			attributes,
			currentBlock,
			getDeviceType,
			currentInnerBlock,
		});
		const currentAttributes = useCalculateCurrentAttributes({
			attributes,
			currentBlock,
			blockStateId,
			breakpointId,
			isNormalState,
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
			console.log(publisherAttributes, attributes.publisherInnerBlocks);
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
				!attributes.publisherInnerBlocks.length
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
			innerBlockId,
			blockStateId,
			breakpointId,
			isNormalState,
			getAttributes,
			blockId: name,
			masterIsNormalState,
			publisherInnerBlocks,
		});

		const styles = [];
		const generatorSharedProps = {
			attributes,
			activeDeviceType: getDeviceType(),
			blockName: name,
			callbackProps: {
				...config,
				blockProps: {
					clientId,
					supports,
					setAttributes,
				},
			},
		};

		Object.entries(styleGenerators).forEach(
			([supportId, { callback, fallbackSupportId }]) =>
				styles.push(
					// eslint-disable-next-line react-hooks/rules-of-hooks
					useCssGenerator({
						callback,
						supportId,
						fallbackSupportId,
						...generatorSharedProps,
					}).join('\n')
				)
		);

		const FillComponents = (): MixedElement => {
			return (
				<>
					<Fill name={`publisher-block-card-content-${clientId}`}>
						<BlockCard
							clientId={clientId}
							handleOnClick={handleOnSwitchBlockSettings}
							states={attributes.publisherBlockStates}
							currentInnerBlock={currentInnerBlock}
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
					blockStateId,
					breakpointId,
					setCurrentTab,
					isNormalState,
					setAttributes,
					getAttributes,
					currentInnerBlock,
					isOpenGridBuilder,
					setOpenGridBuilder,
					attributes: _attributes,
					handleOnChangeAttributes,
					handleOnSwitchBlockSettings,
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
								currentState:
									currentAttributes.publisherCurrentState,
							}}
						/>
						<SlotFillProvider>
							<BlockPartials clientId={clientId} />
							<FillComponents />
						</SlotFillProvider>
					</InspectorControls>
					<div ref={blockEditRef} />

					<style
						data-block-type={name}
						dangerouslySetInnerHTML={{
							__html: styles
								.filter((style: string) => style)
								.join('\n')
								.trim(),
						}}
					/>
				</StrictMode>

				{children}
			</BlockEditContextProvider>
		);
	},
	propsAreEqual
);
