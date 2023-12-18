// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch, select } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { Icon } from '@publisher/components';
import { useControlContext } from '@publisher/controls';
import { controlInnerClassNames } from '@publisher/classnames';

export default function ItemHeader({
	item,
	itemId,
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
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const {
		__experimentalSetPreviewDeviceType: setDeviceType,
		// __experimentalGetPreviewDeviceType: getDeviceType,
		// eslint-disable-next-line react-hooks/rules-of-hooks
	} = useDispatch('core/edit-site') ? {} : useDispatch('core/edit-post');

	const handleOnClick = (device: string): void => {
		const modifiedBreakpoints = item.breakpoints.map((breakpoint) => {
			if (breakpoint.type === device) {
				return {
					...breakpoint,
					force: true,
				};
			}

			return breakpoint;
		});
		changeRepeaterItem({
			itemId,
			controlId,
			value: {
				...item,
				breakpoints: modifiedBreakpoints,
			},
		});
	};

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event) => isOpenPopoverEvent(event) && setOpen(!isOpen)}
			aria-label={sprintf(
				// translators: it's the aria label for repeater item
				__('Item %d', 'publisher-core'),
				itemId + 1
			)}
		>
			{/*<span*/}
			{/*	className={controlInnerClassNames(*/}
			{/*		'header-icon'*/}
			{/*	)}*/}
			{/*>*/}
			{/*	{icon}*/}
			{/*</span>*/}

			<span className={controlInnerClassNames('header-label')}>
				{item.label}
			</span>

			<span className={controlInnerClassNames('header-settings')}>
				<Icon
					library={'wp'}
					icon={'tablet'}
					onClick={(event) => {
						event.stopPropagation();

						const getDeviceType =
							select(
								'core/edit-post'
							).__experimentalGetPreviewDeviceType();

						if ('Tablet' === getDeviceType) {
							// eslint-disable-next-line no-unused-expressions
							setDeviceType && setDeviceType('Desktop');

							return;
						}

						// eslint-disable-next-line no-unused-expressions
						setDeviceType && setDeviceType('Tablet');

						handleOnClick('tablet');
					}}
				/>
				<Icon
					library={'wp'}
					icon={'mobile'}
					onClick={(event) => {
						event.stopPropagation();

						const getDeviceType =
							select(
								'core/edit-post'
							).__experimentalGetPreviewDeviceType();

						if ('Mobile' === getDeviceType) {
							// eslint-disable-next-line no-unused-expressions
							setDeviceType && setDeviceType('Desktop');

							return;
						}

						// eslint-disable-next-line no-unused-expressions
						setDeviceType && setDeviceType('Mobile');

						handleOnClick('mobile');
					}}
				/>
			</span>

			{/*<span*/}
			{/*	className={controlInnerClassNames(*/}
			{/*		'header-values'*/}
			{/*	)}*/}
			{/*>*/}
			{/*	{preview}*/}
			{/*</span>*/}

			{children}
		</div>
	);
}
