// @flow

export type TFeature = {
	name: string,
	boot: (props: {
		name: string,
		clientId: string,
		blockRefId: { current: HTMLElement },
		attributes: Object,
	}) => void,
	isEnabled: () => boolean,
};
