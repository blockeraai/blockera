// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { classNames } from '@blockera/classnames';

export const Image = ({
	src,
	alt,
	className,
}: {
	src: string,
	alt: string,
	className: string | Object,
}): MixedElement => {
	return <img src={src} alt={alt} className={classNames(className)} />;
};
