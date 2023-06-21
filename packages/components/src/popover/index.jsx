/**
 * WordPress dependencies
 */
import { Popover as WPPopover } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { Button } from '../button';
import CloseIcon from './icons/close';

export default function Popover({
	label = '',
	onClose = () => {},
	children,
	className,
	...props
}) {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<>
			{isVisible && (
				<WPPopover
					className={componentClassNames(
						'popover',
						label && 'with-header',
						className
					)}
					onClose={onClose}
					{...props}
				>
					{label && (
						<div
							className={componentInnerClassNames(
								'popover-header'
							)}
						>
							{label}

							<Button
								className={componentInnerClassNames(
									'popover-close'
								)}
								noBorder={true}
								size="extra-small"
								align="center"
								onClick={() => {
									setIsVisible(false);
									onClose();
								}}
								tabindex="-1"
							>
								<CloseIcon />
							</Button>
						</div>
					)}

					<div className={componentInnerClassNames('popover-body')}>
						{children}
					</div>
				</WPPopover>
			)}
		</>
	);
}
