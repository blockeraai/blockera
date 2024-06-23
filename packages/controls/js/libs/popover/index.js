// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState, useRef, useEffect } from '@wordpress/element';
import { Popover as WPPopover } from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { isFunction, isUndefined } from '@blockera/utils';
import { PopoverContextData } from '@blockera/dev-storybook/js/decorators/with-popover-data/context';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Button } from '../button';
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
											label={__('Close', 'blockera')}
											aria-label={__('Close', 'blockera')}
											tooltipPosition="top"
											showTooltip={true}
										>
											<Icon icon="close" iconSize="16" />
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
