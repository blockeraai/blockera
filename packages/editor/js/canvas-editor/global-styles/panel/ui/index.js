// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { detailedDiff } from 'deep-object-diff';
import type { ComponentType, MixedElement } from 'react';
import { useMemo, useState, useEffect, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	omit,
	mergeObject,
	useLateEffect,
	omitWithPattern,
} from '@blockera/utils';
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';
import { Button, Flex, ChangeIndicator } from '@blockera/controls';

/**
 * Internal dependencies
 */
import BlockStyles from './block-styles';
import { useGlobalStyle } from '../context/hooks';
import { type T_SET_CURRENT_ACTIVE_STYLE } from './types';
import { isBaseBreakpoint } from '../../../../canvas-editor';
import { useStylesForBlocks, getDefaultStyle } from './utils';
import { isInnerBlock } from '../../../../extensions/components';
import type {
	TStates,
	TBreakpoint,
} from '../../../../extensions/libs/block-card/block-states/types';
import {
	getNormalizedStyle,
	getBlockAttributes,
	useGlobalStylesPanelContext,
} from '../context';
import { prepareBlockeraDefaultAttributesValues } from '../../../../extensions/components/utils';
import type { InnerBlockType } from '../../../../extensions/libs/block-card/inner-blocks/types';
import { getBlockeraGlobalStylesMetaData } from '../../../../canvas-editor/global-styles/helpers';

type TBlockStyleVariations = {
	clientId: string,
	blockName: string,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	currentBlock: 'master' | InnerBlockType | string,
	context?: 'inspector-controls' | 'global-styles-panel',
};

