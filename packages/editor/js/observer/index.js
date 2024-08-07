// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type {
	ObserverProps,
	Ancestors,
	IntersectionObserverProps,
} from './types';

const useObservers = (ancestors: Ancestors): Array<IntersectionObserver> => {
	return (
		ancestors
			.map(
				(
					ancestor: IntersectionObserverProps
				): IntersectionObserver | null => {
					const { options, callback } = ancestor;

					if ('string' === typeof options?.root) {
						const element = document.querySelector(options.root);

						if (element) {
							options.root = element;
						}
					}

					if (!options?.root) {
						return null;
					}

					return new IntersectionObserver(callback, options);
				}
			)
			// $FlowFixMe
			.filter(
				(observer: IntersectionObserver | null): boolean =>
					// $FlowFixMe
					null !== observer && observer?.root
			)
	);
};

export const Observer = ({
	ancestors,
	children,
}: ObserverProps): MixedElement => {
	const observers = useObservers(ancestors);

	observers.forEach((observer: IntersectionObserver, index: number): void => {
		let target;

		if ('string' === typeof ancestors[index].target) {
			target = document.querySelector(ancestors[index].target);
		} else {
			target = ancestors[index].target;
		}

		if (!target) {
			return;
		}

		observer.observe(target);
	});

	return children || <></>;
};
