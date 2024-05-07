// @flow

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { isFunction } from '@blockera/utils';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { NoticeIcon } from './utils';
import DismissIcon from './icons/dismiss-icon';
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
							<DismissIcon />
						</span>
					)}
				</Flex>
			</BaseControl>
		)
	);
}

NoticeControl.propTypes = {
	/**
	 * Label for field. If you pass empty value the field will not be added and simple control will be rendered
	 *
	 * @default ""
	 */
	label: PropTypes.string,
	/**
	 * Field id for passing into child Field component
	 *
	 * @default "toggle-select"
	 */
	field: PropTypes.string,
	/**
	 * Columns setting for Field grid.
	 *
	 * @default "columns-2"
	 */
	columns: PropTypes.string,
	/**
	 * Function that will be fired while clicking on dismiss.
	 */
	onDismiss: PropTypes.func,
	/**
	 * flag to show icon or not.
	 */
	showIcon: PropTypes.bool,
	/**
	 * define colors and icons based on type
	 */
	type: (PropTypes.oneOf([
		'information',
		'warning',
		'success',
		'error',
	]): any),
	/**
	 * string or jsx to place in content.If you pass empty value, component will not render.
	 */
	children: PropTypes.string.isRequired,
	/**
	 * flag to show dismiss or not
	 */
	isDismissible: PropTypes.bool,
	/**
	 * flag to render control or not
	 */
	isShown: PropTypes.bool,
	/**
	 * Function that will be fired when control rendered
	 */
	onShown: PropTypes.func,
};