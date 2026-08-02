// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Button, Flex, CompanionPluginModal } from '@blockera/controls';
import { classNames, controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { AddNewStyleModal } from './add-new-style-modal';
import { useBlockStylesPickerContext } from '../context';
import { useUserCan } from '../../../../hooks/use-user-can';
import { VARIATION_SURFACE_SIZE } from '../variation-surfaces';

export const AddNewStyleButton = ({
	label,
	design = 'no-label',
	style = {},
}: {
	label?: string,
	design?: 'no-label' | 'with-label',
	style?: Object,
}): MixedElement => {
	const {
		counter,
		setCounter,
		counterMap,
		blockName,
		blockStyles,
		setBlockStyles,
		editorStyles: styles,
		setStyles,
		setCurrentActiveStyle,
		handlePromotionPopover,
		setCurrentBlockStyleVariation,
		variationSurface,
	} = useBlockStylesPickerContext();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
	const isUserCanSaveCustomizations = useUserCan('root', 'globalStyles');
	const isCompanionPlugin = applyFilters(
		'blockera.products.isCompanionPlugin',
		false
	);
	const isSizeSurface = variationSurface === VARIATION_SURFACE_SIZE;
	const addVariationTestId = isSizeSurface
		? 'add-new-block-size-variation'
		: 'add-new-block-style-variation';

	const handleAddClick = () => {
		if (!isCompanionPlugin) {
			setIsCompanionModalOpen(true);
			return;
		}

		const canAddNewStyle = handlePromotionPopover();

		if (canAddNewStyle) {
			setIsModalOpen(true);
		}
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

			{isUserCanSaveCustomizations && (
				<Button
					size="extra-small"
					className={controlInnerClassNames('btn-add')} // blockera-is-not-active
					onClick={handleAddClick}
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
					data-test={addVariationTestId}
				>
					<Icon icon="plus" iconSize="20" />

					{'with-label' === design &&
						'undefined' !== typeof label &&
						label?.length > 0 &&
						label}
				</Button>
			)}

			{isCompanionModalOpen && (
				<CompanionPluginModal
					isOpen={isCompanionModalOpen}
					onRequestClose={() => setIsCompanionModalOpen(false)}
				/>
			)}

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
					variationSurface={variationSurface}
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
