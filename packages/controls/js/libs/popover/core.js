// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { Popover as WPPopover } from '@wordpress/components';
import { useContext, useRef, useEffect, forwardRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { isFunction, isUndefined } from '@blockera/utils';
import { PopoverContextData } from '@blockera/dev-storybook/js/decorators/with-popover-data/context';

/**
 * Internal dependencies
 */
import { Button } from '../button';
import type { TPopoverProps } from './types';

type TPopoverCoreProps = {
	...TPopoverProps,
	ref?: { current: ?HTMLElement },
};

export const PopoverCore: React$AbstractComponent<TPopoverCoreProps, mixed> =
	forwardRef<TPopoverCoreProps, mixed>(
		(
			{
				design = 'highlight',
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
				headerRef,
				anchor,
				...props
			}: TPopoverCoreProps,
			ref
		): MixedElement => {
			const { onFocusOutside, shift, resize, flip } =
				useContext(PopoverContextData);

			const internalRef = useRef();
			const popoverRef = ref || internalRef;

			useEffect(() => popoverRef.current?.focus(), []);

			function popoverOnFocusOutside(e: MouseEvent) {
				const excludeClasses = [
					'btn-choose-image',
					'btn-media-library',
					'btn-upload',
					'btn-pick-color',
				];

				if (
					excludeClasses.filter((className) =>
						((e.target: any): HTMLElement).classList.contains(
							className
						)
					).length !== 0
				) {
					return false;
				}

				// Check if the target is the anchor element
				if (
					anchor &&
					anchor.contains(
						popoverRef.current?.ownerDocument?.activeElement
					)
				) {
					return false;
				}

				onClose();
			}

			return (
				<WPPopover
					className={componentClassNames(
						'popover',
						'popover-' + design,
						title && 'with-header',
						className
					)}
					onClose={onClose}
					onFocusOutside={
						isFunction(onFocusOutside)
							? onFocusOutside
							: popoverOnFocusOutside
					}
					shift={!isUndefined(shift) ? shift : _shift}
					resize={!isUndefined(resize) ? resize : _resize}
					flip={!isUndefined(flip) ? flip : _flip}
					animate={animate}
					placement={placement}
					focusOnMount={focusOnMount}
					ref={popoverRef}
					{...props}
				>
					{title && (
						<div
							className={componentInnerClassNames(
								'popover-header'
							)}
							data-test="popover-header"
							ref={headerRef}
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
											onClick={onClose}
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
			);
		}
	);
