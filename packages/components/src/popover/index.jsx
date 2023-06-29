/**
 * WordPress dependencies
 */
import { useContext, useState } from '@wordpress/element';
import { Popover as WPPopover } from '@wordpress/components';

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
import { isFunction } from '@publisher/utils';
//Tips of this import: 👇
//Relative path is used to avoid dependency on the storybook library in the production environment!
import { PopoverContextData } from '../../../../libs/storybook/decorators/with-popover-data/context';

export default function Popover({
	title = '',
	onClose = () => {},
	children,
	className,
	placement = 'bottom-start',
	...props
}) {
	const [isVisible, setIsVisible] = useState(true);
	const { onFocusOutside } = useContext(PopoverContextData);

	return (
		<>
			{isVisible && (
				<WPPopover
					className={componentClassNames(
						'popover',
						title && 'with-header',
						className
					)}
					onClose={onClose}
					onFocusOutside={
						isFunction(onFocusOutside) ? onFocusOutside : onClose
					}
					placement={placement}
					{...props}
				>
					{title && (
						<div
							className={componentInnerClassNames(
								'popover-header'
							)}
						>
							{title}

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
