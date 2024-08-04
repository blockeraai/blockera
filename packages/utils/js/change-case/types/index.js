// @flow

export type SplitPrefixSuffixOptions = {
	locale?: ?string,
	delimiter?: string,
	separateNumbers?: boolean,
	prefixCharacters?: string,
	suffixCharacters?: string,
	split?: (string) => Array<string>,
	mergeAmbiguousCharacters?: boolean,
};
