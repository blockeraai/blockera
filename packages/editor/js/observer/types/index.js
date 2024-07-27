// @flow

export type IntersectionObserverProps = {
	callback: (...args: Array<any>) => any,
	options: IntersectionObserverOptions,
	target: string | HTMLElement,
};

export type Ancestors = Array<IntersectionObserverProps>;

export type ObserverProps = {
	ancestors: Ancestors,
};
