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

export default function GroupControl({
	design = 'minimal',
	toggleOpenBorder = false,
	disableAccordionOpenPrimaryBorder = false,
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
	headerVariableSlug,
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

		if (mode === 'accordion') {
			return <Icon library="wp" icon="chevron-up" iconSize="20" />;
		} else if (mode === 'popover') {
			return <Icon icon="gear" iconSize="18" />;
		}

		return '';
	};

	const getHeaderCloseIcon = () => {
		if (headerCloseIcon) {
			return headerCloseIcon;
		}

		if (mode === 'accordion') {
			return <Icon library="wp" icon="chevron-down" iconSize="20" />;
		} else if (mode === 'popover') {
			return <Icon icon="gear" iconSize="18" />;
		}

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

	return (
		<div
			className={controlClassNames(
				'group',
				'design-' + design,
				'mode-' + mode,
				isOpen ? 'is-open' : 'is-close',
				toggleOpenBorder && !disableAccordionOpenPrimaryBorder
					? 'toggle-open-border'
					: '',
				disableAccordionOpenPrimaryBorder && mode === 'accordion'
					? 'no-accordion-open-primary-border'
					: '',
				className
			)}
			data-cy="control-group"
			aria-label={'group-control'}
		>
			<div
				className={controlInnerClassNames('group-header')}
				data-cy="group-control-header"
				{...(headerVariableSlug
					? { 'data-variable-slug': headerVariableSlug }
					: {})}
				onClick={handleOnClick}
			>
				{(injectHeaderButtonsStart ||
					injectHeaderButtonsEnd ||
					(headerOpenButton && actionButtonsType === 'inline')) && (
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
