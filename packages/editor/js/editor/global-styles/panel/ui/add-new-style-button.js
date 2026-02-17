// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Button, Flex } from '@blockera/controls';
import { classNames, controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { AddNewStyleModal } from './add-new-style-modal';

export const AddNewStyleButton = ({
	label,
	styles,
	counter,
	setStyles,
	blockName,
	setCounter,
	counterMap,
	style = {},
	blockStyles,
	setBlockStyles,
	design = 'no-label',
	setCurrentActiveStyle,
	handlePromotionPopover,
	setCurrentBlockStyleVariation,
}: {
	label?: string,
	counter: number,
	styles?: Object,
	blockName: string,
	counterMap: Object,
	blockStyles: Array<Object>,
	design?: 'no-label' | 'with-label',
	setStyles?: (styles: Object) => void,
	handlePromotionPopover: () => boolean,
	setCounter: (counter: number) => void,
	setCurrentActiveStyle: (style: Object) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	setCurrentBlockStyleVariation: (style: Object) => void,
	style?: Object,
}): MixedElement => {
	const [isModalOpen, setIsModalOpen] = useState(false);
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
				onClick={() => {
					const canAddNewStyle = handlePromotionPopover();
					if (canAddNewStyle) {
						setIsModalOpen(true);
					}
				}}
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
