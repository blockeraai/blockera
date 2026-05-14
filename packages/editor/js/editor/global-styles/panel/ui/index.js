// @flow
/**
 * External dependencies
 */
import type { ComponentType, MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';
import { Button, Flex, ChangeIndicator } from '@blockera/controls';

/**
 * Internal dependencies
 */
import BlockStyles from './block-styles';
import { isBaseBreakpoint } from '../../../../';
import { isInnerBlock } from '../../../../extensions/components';
import type {
	TStates,
	TBreakpoint,
} from '../../../../extensions/libs/block-card/block-states/types';
import type { InnerBlockType } from '../../../../extensions/libs/block-card/inner-blocks/types';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../variation-surfaces';
import { useGlobalStylesPanelContext } from '../context';

type TBlockStyleVariations = {
	clientId: string,
	blockName: string,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	currentBlock: 'master' | InnerBlockType | string,
	context?: 'inspector-controls' | 'global-styles-panel',
	isOpen: boolean,
	setIsOpen: (open: boolean) => void,
	buttonText: string,
	hasChangesets: boolean,
	popoverAnchor: boolean,
	setChangesets: (changes: boolean) => void,
	memoizedStyles: Object,
	setPopoverAnchor: (val: boolean) => void,
	originDefaultAttributes: Object,
	currentBlockStyleVariation: Object,
	event: string,
	setEvent: (e: string) => void,
	onSelect: () => void,
	activeStyle: Object,
	isDeletedStyle: string,
	stylesToRender: Object,
	previewClassName: string,
	genericPreviewBlock: Object,
	currentActiveStyle: Object,
	setCurrentActiveStyle: (s: Object) => void,
	isHovered: boolean,
	setIsHovered: (hovered: boolean) => void,
	currentPreviewStyle: Object,
	setCurrentPreviewStyle: (style: Object) => void,
	blockeraGlobalStylesMetaData: Object,
	variationUiSurface?: string,
};

export const BlockStyleVariations: ComponentType<TBlockStyleVariations> = ({
	blockName,
	currentBlock,
	currentState,
	currentBreakpoint,
	context = 'inspector-controls',
	isOpen,
	setIsOpen,
	buttonText,
	hasChangesets,
	popoverAnchor,
	setChangesets,
	memoizedStyles,
	setPopoverAnchor,
	originDefaultAttributes,
	onSelect,
	isDeletedStyle,
	stylesToRender,
	previewClassName,
	genericPreviewBlock,
	currentActiveStyle,
	setCurrentActiveStyle,
	isHovered,
	setIsHovered,
	setCurrentPreviewStyle,
	variationUiSurface,
}: TBlockStyleVariations): MixedElement => {
	const { variationSurface = VARIATION_SURFACE_STYLE } =
		useGlobalStylesPanelContext();

	const uiSurface =
		variationUiSurface !== undefined && variationUiSurface !== ''
			? variationUiSurface
			: variationSurface;

	const accentDefault =
		uiSurface === VARIATION_SURFACE_SIZE ? '#0516FF' : '#1ca120';

	if (!['global-styles-panel', 'inspector-controls'].includes(context)) {
		return <></>;
	}

	if (
		!stylesToRender ||
		(stylesToRender.length === 0 &&
			!(
				context === 'global-styles-panel' &&
				variationSurface === VARIATION_SURFACE_SIZE
			))
	) {
		return <></>;
	}

	const isNotActive =
		isInnerBlock(currentBlock) ||
		!isBaseBreakpoint(currentBreakpoint) ||
		currentState !== 'normal';

	const isSizeVariation = uiSurface === VARIATION_SURFACE_SIZE;
	const styleActiveId = currentActiveStyle?.isDefault
		? 'default'
		: currentActiveStyle?.name || 'default';
	const activeStyleId =
		isSizeVariation && (!currentActiveStyle || !currentActiveStyle.name)
			? 'unset'
			: styleActiveId;

	if ('global-styles-panel' === context) {
		return (
			<BlockStyles
				context={context}
				isNotActive={false}
				blockName={blockName}
				styles={memoizedStyles}
				pickerVariationSurface={uiSurface}
			/>
		);
	}

	return (
		<>
			<Button
				className={controlInnerClassNames(
					'style-variations-button',
					'is-variation-' + activeStyleId,
					{
						'blockera-control-is-not-active': isNotActive,
						'is-variation-picker-open': isOpen,
						'is-variation-deleted': isDeletedStyle,
						'is-variation-ui-size':
							uiSurface === VARIATION_SURFACE_SIZE,
					}
				)}
				onClick={(event: MouseEvent) => {
					if (isOpen) {
						setIsOpen(false);
						setIsHovered(false);
					} else {
						// $FlowFixMe
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
							activeStyleId === 'default'
								? accentDefault
								: '#ffffff'
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
					pickerVariationSurface={uiSurface}
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

export const BlockSizeVariations: ComponentType<TBlockStyleVariations> = (
	props: TBlockStyleVariations
): MixedElement => (
	<BlockStyleVariations
		{...props}
		variationUiSurface={VARIATION_SURFACE_SIZE}
	/>
);
