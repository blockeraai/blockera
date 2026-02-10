// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Button, Flex, PromotionPopover } from '@blockera/controls';
import { classNames, controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { AddNewStyleModal } from './add-new-style-modal';

const PromoteGlobalStylesPremiumFeature = ({
	items,
	onClose = () => {},
	isOpen = false,
}: {
	items: Array<Object>,
	onClose: () => void,
	isOpen: boolean,
}): MixedElement | null => {
	if (items.length < 2) {
		return null;
	}

	return (
		<PromotionPopover
			heading={__('Advanced Global Styles', 'blockera')}
			featuresList={[
				__('Multiple styles', 'blockera'),
				__('All styles', 'blockera'),
				__('Advanced features', 'blockera'),
				__('Premium styles', 'blockera'),
			]}
			isOpen={isOpen}
			onClose={onClose}
		/>
	);
};

export const AddNewStyleButton = ({
	label,
	styles,
	counter,
	setStyles,
	blockName,
	setCounter,
	counterMap,
	blockStyles,
	setBlockStyles,
	design = 'no-label',
	setCurrentActiveStyle,
	setCurrentBlockStyleVariation,
	style = {},
}: {
	label?: string,
	counter: number,
	styles?: Object,
	blockName: string,
	counterMap: Object,
	design?: 'no-label' | 'with-label',
	blockStyles: Array<Object>,
	setStyles?: (styles: Object) => void,
	setCounter: (counter: number) => void,
	setCurrentActiveStyle: (style: Object) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	setCurrentBlockStyleVariation: (style: Object) => void,
	style?: Object,
}): MixedElement => {
	const MAX_ITEMS_FOR_PROMOTION = applyFilters(
		'blockera.block.style.variations.globalStylesMaxItems',
		2
	);

	const [isPromotionPopoverOpen, setIsPromotionPopoverOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleClick = () => {
		// Validate limitation for adding new style variation.
		if (
			-1 !== MAX_ITEMS_FOR_PROMOTION &&
			counter >= MAX_ITEMS_FOR_PROMOTION
		) {
			return setIsPromotionPopoverOpen(true);
		}

		setIsModalOpen(true);
	};

	return (
		<Flex justifyContent={'space-between'} style={style}>
			{'no-label' === design &&
				'undefined' !== typeof label &&
				label?.length > 0 && (
					<h2
						className={classNames('blockera-block-styles-category')}
					>
						{label}
					</h2>
				)}

			<Button
				size="extra-small"
				className={controlInnerClassNames('btn-add')} // blockera-is-not-active
				onClick={handleClick}
				style={
					'no-label' === design
						? {
								width: '24px',
								height: '24px',
								padding: 0,
								marginLeft: 'auto',
							}
						: {
								padding: '0px 10px 0 4px',
								gap: '2px',
							}
				}
				data-test={'add-new-block-style-variation'}
			>
				<Icon icon="plus" iconSize="20" />

				{'with-label' === design &&
					'undefined' !== typeof label &&
					label?.length > 0 &&
					label}

				{isPromotionPopoverOpen && (
					<PromoteGlobalStylesPremiumFeature
						items={blockStyles}
						onClose={() => setIsPromotionPopoverOpen(false)}
						isOpen={isPromotionPopoverOpen}
					/>
				)}
			</Button>

			{isModalOpen && (
				<AddNewStyleModal
					blockStyles={blockStyles}
					blockName={blockName}
					styles={styles}
					setStyles={setStyles}
					setBlockStyles={setBlockStyles}
					setCurrentBlockStyleVariation={
						setCurrentBlockStyleVariation
					}
					setCurrentActiveStyle={setCurrentActiveStyle}
					isOpen={isModalOpen}
					setIsOpen={setIsModalOpen}
					counter={counter}
					setCounter={setCounter}
					counterMap={counterMap}
				/>
			)}
		</Flex>
	);
};
