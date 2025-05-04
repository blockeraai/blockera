// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { ComponentType, MixedElement } from 'react';
import { memo } from '@wordpress/element';

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
import { Button, Popover } from '../';
import type { GroupControlProps } from './types';

const GroupControl: ComponentType<any> = memo(
	({
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
		//
		children = 'Content...',
		//
		className,
		onClose: fnOnClose = () => {},
		onOpen: fnOnOpen = () => {},
		onClick = () => {},
	}: GroupControlProps): MixedElement => {
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

					{header}
				</div>

				{mode === 'popover' && isOpen && (
					<Popover
						offset={popoverOffset}
						placement="left-start"
						{...popoverProps}
						className={controlInnerClassNames(
							'group-popover',
							popoverClassName
						)}
						title={popoverTitle || header}
						titleButtonsRight={popoverTitleButtonsRight}
						onClose={() => {
							onClose();
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
