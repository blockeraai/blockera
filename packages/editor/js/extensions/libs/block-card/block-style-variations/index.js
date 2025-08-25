// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as blocksStore } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import {
	RepeaterControl,
	PromotionPopover,
	ControlContextProvider,
	getRepeaterActiveItemsCount,
} from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
// import { ItemBody } from './components';

export const BlockStyleVariations = ({
	name,
	children,
}: {
	name: string,
	children: MixedElement,
}) => {
	const blockStyleVariations = useSelect(
		(select) => {
			const { getBlockStyles } = select(blocksStore);
			return getBlockStyles(name);
		},
		[name]
	);

	console.log(blockStyleVariations);

	return (
		<ControlContextProvider
			value={{
				name: 'blockeraBlockStyleVariations',
				value: blockStyleVariations,
			}}
			storeName={'blockera/controls/repeater'}
		>
			<div
				className={'blockera-block-state-container'}
				data-test={'blockera-block-state-container'}
				aria-label={__('Blockera Block State Container', 'blockera')}
			>
				<RepeaterControl
					{...{
						onDelete: () => {},
						maxItems: 10,
						mode: 'nothing',
						selectable: true,
						isSupportInserter: true,
						id: 'block-style-variations',
						valueCleanup: (value) => value,
						defaultRepeaterItemValue: {},
						InserterComponent: () => <></>,
						onChange: (newValue) => {
							console.log(newValue);
						},
						repeaterItemHeader: ({ item }) => <>{item.label}</>,
						repeaterItemOpener: () => <></>,
						repeaterItemChildren: (): MixedElement => {
							return <></>;
						},
					}}
					defaultValue={blockStyleVariations}
					popoverTitle={__('Block Style Variations', 'blockera')}
					offset={8}
					popoverProps={{
						placement: 'bottom-end',
					}}
					className={controlInnerClassNames('block-states-repeater')}
					headerOpenButton={false}
					actionButtonDelete={true}
					actionButtonClone={false}
					actionButtonVisibility={false}
					popoverTitleButtonsRight={() => <></>}
					addNewButtonDataTest={'add-new-block-style-variation'}
					PromoComponent={({
						items,
						onClose = () => {},
						isOpen = false,
					}): MixedElement | null => {
						if (getRepeaterActiveItemsCount(items) < 2) {
							return null;
						}

						return (
							<PromotionPopover
								heading={__(
									'Advanced Block States',
									'blockera'
								)}
								featuresList={[
									__('Multiple states', 'blockera'),
									__('All block states', 'blockera'),
									__('Advanced features', 'blockera'),
									__('Premium blocks', 'blockera'),
								]}
								isOpen={isOpen}
								onClose={onClose}
							/>
						);
					}}
				>
					{children}
				</RepeaterControl>
			</div>
		</ControlContextProvider>
	);
};
