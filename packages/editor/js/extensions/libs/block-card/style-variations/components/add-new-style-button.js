// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { select } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { useEntityProp } from '@wordpress/core-data';
import { registerBlockStyle } from '@wordpress/blocks';
import { useState, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { mergeObject } from '@blockera/utils';
import { Button, Flex, PromotionPopover } from '@blockera/controls';
import { classNames, controlInnerClassNames } from '@blockera/classnames';

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
	blockStyles,
	setBlockStyles,
	design = 'no-label',
	setCurrentActiveStyle,
	setCurrentBlockStyleVariation,
}: {
	label?: string,
	counter: number,
	styles?: Object,
	blockName: string,
	design?: 'no-label' | 'with-label',
	blockStyles: Array<Object>,
	setStyles?: (styles: Object) => void,
	setCounter: (counter: number) => void,
	setCurrentActiveStyle: (style: Object) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	setCurrentBlockStyleVariation: (style: Object) => void,
}): MixedElement => {
	const MAX_ITEMS_FOR_PROMOTION = applyFilters(
		'blockera.block.style.variations.globalStylesMaxItems',
		2
	);

	const postId = select('core').__experimentalGetCurrentGlobalStylesId();
	const [globalStyles, setGlobalStyles] = useEntityProp(
		'root',
		'globalStyles',
		'styles',
		postId
	);

	const {
		styles: {
			blocks: { [blockName]: { variations } = { variations: {} } },
		},
	} = select('core').__experimentalGetCurrentThemeBaseGlobalStyles();

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
			icon: {
				name: 'blockera',
				library: 'blockera',
			},
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

		const { blockeraGlobalStylesMetaData } = window;

		setGlobalStyles(
			mergeObject(
				{
					...globalStyles,
					...(!globalStyles?.blockeraMetaData
						? { blockeraMetaData: blockeraGlobalStylesMetaData }
						: {}),
				},
				{
					blockeraMetaData: {
						blocks: {
							[blockName]: {
								variations: {
									[newStyle.name]: newStyle,
								},
							},
						},
					},
					blocks: {
						[blockName]: {
							variations: {
								[newStyle.name]: newStyle,
							},
						},
					},
				}
			)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [blockStyles]);

	return (
		<Flex justifyContent={'space-between'}>
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
				onClick={addNew}
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
