// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { ComponentType, MixedElement } from 'react';
import { memo, useMemo, useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { hasSameProps, useLateEffect } from '@blockera/utils';
import { Button, Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import BlockStyles from './components/block-styles';
import { isInnerBlock } from '../../../components';
import type { InnerBlockType } from '../inner-blocks/types';
import { isBaseBreakpoint } from '../../../../canvas-editor';
import { useStylesForBlocks, getDefaultStyle } from './utils';
import type { TBreakpoint, TStates } from '../block-states/types';
import { useGlobalStylesPanelContext } from '../../../../canvas-editor/components/block-global-styles-panel-screen/context';

type TBlockStyleVariations = {
	clientId: string,
	currentBlock: 'master' | InnerBlockType | string,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	context?: 'inspector-controls' | 'global-styles-panel',
};

export const BlockStyleVariations: ComponentType<TBlockStyleVariations> = memo(
	({
		clientId,
		blockName,
		currentBlock,
		currentState,
		currentBreakpoint,
		context = 'inspector-controls',
	}: TBlockStyleVariations): MixedElement => {
		const { currentBlockStyleVariation } =
			useGlobalStylesPanelContext() || {
				currentBlockStyleVariation: undefined,
			};
		const [popoverAnchor, setPopoverAnchor] = useState(null);
		const [isOpen, setIsOpen] = useState(false);
		const [isHovered, setIsHovered] = useState(false);

		const {
			onSelect,
			stylesToRender,
			activeStyle,
			genericPreviewBlock,
			className: previewClassName,
		} = useStylesForBlocks({
			clientId,
			blockName,
			onSwitch: () => {},
		});

		const [currentActiveStyle, setCurrentActiveStyle] =
			useState(activeStyle);
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
		}, [currentBlockStyleVariation, currentActiveStyle, stylesToRender]);

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

		const { blockeraGlobalStylesMetaData } = window;

		const buttonText = useMemo(() => {
			return (
				blockeraGlobalStylesMetaData?.blocks?.[blockName]?.variations?.[
					currentActiveStyle?.name
				]?.label ||
				currentActiveStyle.label ||
				currentActiveStyle.name ||
				__('Default', 'blockera')
			);
		}, [blockeraGlobalStylesMetaData, blockName, currentActiveStyle]);

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
					blockName={blockName}
					context={context}
					isNotActive={isNotActive}
					styles={{
						onSelect,
						stylesToRender,
						genericPreviewBlock,
						activeStyle: currentActiveStyle,
						setCurrentActiveStyle,
						setCurrentPreviewStyle,
						previewClassName,
						popoverAnchor,
						setIsOpen,
					}}
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
						data-test="style-variations-button-label"
						gap={0}
					>
						{buttonText}

						<Icon icon="more-vertical-small" iconSize={24} />
					</Flex>
				</Button>

				{isOpen && popoverAnchor && (
					<BlockStyles
						blockName={blockName}
						styles={{
							onSelect,
							stylesToRender,
							genericPreviewBlock,
							activeStyle: currentActiveStyle,
							setCurrentActiveStyle,
							setCurrentPreviewStyle,
							previewClassName,
							popoverAnchor,
							setIsOpen,
						}}
					/>
				)}
			</>
		);
	},
	hasSameProps
);
