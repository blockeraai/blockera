// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

export const Avatar = ({
	src,
	alt,
	className,
}: {
	src: string,
	alt: string,
	className: string,
}): MixedElement => {
	return (
		<img
			src={src}
			alt={alt}
			className={controlClassNames(className, { avatar: true })}
		/>
	);
};
