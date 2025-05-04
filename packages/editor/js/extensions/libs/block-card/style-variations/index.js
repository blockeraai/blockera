// @flow
/**
 * External dependencies
 */
import { memo, useState } from '@wordpress/element';
import type { ComponentType, MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { hasSameProps } from '@blockera/utils';
import { Popover, Button, Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { useStylesForBlocks } from './utils';
import BlockStyles from './components/block-styles';
import { isInnerBlock } from '../../../components';
import type { InnerBlockType } from '../inner-blocks/types';
import type { TBreakpoint, TStates } from '../block-states/types';
import { isBaseBreakpoint } from '../../../../canvas-editor';

type TBlockStyleVariations = {
	clientId: string,
	currentBlock: 'master' | InnerBlockType | string,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
};

export const BlockStyleVariations: ComponentType<TBlockStyleVariations> = memo(
	({
		clientId,
		currentBlock,
		currentState,
		currentBreakpoint,
	}: TBlockStyleVariations): MixedElement => {
		const [isOpen, setIsOpen] = useState(false);

		const {
			onSelect,
			stylesToRender,
			activeStyle,
			genericPreviewBlock,
			className: previewClassName,
		} = useStylesForBlocks({
			clientId,
			onSwitch: () => {},
		});

		if (!stylesToRender || stylesToRender.length === 0) {
			return <></>;
		}

		const isNotActive =
			isInnerBlock(currentBlock) ||
			!isBaseBreakpoint(currentBreakpoint) ||
			currentState !== 'normal';

		return (
			<>
				<Button
					className={controlInnerClassNames(
						'style-variations-button',
						'is-variation-' + (activeStyle?.name || 'default'),
						{
							'blockera-control-is-not-active': isNotActive,
							'is-variation-picker-open': isOpen,
						}
					)}
					onClick={() => setIsOpen(!isOpen)}
					disabled={isNotActive}
					isFocus={isOpen}
					data-test="style-variations-button"
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
						<Icon icon="style-variations" iconSize={20} />
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
						{activeStyle?.label || __('Default', 'blockera')}

						<Icon icon="more-vertical-small" iconSize={24} />
					</Flex>
				</Button>

				{isOpen && (
					<Popover
						title={''}
						offset={15}
						placement="bottom-middle"
						className="variations-picker-popover"
						onClose={() => setIsOpen(false)}
					>
						<BlockStyles
							styles={{
								onSelect,
								stylesToRender,
								activeStyle,
								genericPreviewBlock,
								previewClassName,
							}}
						/>
					</Popover>
				)}
			</>
		);
	},
	hasSameProps
);
