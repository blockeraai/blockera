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
	Flex,
	ToggleControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from '../helpers';
import { BreakpointIcon } from '../breakpoint-icon';

export default function ({
	item,
	itemId,
	onClick,
	setOpen,
}: {
	item: Object,
	itemId: number,
	onClick: (device: string) => void,
	setOpen: (isOpen: boolean) => void,
}): MixedElement {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();
	const { onChange, repeaterId, valueCleanup } = useContext(RepeaterContext);

	return (
		<Flex direction={'row'}>
			<div
				className={controlInnerClassNames('repeater-group-header')}
				aria-label={sprintf(
					// translators: it's the aria label for repeater item
					__('Item %s', 'blockera'),
					itemId
				)}
				onClick={(event) => {
					event.stopPropagation();
					setOpen(true);
				}}
			>
				<span className={controlInnerClassNames('header-icon')}>
					<BreakpointIcon name={item.type} />
				</span>

				<span className={controlInnerClassNames('header-label')}>
					{item.label}
				</span>

				{itemId !== getBaseBreakpoint() && (
					<span className={controlInnerClassNames('header-values')}>
						{!item.settings.max && (
							<>
								{item.settings.min.replace(/[a-z]+/i, '')} {'<'}
							</>
						)}
						{item.settings.max && item.settings.min && (
							<>
								{item.settings.min.replace(/[a-z]+/i, '')} to{' '}
								{item.settings.max.replace(/[a-z]+/i, '')}
							</>
						)}
						{!item.settings.min && (
							<>
								{'< '}
								{item.settings.max.replace(/[a-z]+/i, '')}
							</>
						)}
					</span>
				)}
				{itemId === getBaseBreakpoint() && (
					<span className={controlInnerClassNames('header-values')}>
						{__('Base', 'blockera')}
					</span>
				)}
			</div>
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
							onClick(picked ? item.type : getBaseBreakpoint());
						}}
					/>
				</ControlContextProvider>
			)}
		</Flex>
	);
}
