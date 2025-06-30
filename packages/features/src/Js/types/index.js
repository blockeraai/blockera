// @flow

export type TBootFunctionProps = {
	name: string,
	clientId: string,
	blockRefId: { current: HTMLElement },
	attributes: Object,
};

export type TFeature = {
	name: string,
	boot: (props: TBootFunctionProps) => void,
	isEnabled: () => boolean,
};
