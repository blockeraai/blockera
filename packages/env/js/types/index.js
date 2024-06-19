// @flow

export type EnvConfig = { path: string };

export type ExperimentalType = {
	...Object,
	get: (supportQuery: string) => any,
};
