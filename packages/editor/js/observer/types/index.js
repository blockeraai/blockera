// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type IntersectionObserverProps = {
	callback: (...args: Array<any>) => any,
	options: IntersectionObserverOptions,
	target?: string | HTMLElement,
};

export type Ancestors = Array<IntersectionObserverProps>;

export type ObserverProps = {
	ancestors: Ancestors,
	children: MixedElement,
};
