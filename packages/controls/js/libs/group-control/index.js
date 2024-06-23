// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { ComponentType, MixedElement } from 'react';
import { memo, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { useOutsideClick, isFunction } from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Button, Popover } from '../';
import type { GroupControlProps } from './types';

const GroupControl: ComponentType<any> = memo(
	({
		design = 'minimal',
		toggleOpenBorder = false,
		isOpen: _isOpen = false,
		//
		mode = 'popover',
		popoverTitle,
		popoverTitleButtonsRight,
		popoverClassName,
		//
		header = 'Title...',
		headerOpenButton = true,
		headerOpenIcon,
		headerCloseIcon,
		injectHeaderButtonsStart,
		injectHeaderButtonsEnd,
		//
		children = 'Content...',
		//
		className,
		onClose: fnOnClose = () => {},
		onOpen: fnOnOpen = () => {},
		onClick = () => {},
	}: GroupControlProps): MixedElement => {
		const [isOpen, setOpen] = useState(_isOpen);
		const [isOpenPopover, setOpenPopover] = useState(_isOpen);
		const { ref } = useOutsideClick({
			onOutsideClick: () => setOpen(false),
		});

		const getHeaderOpenIcon = (): MixedElement | string => {
			if (headerOpenIcon) {
				return headerOpenIcon;
			}

			if (mode === 'accordion')
				return <Icon library="wp" icon="chevron-up" iconSize="20" />;
			else if (mode === 'popover')
				return <Icon icon="gear" iconSize="18" />;

			return '';
		};

		const getHeaderCloseIcon = () => {
			if (headerCloseIcon) {
				return headerCloseIcon;
			}

			if (mode === 'accordion')
				return <Icon library="wp" icon="chevron-down" iconSize="20" />;
			else if (mode === 'popover')
				return <Icon icon="gear" iconSize="18" />;

			return '';
		};

		const onOpen = () => {
			if (isFunction(fnOnOpen)) {
				fnOnOpen();
			}
		};

		const onClose = () => {
			if (isFunction(fnOnClose)) {
				fnOnClose();
			}
		};

		const onClickCallback = () => {
			if (isOpen) {
				onClose();
			} else {
				onOpen();
			}

			setOpen(!isOpen);
			setOpenPopover(!isOpenPopover);
		};

		const isCallbackEligible = (event: MouseEvent) => {
			return isFunction(onClick) && onClick && onClick(event);
		};

		const handleOnClick = (event: MouseEvent): void => {
			event.stopPropagation();

			if (!isCallbackEligible(event)) {
				return;
			}

			onClickCallback();
		};

		return (
			<div
				className={controlClassNames(
					'group',
					'design-' + design,
					'mode-' + mode,

					isOpen || (isOpenPopover && !isOpen)
						? 'is-open'
						: 'is-close',
					toggleOpenBorder ? 'toggle-open-border' : '',
					className
				)}
				data-cy="control-group"
				aria-label={'group-control'}
			>
				<div
					ref={ref}
					className={controlInnerClassNames('group-header')}
					data-cy="group-control-header"
					onClick={handleOnClick}
				>
					{header}

					<div className={controlInnerClassNames('action-buttons')}>
						{injectHeaderButtonsStart}

						{headerOpenButton && (
							<Button
								className={controlInnerClassNames('btn-toggle')}
								icon={
									isOpen
										? getHeaderOpenIcon()
										: getHeaderCloseIcon()
								}
								label={
									isOpen
										? __('Close Settings', 'blockera')
										: __('Open Settings', 'blockera')
								}
								onClick={onClickCallback}
								noBorder={true}
							/>
						)}

						{injectHeaderButtonsEnd}
					</div>
				</div>

				{mode === 'popover' && isOpenPopover && (
					<Popover
						offset={35}
						placement="left-start"
						className={controlInnerClassNames(
							'group-popover',
							popoverClassName
						)}
						title={popoverTitle || header}
						titleButtonsRight={popoverTitleButtonsRight}
						onClose={() => {
							onClose();

							setOpenPopover(false);
						}}
					>
						{children}
					</Popover>
				)}

				{mode === 'accordion' && isOpen && (
					<div
						data-cy="group-control-content"
						className={controlInnerClassNames('group-content')}
					>
						{children}
					</div>
				)}
			</div>
		);
	}
);

export default GroupControl;
