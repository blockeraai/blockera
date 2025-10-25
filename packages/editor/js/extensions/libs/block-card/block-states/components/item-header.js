// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import {
	Tooltip,
	InputControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
	ConditionalWrapper,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { TStates } from '../types';
import { getNormalizedCssSelector } from '../../../block-composite/search-items';
import { getTooltipStyle } from '../../../block-composite/utils';

export default function ItemHeader({
	item,
	itemId,
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}: {
	item: Object,
	itemId: TStates,
	isOpen: boolean,
	setOpen: (status: boolean) => void,
	children?: Element<any>,
	isOpenPopoverEvent: (event: SyntheticEvent<EventTarget>) => void,
}): Element<any> {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { onChange, valueCleanup } = useContext(RepeaterContext);

	return (
		<ConditionalWrapper
			condition={item?.tooltip}
			wrapper={(children) => (
				<Tooltip
					text={item?.tooltip}
					width="220px"
					style={getTooltipStyle('state')}
				>
					{children}
				</Tooltip>
			)}
		>
			<div
				className={controlInnerClassNames('repeater-group-header')}
				onClick={(event) =>
					isOpenPopoverEvent(event) && setOpen(!isOpen)
				}
				aria-label={sprintf(
					// translators: it's the aria label for repeater item
					__('Item %s', 'blockera'),
					itemId
				)}
			>
				{'custom-class' === item.type ? (
					<span className={controlInnerClassNames('header-label')}>
						<ControlContextProvider
							value={{
								name: controlId + '-' + item.type,
								value: item['css-class'] || '',
							}}
						>
							<InputControl
								className={controlInnerClassNames(
									'content-editable'
								)}
								aria-label={__('Custom Class', 'blockera')}
								placeholder="&.custom-class"
								defaultValue={item['css-class'] || ''}
								onChange={(newValue) => {
									changeRepeaterItem({
										value: {
											...item,
											'css-class':
												getNormalizedCssSelector(
													newValue
												),
										},
										itemId,
										onChange,
										controlId,
										valueCleanup,
										getId: (): TStates => itemId,
									});
								}}
							/>
						</ControlContextProvider>
					</span>
				) : (
					<span className={controlInnerClassNames('header-label')}>
						{item.label}
					</span>
				)}

				{children}
			</div>
		</ConditionalWrapper>
	);
}
