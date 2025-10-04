// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';
import { registerBlockStyle } from '@wordpress/blocks';
import { useState, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Button, Flex, PromotionPopover } from '@blockera/controls';
import { classNames, controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { useGlobalStylesContext } from '../../../../../canvas-editor/components/block-global-styles-panel-screen/global-styles-provider';

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
	setStyles,
	blockName,
	blockStyles,
	setBlockStyles,
	setCurrentActiveStyle,
	setCurrentBlockStyleVariation,
}: {
	label: string,
	styles?: Object,
	blockName: string,
	blockStyles: Array<Object>,
	setStyles?: (styles: Object) => void,
	setCurrentActiveStyle: (style: Object) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	setCurrentBlockStyleVariation: (style: Object) => void,
}): MixedElement => {
	const MAX_ITEMS_FOR_PROMOTION = applyFilters(
		'blockera.block.style.variations.globalStylesMaxItems',
		2
	);

	const {
		base: {
			styles: {
				blocks: { [blockName]: { variations } = { variations: {} } },
			},
		},
	} = useGlobalStylesContext();

	const [counter, setCounter] = useState(0);
	const [isPromotionPopoverOpen, setIsPromotionPopoverOpen] = useState(false);
	const addNew = useCallback(() => {
		setCounter(counter + 1);

		const staticStylesCount = Object.keys(variations).length;
		const dynamicStylesCount = blockStyles.length;

		if (
			-1 !== MAX_ITEMS_FOR_PROMOTION &&
			(counter >= MAX_ITEMS_FOR_PROMOTION ||
				(staticStylesCount < dynamicStylesCount &&
					dynamicStylesCount - staticStylesCount >=
						MAX_ITEMS_FOR_PROMOTION))
		) {
			return setIsPromotionPopoverOpen(true);
		}

		// Find first available number by checking existing style names
		let number = blockStyles.length + 1;

		const existingNumbers = blockStyles
			.map((style) => {
				const match = style.name.match(/^style-(\d+)$/);
				return match ? parseInt(match[1]) : null;
			})
			.filter((num) => num !== null);

		// reset number if there are no existing numbers.
		if (!existingNumbers.length) {
			number = 1;
		} else {
			// Sort existing numbers and get the highest number
			// $FlowFixMe
			const maxNumber = Math.max(...existingNumbers);
			number = maxNumber + 1;
		}

		// Find first gap in sequence or use next number
		while (existingNumbers.includes(number)) {
			number++;
		}

		const name = `style-${number}`;
		const styleLabel = __('Style', 'blockera') + ' ' + number;
		const newStyle = {
			name,
			label: styleLabel,
		};

		setBlockStyles([...blockStyles, newStyle]);

		if (styles && 'function' === typeof setStyles) {
			setStyles({
				...styles,
				variations: {
					...(styles.variations || {}),
					[newStyle.name]: {},
				},
			});
		}

		registerBlockStyle(blockName, newStyle);

		setCurrentBlockStyleVariation(newStyle);

		setCurrentActiveStyle(newStyle);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [blockStyles]);

	return (
		<Flex justifyContent={'space-between'}>
			<h2 className={classNames('blockera-block-styles-category')}>
				{label}
			</h2>

			<Button
				size="extra-small"
				className={controlInnerClassNames('btn-add')} // blockera-is-not-active
				onClick={addNew}
				style={{
					width: '24px',
					height: '24px',
					padding: 0,
					marginLeft: 'auto',
				}}
				data-test={'add-new-block-style-variation'}
			>
				<Icon icon="plus" iconSize="20" />
			</Button>

			{isPromotionPopoverOpen && (
				<PromoteGlobalStylesPremiumFeature
					items={blockStyles}
					onClose={() => setIsPromotionPopoverOpen(false)}
					isOpen={isPromotionPopoverOpen}
				/>
			)}
		</Flex>
	);
};
