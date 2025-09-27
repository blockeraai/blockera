// @flow

/**
 * External dependencies
 */
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';
import { mergeObject, getSortedObject } from '@blockera/utils';
import { RepeaterControl, ControlContextProvider } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { InnerBlocksProps } from './types';
import ItemHeader from './components/item-header';
import { useBlockSection } from '../../../components';

export const InnerBlocksExtension: ComponentType<InnerBlocksProps> = memo(
	(props: InnerBlocksProps): MixedElement => {
		const {
			block,
			values,
			onChange,
			maxItems,
			contextValue,
			currentState,
			setCurrentBlock,
			currentBreakpoint,
			setBlockClientInners,
		} = props;
		const { onToggle } = useBlockSection('innerBlocksConfig');

		return (
			<ControlContextProvider
				value={contextValue}
				storeName={'blockera/controls/repeater'}
			>
				<RepeaterControl
					{...{
						maxItems,
						mode: 'nothing',
						selectable: true,
						id: 'inner-blocks',
						actionButtonAdd: false,
						onDelete: (itemId, items) => {
							delete values[itemId];
							delete items[itemId];

							onChange('blockeraInnerBlocks', values, {
								ref: {
									path:
										'normal' === currentState &&
										'desktop' === currentBreakpoint
											? `blockeraBlockStates.value[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks`
											: 'blockeraInnerBlocks.value',
									reset: false,
									action: 'normal',
									defaultValue: {},
								},
							});

							const newValue = mergeObject(values, items);

							setBlockClientInners({
								clientId: block?.clientId,
								inners: getSortedObject(
									newValue,
									'settings',
									10
								),
							});

							return newValue;
						},
						onChange: (newValue: Object) => {
							if (newValue?.value) {
								const items = newValue?.value || {};

								for (const name in items) {
									const item = items[name];

									if (!item?.isSelected) {
										continue;
									}

									setCurrentBlock(name);
									onToggle(true, 'switch-to-inner', name);
								}
							}
						},
						repeaterItemChildren: () => {},
						repeaterItemHeader: ItemHeader,
					}}
					defaultValue={{}}
					className={controlInnerClassNames('inner-blocks-repeater')}
					icon={<Icon icon="inner-blocks" />}
					actionButtonClone={false}
					actionButtonVisibility={false}
				/>
			</ControlContextProvider>
		);
	}
);
