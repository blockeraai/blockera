/**
 * Publisher dependencies
 */
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { HStack } from '../index';
import './style.scss';

export default function Buttons({
	className,
	children,
	spacing = 2,
	...props
}) {
	return (
		<HStack
			spcaing={spacing}
			className={componentClassNames('buttons', className)}
			{...props}
		>
			{children}
		</HStack>
	);
}
