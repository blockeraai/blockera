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
import { isElementInsideModalOverlay } from '../modal/overlay-utils';
import type { TPopoverProps } from './types';

function shouldIgnorePopoverFocusOutside(
	event: FocusEvent,
	popoverRoot: ?HTMLElement
): boolean {
	const related = event?.relatedTarget;

	if (related && popoverRoot && popoverRoot.contains(related)) {
		return true;
	}

	if (related instanceof HTMLElement) {
		if (isElementInsideModalOverlay(related)) {
			return true;
		}

		if (related.closest('.components-dropdown__content')) {
			return true;
		}

		// Color pickers, nested settings popovers, and similar UI portal outside.
		const nestedPopover = related.closest('.components-popover');
		if (nestedPopover && nestedPopover !== popoverRoot) {
			return true;
		}

		if (
			related.closest(
				'.blockera-control-value-addon-pointers, [data-cy="value-addon-btn-open"], [data-cy="value-addon-btn"]'
			)
		) {
			return true;
		}
	}

	// WordPress focus-outside often fires with a null relatedTarget while the
	// user is interacting with portaled surfaces. Only suppress close when focus
	// is still inside this popover or a related overlay — not for genuine
	// outside clicks (which also report null relatedTarget).
	if (!related) {
		const active = popoverRoot?.ownerDocument?.activeElement;

		if (active instanceof Node && popoverRoot?.contains(active)) {
			return true;
		}

		if (active instanceof HTMLElement) {
			if (isElementInsideModalOverlay(active)) {
				return true;
			}

			if (active.closest('.components-dropdown__content')) {
				return true;
			}

			const nestedPopover = active.closest('.components-popover');
			if (nestedPopover && nestedPopover !== popoverRoot) {
				return true;
			}
		}

		return false;
	}

	return false;
}

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
				shift: _shift = false,
				flip: _flip = true,
				animate = true,
				closeButton = true,
				focusOnMount = 'firstElement',
				titleButtonsRight = '',
				titleButtonsLeft = '',
				headerRef,
				anchor,
				focusOutsideSuppressionRef,
				...props
			}: TPopoverCoreProps,
			ref
		): MixedElement => {
			const { onFocusOutside, shift, resize, flip } =
				useContext(PopoverContextData);

			const internalRef = useRef();
			const popoverRef = ref || internalRef;

			useEffect(() => {
				popoverRef.current?.focus();
				// Only steal focus when the popover first mounts — not on every re-render.
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			function popoverOnFocusOutside(e: FocusEvent) {
				if (focusOutsideSuppressionRef?.current) {
					return;
				}

				const excludeClasses = [
					'btn-choose-image',
					'btn-media-library',
					'btn-upload',
					'btn-pick-color',
				];

				if (
					e.target instanceof HTMLElement &&
					excludeClasses.filter((className) =>
						e.target.classList.contains(className)
					).length !== 0
				) {
					return;
				}

				// Check if the target is the anchor element
				if (
					anchor &&
					anchor.contains(
						popoverRef.current?.ownerDocument?.activeElement
					)
				) {
					return;
				}

				if (shouldIgnorePopoverFocusOutside(e, popoverRef.current)) {
					return;
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
					anchor={anchor}
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
									{titleButtonsRight}

									{closeButton && (
										<Button
											className={componentInnerClassNames(
												'popover-close'
											)}
											size="extra-small"
											align="center"
											data-test="close-popover"
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
