// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import {
	ToggleControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { BreakpointIcon } from '../breakpoint-icon';
import { getBaseBreakpoint, prepValueForHeader } from '../helpers';

export default function ({
	item,
	itemId,
	setOpen,
	isOpen,
}: {
	item: Object,
	itemId: string,
	setOpen: (isOpen: boolean) => void,
	isOpen: boolean,
}): MixedElement {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();
	const { repeaterItems, onChange, repeaterId, valueCleanup } =
		useContext(RepeaterContext);

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			aria-label={sprintf(
				// translators: %s: The breakpoint item ID
				__('Item %s', 'blockera'),
				itemId
			)}
			onClick={(event) => {
				// Check if the click was on an input element and stop propagation or open the repeater item
				if (
					event.target.tagName === 'INPUT' ||
					event.target.closest('input')
				) {
					event.stopPropagation();
				} else {
					setOpen(true);
				}
			}}
		>
			<span className={controlInnerClassNames('header-icon')}>
				<BreakpointIcon
					context="admin"
					name={itemId}
					settings={item.settings}
					breakpoints={repeaterItems}
					isDefault={item.isDefault}
					tooltip={false}
				/>
			</span>

			<span className={controlInnerClassNames('header-label')}>
				{item.label}

				<span>
					{!item.settings.max && item.settings.min && (
						<>
							{sprintf(
								// translators: %s is the min value of the breakpoint
								__('>= %s', 'blockera'),
								prepValueForHeader(item.settings.min)
							)}
						</>
					)}

					{item.settings.max && item.settings.min && (
						<>
							{sprintf(
								// translators: %1$s is the min value of the breakpoint, %2$s is the max value of the breakpoint
								__('%1$s to %2$s', 'blockera'),
								prepValueForHeader(item.settings.min),
								prepValueForHeader(item.settings.max)
							)}
						</>
					)}

					{!item.settings.min && item.settings.max && (
						<>
							{sprintf(
								// translators: %s is the max value of the breakpoint
								__('<= %s', 'blockera'),
								prepValueForHeader(item.settings.max)
							)}
						</>
					)}

					{itemId === getBaseBreakpoint() && (
						<>{__('Base Breakpoint', 'blockera')}</>
					)}
				</span>
			</span>

			<span
				className={controlInnerClassNames('header-values')}
				style={{
					gap: '5px',
				}}
			>
				{itemId !== getBaseBreakpoint() && (
					<ControlContextProvider
						value={{
							name: `toggle${itemId}`,
							value: item.settings.picked,
						}}
					>
						<ToggleControl
							labelType={'self'}
							id={`toggle${itemId}`}
							defaultValue={item.settings.picked}
							onChange={(picked: boolean): void => {
								changeRepeaterItem({
									controlId,
									itemId,
									onChange,
									repeaterId,
									valueCleanup,
									value: {
										...item,
										status: picked,
										settings: {
											...item.settings,
											picked,
										},
									},
								});
							}}
						/>
					</ControlContextProvider>
				)}

				{isOpen ? (
					<Icon library="wp" icon="chevron-up" iconSize="20" />
				) : (
					<Icon library="wp" icon="chevron-down" iconSize="20" />
				)}
			</span>
		</div>
	);
}
