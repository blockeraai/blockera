/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './style.scss';
import classnames from '@publisher/classnames';

export default function GroupControl({
	isOpen,
	header,
	children,
	isPopover = false,
	className = 'group',
}) {
	return (
		<div className={classnames('control', className)}>
			<div className="header">
				<div className="header-label">{header}</div>
			</div>
			{isPopover
				? isOpen && (
						<Popover>
							<div className="content">{children}</div>
						</Popover>
				  )
				: isOpen && <div className="content">{children}</div>}
		</div>
	);
}
