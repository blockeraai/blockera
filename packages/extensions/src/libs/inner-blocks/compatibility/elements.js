// @flow

const link = ['core/paragraph', 'core/heading', 'core/list', 'core/post-terms'];

const heading = ['core/quote'];

export const elementsSupportedBlocks: Object = {
	link,
	heading,
	h1: heading,
	h2: heading,
	h3: heading,
	h4: heading,
	h5: heading,
	h6: heading,
};
