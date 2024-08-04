// @flow

/**
 * External dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isFunction } from '@blockera/utils';
import { controlClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Flex } from '../';
import { NoticeIcon } from './utils';
import BaseControl from '../base-control';
import type { TNoticeControlProps } from './types';

export default function NoticeControl({
	label,
	columns,
	field,
	className,
	showIcon = true,
	type = 'warning',
	children,
	isDismissible = false,
	onDismiss,
	isShown: _isShown = true,
	onShown,
	style,
	...props
}: TNoticeControlProps): any {
	const [isShown, setIsShown] = useState(_isShown);

	const handleOnDismiss = () => {
		if (isFunction(onDismiss)) {
			// $FlowFixMe
			onDismiss();
		}
		setIsShown(false);
	};

	// $FlowFixMe
	if (isShown && children && isFunction(onShown)) onShown();

	return (
		isShown &&
		children && (
			<BaseControl
				label={label}
				columns={columns}
				controlName={field}
				className={className}
			>
				<Flex
					alignItems="flex-start"
					gap="8px"
					className={`${controlClassNames(
						'notice'
					)} blockera-${type}`}
					data-test="notice-control"
					style={style}
					{...props}
				>
					{showIcon && (
						<span
							data-test="notice-control-icon"
							className="notice-control-icon"
						>
							{NoticeIcon(type)}
						</span>
					)}

					<div
						data-test="notice-control-content"
						className="notice-control-content"
					>
						{children}
					</div>

					{isDismissible && (
						<span
							className="notice-control-icon dismiss"
							onClick={handleOnDismiss}
							data-test="notice-control-dismiss"
						>
							<Icon
								icon="dismiss"
								iconSize="18"
								data-test="notice-control-icon-dismiss"
							/>
						</span>
					)}
				</Flex>
			</BaseControl>
		)
	);
}
