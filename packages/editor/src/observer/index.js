// @flow

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

export const Observer = ({ ancestors }: ObserverProps) => {
	const observers = useObservers(ancestors);

	observers.forEach((observer: IntersectionObserver, index: number): void => {
		const target = document.querySelector(ancestors[index].target);

		if (!target) {
			return;
		}

		observer.observe(target);
	});
};
