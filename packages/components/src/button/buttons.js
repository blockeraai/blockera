/**
 * Publisher dependencies
 */
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import { HStack } from '../index';

/**
 *
 * classes:
 * text-center = center align content
 *
 * size-small
 */
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