export const BlockStyleVariations: ComponentType<TBlockStyleVariations> = ({
	clientId,
	blockName,
	currentBlock,
	currentState,
	currentBreakpoint,
	context = 'inspector-controls',
}: TBlockStyleVariations): MixedElement => {
	const { currentBlockStyleVariation } = useGlobalStylesPanelContext();
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const [event, setEvent] = useState('click');
	const onSwitch = useCallback(() => {}, []);
	const {
		onSelect,
		activeStyle,
		isDeletedStyle,
		stylesToRender,
		genericPreviewBlock,
		className: previewClassName,
	} = useStylesForBlocks({
		event,
		clientId,
		blockName,
		onSwitch,
	});

	const [currentActiveStyle, _setCurrentActiveStyle] = useState(activeStyle);
	const callbackActivatorStyle: T_SET_CURRENT_ACTIVE_STYLE = (
		style,
		event
	) => {
		setEvent(event);
		_setCurrentActiveStyle(style);
	};
	const setCurrentActiveStyle = useCallback(callbackActivatorStyle, []);
	const [currentPreviewStyle, setCurrentPreviewStyle] = useState(null);

	useEffect(() => {
		if (
			undefined === currentBlockStyleVariation &&
			!currentActiveStyle.isDefault
		) {
			setCurrentActiveStyle(getDefaultStyle(stylesToRender));
		}

		if (
			currentBlockStyleVariation?.name &&
			currentBlockStyleVariation?.name !== currentActiveStyle.name
		) {
			setCurrentActiveStyle(currentBlockStyleVariation);
		}
	}, [
		stylesToRender,
		currentActiveStyle,
		setCurrentActiveStyle,
		currentBlockStyleVariation,
	]);

	// Update cached style when active style changes
	useLateEffect(() => {
		// change back to old style
		if (
			currentPreviewStyle === null &&
			activeStyle?.name !== currentActiveStyle?.name
		) {
			onSelect(currentActiveStyle);
		}
	}, [currentPreviewStyle]);

	const blockeraGlobalStylesMetaData = getBlockeraGlobalStylesMetaData();

	const buttonText = useMemo(() => {
		if (isDeletedStyle) {
			return __('Missing Style Variation', 'blockera');
		}

		return (
			blockeraGlobalStylesMetaData?.blocks?.[blockName]?.variations?.[
				currentActiveStyle?.name
			]?.label ||
			currentActiveStyle.label ||
			currentActiveStyle.name ||
			__('Default', 'blockera')
		);
	}, [
		blockeraGlobalStylesMetaData,
		blockName,
		currentActiveStyle,
		isDeletedStyle,
	]);

	const memoizedStyles = useMemo(
		() => ({
			onSelect,
			stylesToRender,
			genericPreviewBlock,
			activeStyle: currentActiveStyle,
			setCurrentActiveStyle,
			setCurrentPreviewStyle,
			previewClassName,
			popoverAnchor,
			setIsOpen,
		}),
		[
			onSelect,
			stylesToRender,
			genericPreviewBlock,
			currentActiveStyle,
			setCurrentActiveStyle,
			setCurrentPreviewStyle,
			previewClassName,
			popoverAnchor,
			setIsOpen,
		]
	);

	if (
		!stylesToRender ||
		stylesToRender.length === 0 ||
		!['global-styles-panel', 'inspector-controls'].includes(context)
	) {
		return <></>;
	}

	const isNotActive =
		isInnerBlock(currentBlock) ||
		!isBaseBreakpoint(currentBreakpoint) ||
		currentState !== 'normal';

	const activeStyleId = currentActiveStyle?.isDefault
		? 'default'
		: currentActiveStyle?.name || 'default';

	if ('global-styles-panel' === context) {
		return (
			<BlockStyles
				context={context}
				isNotActive={false}
				blockName={blockName}
				styles={memoizedStyles}
			/>
		);
	}

	// Preparing block stored and default attributes.
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { storedAttributes, defaultAttributes } = useSelect(
		(select) => {
			const { getSelectedBlock } = select('core/block-editor');
			const { getBlockType } = select('core/blocks');
			const selectedBlock = getSelectedBlock();
			const blockType = getBlockType(blockName);

			const ignoredAttributes: Array<string> = [];

			for (const attribute in selectedBlock?.attributes) {
				if (ignoredAttributes.includes(attribute)) {
					continue;
				}

				if (!attribute.startsWith('blockera')) {
					ignoredAttributes.push(attribute);
				}
			}

			const storedAttributes = omit(
				selectedBlock?.attributes,
				ignoredAttributes
			);
			const defaultAttributes = omit(
				blockType?.attributes,
				ignoredAttributes
			);

			return {
				storedAttributes,
				defaultAttributes,
			};
		},
		[blockName]
	);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { blockeraOverrideBlockAttributes } = useMemo(
		() => getBlockAttributes(blockName),
		[blockName]
	);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const originDefaultAttributes = useMemo(() => {
		return mergeObject(blockeraOverrideBlockAttributes, defaultAttributes);
	}, [defaultAttributes, blockeraOverrideBlockAttributes]);
	// Preparing default attributes values for usage in global styles context.
	const defaultStylesValue = prepareBlockeraDefaultAttributesValues(
		originDefaultAttributes
	);
	let prefixParts: Array<string> = [];
	if (
		currentBlockStyleVariation &&
		!currentBlockStyleVariation?.isDefault &&
		currentBlockStyleVariation?.name
	) {
		prefixParts = ['variations', currentBlockStyleVariation.name].concat(
			prefixParts
		);
	}
	const prefix = prefixParts.join('.');
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [style] = useGlobalStyle(prefix, blockName, 'all', {
		shouldDecodeEncode: false,
		defaultStylesValue,
	});
	const _style = style;
	if (_style?.variations) {
		delete _style?.variations;
	}

	// Normalizing and cleanup block stored attributes.
	const normalizedAttributes = getNormalizedStyle(
		storedAttributes,
		defaultStylesValue
	);

	const { updated } = Object.keys(normalizedAttributes).length
		? detailedDiff(
				!Object.keys(_style).length
					? defaultStylesValue
					: mergeObject(defaultStylesValue, _style),
				normalizedAttributes
		  )
		: { updated: {} };

	const initializedValue =
		Object.keys(
			omitWithPattern(
				omit(updated, [
					'blockeraPropsId',
					'blockeraCompatId',
					'blockeraCurrentDevice',
				]),
				/!^blockera/i
			)
		).length > 0;
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [hasChangesets, setChangesets] = useState(initializedValue);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		if (initializedValue !== hasChangesets) {
			setChangesets(initializedValue);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initializedValue, currentActiveStyle]);

	return (
		<>
			<Button
				className={controlInnerClassNames(
					'style-variations-button',
					'is-variation-' + activeStyleId,
					{
						'blockera-control-is-not-active': isNotActive,
						'is-variation-picker-open': isOpen,
						'is-variation-deleted': isDeletedStyle ? true : false,
					}
				)}
				onClick={(event: MouseEvent) => {
					if (isOpen) {
						setIsOpen(false);
						setIsHovered(false);
					} else {
						setPopoverAnchor(event.currentTarget); // the <button> element itself
						setIsOpen(true);
					}
				}}
				disabled={isNotActive}
				isFocus={isOpen}
				data-test="style-variations-button"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onFocus={() => setIsHovered(true)}
				onBlur={() => setIsHovered(false)}
			>
				<Flex
					className={controlInnerClassNames(
						'style-variations-button__icon'
					)}
					direction="row"
					alignItems="center"
					justifyContent="center"
					data-test="style-variations-button-icon"
				>
					<Icon
						icon="style-variations-animated"
						iconSize={24}
						isAnimated={isOpen || isHovered}
					/>
				</Flex>

				<Flex
					className={controlInnerClassNames(
						'style-variations-button__label'
					)}
					direction="row"
					alignItems="center"
					justifyContent="space-around"
					data-test="style-variations-button-label"
					gap={5}
				>
					{buttonText}

					<ChangeIndicator
						isChanged={hasChangesets}
						isAnimated={true}
						primaryColor={
							activeStyleId === 'default' ? '#1ca120' : '#ffffff'
						}
						size={'5'}
						outlineSize={activeStyleId === 'default' ? '1.5' : '0'}
						style={{
							opacity: '0.8',
						}}
					/>

					<Icon icon="more-vertical-small" iconSize={24} />
				</Flex>
			</Button>

			{isOpen && popoverAnchor && (
				<BlockStyles
					blockName={blockName}
					originDefaultAttributes={originDefaultAttributes}
					hasChangesets={hasChangesets}
					setChangesets={setChangesets}
					styles={{
						onSelect,
						setIsOpen,
						popoverAnchor,
						stylesToRender,
						isDeletedStyle,
						previewClassName,
						genericPreviewBlock,
						setCurrentActiveStyle,
						setCurrentPreviewStyle,
						activeStyle: currentActiveStyle,
					}}
				/>
			)}
		</>
	);
};
