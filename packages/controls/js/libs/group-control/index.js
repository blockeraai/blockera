// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import React, { type MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { isFunction } from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Button, Popover, DropdownMenu } from '../';
import type { GroupControlProps } from './types';

/**
 * Check if a value is a valid React element that returns content
 *
 * @param {*} value - The value to check
 * @return {boolean} true if the value is a valid React element that renders content, false otherwise
 */
const isValidReactElement = (value: any): boolean => {
	if (value === null || value === undefined) {
		return false;
	}

	// First check if it's a valid React element
	if (!React.isValidElement(value)) {
		return false;
	}

	// If it's a function component, we need to render it to check if it returns content
	if (isFunction(value.type)) {
		try {
			// Render the component to see what it returns
			// Note: This might fail for components using hooks, but that's okay - we'll catch and return false
			const result = value.type(value.props);

			// If it returns null, undefined, or false, it doesn't render anything
			if (result === null || result === undefined || result === false) {
				return false;
			}

			// If it returns a valid element (including fragments), it will render something
			if (React.isValidElement(result)) {
				return true;
			}

			// If it returns a primitive (string, number), it will render something
			if (
				typeof result === 'string' ||
				typeof result === 'number' ||
				typeof result === 'boolean'
			) {
				return result !== false;
			}

			// If it returns an array, check if it has any valid content
			if (Array.isArray(result)) {
				// Check if array has any non-null, non-undefined, non-false items
				return result.some(
					(item) =>
						item !== null &&
						item !== undefined &&
						item !== false &&
						(React.isValidElement(item) ||
							typeof item === 'string' ||
							typeof item === 'number')
				);
			}

			// For other cases, assume it renders something
			return true;
		} catch (e) {
			// If rendering throws an error (e.g., hooks used outside React context),
			// we can't determine if it renders content, so assume it does
			// This is safer than hiding potentially valid content
			return true;
		}
	}

	// For non-function components (like DOM elements), it's valid
	return true;
};

export default function GroupControl({
	design = 'minimal',
	toggleOpenBorder = false,
	isOpen = false,
	//
	mode = 'popover',
	popoverProps,
	popoverTitle,
	popoverOffset = 35,
	popoverTitleButtonsRight,
	popoverClassName,
	//
	header = 'Title...',
	headerOpenButton = true,
	headerOpenIcon,
	headerCloseIcon,
	injectHeaderButtonsStart,
	injectHeaderButtonsEnd,
	actionButtonsType = 'inline',
	actionMenuButtonLabel = __('More Options', 'blockera'),
	//
	children = 'Content...',
	//
	className,
	onClose: fnOnClose = () => {},
	onOpen: fnOnOpen = () => {},
	onClick = () => {},
}: GroupControlProps): MixedElement {
	const getHeaderOpenIcon = (): MixedElement | string => {
		if (headerOpenIcon) {
			return headerOpenIcon;
		}

		if (mode === 'accordion')
			return <Icon library="wp" icon="chevron-up" iconSize="20" />;
		else if (mode === 'popover') return <Icon icon="gear" iconSize="18" />;

		return '';
	};

	const getHeaderCloseIcon = () => {
		if (headerCloseIcon) {
			return headerCloseIcon;
		}

		if (mode === 'accordion')
			return <Icon library="wp" icon="chevron-down" iconSize="20" />;
		else if (mode === 'popover') return <Icon icon="gear" iconSize="18" />;

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

	// Check if we have any valid content to show in action-buttons
	const hasValidActionButtonsContent = () => {
		if (actionButtonsType === 'inline') {
			// Check if headerOpenButton is enabled
			if (headerOpenButton) {
				return true;
			}
		}

		// Check if injectHeaderButtonsStart is valid and renders content
		if (isValidReactElement(injectHeaderButtonsStart)) {
			return true;
		}

		// Check if injectHeaderButtonsEnd is valid and renders content
		if (isValidReactElement(injectHeaderButtonsEnd)) {
			return true;
		}

		return false;
	};

	// Check if we should show action buttons
	// The injectHeaderButtonsStart and injectHeaderButtonsEnd are passed from outside and we dont know that they have valid content or not
	// So we need to check if they are valid and render content
	const shouldShowActionButtons = hasValidActionButtonsContent();

	return (
		<div
			className={controlClassNames(
				'group',
				'design-' + design,
				'mode-' + mode,
				isOpen ? 'is-open' : 'is-close',
				toggleOpenBorder ? 'toggle-open-border' : '',
				className
			)}
			data-cy="control-group"
			aria-label={'group-control'}
		>
			<div
				className={controlInnerClassNames('group-header')}
				data-cy="group-control-header"
				onClick={handleOnClick}
			>
				{shouldShowActionButtons && (
					<div
						className={controlInnerClassNames(
							'action-buttons',
							'type-' + actionButtonsType
						)}
					>
						{actionButtonsType === 'inline' && (
							<>
								{injectHeaderButtonsStart}

								{headerOpenButton && (
									<Button
										className={controlInnerClassNames(
											'btn-toggle'
										)}
										label={
											isOpen
												? __(
														'Close Settings',
														'blockera'
												  )
												: __(
														'Open Settings',
														'blockera'
												  )
										}
										onClick={onClickCallback}
										noBorder={true}
									>
										{isOpen
											? getHeaderOpenIcon()
											: getHeaderCloseIcon()}
									</Button>
								)}

								{injectHeaderButtonsEnd}
							</>
						)}

						{actionButtonsType === 'menu' && (
							<>
								<DropdownMenu
									label={actionMenuButtonLabel}
									icon={
										<Icon
											icon="more-vertical"
											iconSize="18"
										/>
									}
									popoverProps={{
										offset: 20,
										focusOnMount: true,
										placement: 'bottom-end',
									}}
									menuProps={{
										className:
											controlInnerClassNames(
												'group-item-menu'
											),
									}}
									toggleProps={{
										onClick: (e) => {
											e.stopPropagation();
											e.preventDefault();
										},
									}}
								>
									{() => {
										return (
											<>
												{injectHeaderButtonsStart}

												{injectHeaderButtonsEnd}
											</>
										);
									}}
								</DropdownMenu>
							</>
						)}
					</div>
				)}

				{header}
			</div>

			{mode === 'popover' && isOpen && (
				<Popover
					offset={popoverOffset}
					placement="left-start"
					className={controlInnerClassNames(
						'group-popover',
						popoverClassName
					)}
					title={popoverTitle || header}
					titleButtonsRight={popoverTitleButtonsRight}
					onClose={() => {
						onClose();
					}}
					{...popoverProps}
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
