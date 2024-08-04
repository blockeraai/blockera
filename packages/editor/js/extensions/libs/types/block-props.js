// @flow

export type TBlockProps = {
	clientId: string,
	supports: Object,
	blockName: string,
	attributes: Object,
	setAttributes: (attributes: Object) => void,
};
