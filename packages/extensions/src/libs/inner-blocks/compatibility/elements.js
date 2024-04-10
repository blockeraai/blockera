// @flow

const link = [
	'core/paragraph',
	'core/heading',
	'core/list',
	'core/post-terms',
	'core/group',
];

const heading = ['core/quote'];

const button = ['core/group'];

export const elementsSupportedBlocks: Object = {
	link,
	heading,
	// button,
	h1: heading,
	h2: heading,
	h3: heading,
	h4: heading,
	h5: heading,
	h6: heading,
};
