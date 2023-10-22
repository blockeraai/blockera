/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Button, Popover } from '@publisher/components';
import { useOutsideClick, isFunction } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { default as PopoverOpenIcon } from './icons/popover-open';
import { default as AccordionOpenIcon } from './icons/accordion-open';
import { default as AccordionCloseIcon } from './icons/accordion-close';

export default function GroupControl({
	design,
	toggleOpenBorder,
	isOpen: _isOpen,
	//
	mode,
	popoverLabel,
	popoverClassName,
	//
	header,
	headerOpenButton,
	headerOpenIcon,
	headerCloseIcon,
	injectHeaderButtonsStart,
	injectHeaderButtonsEnd,
	//
	children,
	//
	className,
	onClose: fnOnClose,
	onOpen: fnOnOpen,
}) {
	const [isOpen, setOpen] = useState(_isOpen);
	const [isActivePopover, setActivePopover] = useState(_isOpen);
	const { ref } = useOutsideClick({
		onOutsideClick: () => setOpen(false),
	});

	function getHeaderOpenIcon() {
		if (headerOpenIcon) {
			return headerOpenIcon;
		}

		if (mode === 'accordion') return <AccordionOpenIcon />;
		else if (mode === 'popover') return <PopoverOpenIcon />;

		return '';
	}

	function getHeaderCloseIcon() {
		if (headerCloseIcon) {
			return headerCloseIcon;
		}

		if (mode === 'accordion') return <AccordionCloseIcon />;
		else if (mode === 'popover') return <PopoverOpenIcon />;

		return '';
	}

	function onOpen() {
		if (isFunction(fnOnOpen)) {
			fnOnOpen();
		}
	}

	function onClose() {
		if (isFunction(fnOnClose)) {
			fnOnClose();
		}
	}

	return (
		<div
			className={controlClassNames(
				'group',
				'design-' + design,
				'mode-' + mode,

				isOpen || (isActivePopover && !isOpen) ? 'is-open' : 'is-close',
				toggleOpenBorder ? 'toggle-open-border' : '',
				className
			)}
		>
			<div
				ref={ref}
				className={controlInnerClassNames('group-header')}
				onClick={() => {
					if (!isOpen) {
						onClose();
					} else {
						onOpen();
					}

					setOpen(!isOpen);
					setActivePopover(!isActivePopover);
				}}
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
									? __('Close Settings', 'publisher')
									: __('Open Settings', 'publisher')
							}
							onClick={(event) => {
								event.stopPropagation();

								if (!isOpen) {
									onClose();
								} else {
									onOpen();
								}

								setOpen(!isOpen);
							}}
							noBorder={true}
						/>
					)}

					{injectHeaderButtonsEnd}
				</div>
			</div>

			{mode === 'popover' && isActivePopover && (
				<Popover
					offset={35}
					placement="left-start"
					className={controlInnerClassNames(
						'group-popover',
						popoverClassName
					)}
					title={popoverLabel || header}
					onClose={() => {
						onClose();

						setActivePopover(false);
					}}
				>
					{children}
				</Popover>
			)}

			{mode === 'accordion' && isOpen && (
				<div className={controlInnerClassNames('group-content')}>
					{children}
				</div>
			)}
		</div>
	);
}

GroupControl.propTypes = {
	/**
	 * The design style of group.
	 */
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
	mode: PropTypes.oneOf(['accordion', 'popover']),
	/**
	 * Text or component to show in group header.
	 */
	header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	/**
	 * Show group open close button?
	 */
	headerOpenButton: PropTypes.bool,
	/**
	 * Custom icon for header open/close button for opening it
	 */
	headerOpenIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
	/**
	 * Custom icon for header open/close button for closing it
	 */
	headerCloseIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
	/**
	 * Injection location for adding item in the beginning of the buttons (before open/close button)
	 */
	injectHeaderButtonsStart: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.func,
		PropTypes.string,
	]),
	/**
	 * Injection location for adding item in the end of the buttons (after open/close button)
	 */
	injectHeaderButtonsEnd: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.func,
		PropTypes.string,
	]),
	/**
	 * Group body content
	 */
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	/**
	 * Popover custom  title if `mode` is `popover`
	 */
	popoverLabel: PropTypes.string,
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

GroupControl.defaultProps = {
	design: 'minimal',
	isOpen: false,
	mode: 'popover',
	header: 'Title...',
	children: 'Content...',
	toggleOpenBorder: false,
	headerOpenButton: true,
};
