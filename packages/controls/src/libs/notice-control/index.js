// @flow

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { isFunction } from '@publisher/utils';

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
	showIcon,
	type,
	children,
	isDismissible,
	onDismiss,
}: TNoticeControlProps): MixedElement {
	const [isShown, setIsShown] = useState(children ? true : false);

	const handleOnDismiss = () => {
		if (isFunction(onDismiss)) {
			onDismiss();
		}
		setIsShown(false);
	};

	return (
		isShown && (
			<BaseControl
				label={label}
				columns={columns}
				controlName={field}
				className={className}
			>
				<Flex
					alignItems="flex-start"
					gap="8px"
					className={`publisher-notice-control publisher-${type}`}
					data-test="notice-control"
				>
					{showIcon && (
						<span data-test="notice-control-icon">
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
							className="notice-control-dismiss"
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
};

NoticeControl.defaultProps = {
	type: 'warning',
	showIcon: true,
	isDismissible: false,
};
