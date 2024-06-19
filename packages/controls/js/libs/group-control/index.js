// @flow

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
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

GroupControl.propTypes = {
	// $FlowFixMe
	design: PropTypes.oneOf(['minimal']),
	/**
	 * Add border outline for group while it's open? Please note it works only in accordion mode, and it's always active for popover mode
	 */
	toggleOpenBorder: PropTypes.bool,
	/**
	 * is group open by default or not
	 */
	isOpen: PropTypes.bool,
	/**
	 * The group open mode.
	 */
	// $FlowFixMe
	mode: PropTypes.oneOf(['accordion', 'popover']),
	/**
	 * Text or component to show in group header.
	 */
	// $FlowFixMe
	header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	/**
	 * Show group open close button?
	 */
	headerOpenButton: PropTypes.bool,
	/**
	 * Custom icon for header open/close button for opening it
	 */
	// $FlowFixMe
	headerOpenIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
	/**
	 * Custom icon for header open/close button for closing it
	 */
	// $FlowFixMe
	headerCloseIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
	/**
	 * Injection location for adding item in the beginning of the buttons (before open/close button)
	 */
	// $FlowFixMe
	injectHeaderButtonsStart: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.func,
		PropTypes.string,
	]),
	/**
	 * Injection location for adding item in the end of the buttons (after open/close button)
	 */
	// $FlowFixMe
	injectHeaderButtonsEnd: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.func,
		PropTypes.string,
	]),
	/**
	 * Group body content
	 */
	// $FlowFixMe
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	/**
	 * Popover custom  title if `mode` is `popover`
	 */
	popoverTitle: PropTypes.string,
	/**
	 * Custom className for adding to popover
	 */
	popoverClassName: PropTypes.string,
	/**
	 * Function that will be fired while closing group
	 */
	onClose: PropTypes.func,
	/**
	 * Function that will be fired while opening group
	 */
	onOpen: PropTypes.func,
};

export default GroupControl;
