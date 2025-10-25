// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { Icon as WordPressIconComponent } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { isString } from '@blockera/utils';
import { Tooltip } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';
import { getTooltipStyle } from '../../../block-composite/utils';

export default function ItemHeader({
	item,
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}: {
	item: Object,
	itemId: number,
	isOpen: boolean,
	setOpen: (status: boolean) => void,
	children?: Element<any>,
	isOpenPopoverEvent: (event: SyntheticEvent<EventTarget>) => void,
}): Element<any> {
	const nameSplitted = item.name ? item.name.split('/') : [];

	return (
		<Tooltip
			text={
				<>
					<h5
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '5px',
						}}
					>
						{item.icon && (
							<>
								{isString(item.icon) ? (
									<WordPressIconComponent icon={item.icon} />
								) : (
									item.icon
								)}
							</>
						)}

						{sprintf('%s Block', item.label)}
					</h5>

					<p>{item.description}</p>

					{item.name?.startsWith('elements/') && (
						<code style={{ margin: '5px 0' }}>
							{__('Virtual Block', 'blockera')}
						</code>
					)}

					<code style={{ margin: '5px 0' }}>
						{nameSplitted.length === 2 ? (
							<>
								<span
									style={{
										opacity: '0.7',
									}}
								>
									{nameSplitted[0]}
								</span>
								<span
									style={{
										opacity: '0.7',
										margin: '0 3px',
									}}
								>
									/
								</span>
								{nameSplitted[1]}
							</>
						) : (
							<>{item.name}</>
						)}
					</code>
				</>
			}
			width="220px"
			style={getTooltipStyle('inner-block')}
		>
			<div
				className={controlInnerClassNames(
					'repeater-group-header',
					'blockera-inner-block-item'
				)}
				onClick={(event) =>
					isOpenPopoverEvent(event) && setOpen(!isOpen)
				}
				aria-label={sprintf(
					// translators: it's the aria label for repeater item
					__('Item %s', 'blockera'),
					item?.name
				)}
			>
				<span
					className={controlInnerClassNames(
						'header-label',
						'blockera-inner-block-label'
					)}
				>
					{item.label}
				</span>

				{children}
			</div>
		</Tooltip>
	);
}
