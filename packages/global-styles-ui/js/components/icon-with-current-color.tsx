/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { classNames } from '@blockera/classnames';

interface IconWithCurrentColorProps {
	icon: any;
	className?: string;
	size?: number;
	[key: string]: any;
}

export function IconWithCurrentColor({
	className,
	...props
}: IconWithCurrentColorProps) {
	return (
		<Icon
			className={classNames(
				className,
				'global-styles-ui-icon-with-current-color'
			)}
			{...props}
		/>
	);
}
