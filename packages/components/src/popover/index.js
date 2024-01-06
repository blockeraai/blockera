// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState, useRef, useEffect } from '@wordpress/element';
import { Popover as WPPopover } from '@wordpress/components';
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';
/**
 * Publisher dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@publisher/classnames';
import { isFunction, isUndefined } from '@publisher/utils';
import { PopoverContextData } from '@publisher/storybook/decorators/with-popover-data/context';

/**
 * Internal dependencies
 */
import { Button } from '../button';
import CloseIcon from './icons/close';
import type { TPopoverProps } from './types';

export default function Popover({
	title = '',
	onClose = () => {},
	children,
	className,
	placement = 'bottom-start',
	resize: _resize = true,
	shift: _shift = true,
	flip: _flip = true,
	animate = true,
	closeButton = true,
	focusOnMount = 'firstElement',
	titleButtonsRight = '',
	titleButtonsLeft = '',
	...props
}: TPopoverProps): MixedElement {
	const [isVisible, setIsVisible] = useState(true);

	/**
	 * You can use popover context provider to wrap this component and prevent closing popover with
	 * provided onFocusOutside fn for implement other functionality.
	 */
	const { onFocusOutside, shift, resize, flip } =
		useContext(PopoverContextData);

	const handleOnClose = () => {
		onClose();
		setIsVisible(false);
	};

	const popoverRef = useRef();

	useEffect(() => popoverRef.current.focus(), []);

	return (
		<>
			{isVisible && (
				<WPPopover
					className={componentClassNames(
						'popover',
						title && 'with-header',
						className
					)}
					onClose={handleOnClose}
					onFocusOutside={
						isFunction(onFocusOutside)
							? onFocusOutside
							: (e) => {
									const excludeClasses = [
										'btn-choose-image',
										'btn-media-library',
										'btn-upload',
										'btn-pick-color',
									];

									return excludeClasses.filter((className) =>
										e.target.classList.contains(className)
									).length !== 0
										? false
										: handleOnClose();
							  }
					}
					shift={!isUndefined(shift) ? shift : _shift}
					resize={!isUndefined(resize) ? resize : _resize}
					flip={!isUndefined(flip) ? flip : _flip}
					animate={animate}
					placement={placement}
					focusOnMount={focusOnMount}
					{...props}
					ref={popoverRef}
				>
					{title && (
						<div
							className={componentInnerClassNames(
								'popover-header'
							)}
							data-test="popover-header"
						>
							{titleButtonsLeft && (
								<div
									className={componentInnerClassNames(
										'popover-title-buttons',
										'title-left-buttons'
									)}
								>
									{titleButtonsLeft}
								</div>
							)}

							{title}

							{(closeButton || titleButtonsRight) && (
								<div
									className={componentInnerClassNames(
										'popover-title-buttons',
										'title-right-buttons'
									)}
								>
									{titleButtonsRight && (
										<>{titleButtonsRight}</>
									)}

									{closeButton && (
										<Button
											className={componentInnerClassNames(
												'popover-close'
											)}
											size="extra-small"
											align="center"
											onClick={() => {
												setIsVisible(false);
												onClose();
											}}
											tabIndex="-1"
											label={__('Close', 'publisher')}
											aria-label={__(
												'Close',
												'publisher-core'
											)}
											tooltipPosition="top"
											showTooltip={true}
										>
											<CloseIcon />
										</Button>
									)}
								</div>
							)}
						</div>
					)}

					<div
						className={componentInnerClassNames('popover-body')}
						data-test="popover-body"
					>
						{children}
					</div>
				</WPPopover>
			)}
		</>
	);
}

Popover.propTypes = {
	/**
	 * Popover Title
	 */
	title: PropTypes.string,
	/**
	 * Event that would be called while closing popover.
	 */
	onClose: PropTypes.func,
	/**
	 * Used to specify the popover's position with respect to its anchor.
	 *
	 * @default 'bottom-start'
	 */
	// $FlowFixMe
	placement: PropTypes.oneOf([
		'top-start',
		'top',
		'top-end',
		'right-start',
		'right',
		'right-end',
		'bottom-start',
		'bottom',
		'bottom-end',
		'left-start',
		'left',
		'left-end',
	]),
	/**
	 * Adjusts the size of the popover to prevent its contents from going out of
	 * view when meeting the viewport edges.
	 *
	 * @default true
	 */
	resize: PropTypes.bool,
	/**
	 * Enables the `Popover` to shift in order to stay in view when meeting the
	 * viewport edges.
	 *
	 * @default false
	 */
	shift: PropTypes.bool,
	/**
	 * Specifies whether the popover should flip across its axis if there isn't
	 * space for it in the normal placement.
	 * When the using a 'top' placement, the popover will switch to a 'bottom'
	 * placement. When using a 'left' placement, the popover will switch to a
	 * `right' placement.
	 * The popover will retain its alignment of 'start' or 'end' when flipping.
	 *
	 * @default true
	 */
	flip: PropTypes.bool,
	/**
	 * Whether the popover should animate when opening.
	 *
	 * @default true
	 */
	animate: PropTypes.bool,
	/**
	 * The distance (in px) between the anchor and the popover.
	 */
	offset: PropTypes.number,
};
