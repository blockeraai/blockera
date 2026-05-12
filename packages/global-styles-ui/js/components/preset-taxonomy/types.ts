export type TaxonomyGroupDeclaration = {
	name: string;
	slug: string;
};

export type TaxonomyCategoryDeclaration = {
	name: string;
	slug: string;
	'show-preview'?: boolean;
	/** When set, first paint matches accordion open state (`initial-open` in theme JSON). */
	'initial-open'?: boolean;
};

export type TaxonomyDeclarations = {
	groups: TaxonomyGroupDeclaration[];
	categories: TaxonomyCategoryDeclaration[];
};

export type TaxonomySubSection<T> = {
	slug: string;
	name: string;
	showPreview: boolean;
	/** From matching `categories[]` row when sub slug equals category slug; drives accordion default open. */
	initialOpen?: boolean;
	presets: T[];
};

export type TaxonomyCategoryBranch<T> = {
	slug: string;
	name: string;
	showPreview: boolean;
	initialOpen?: boolean;
	directPresets: T[];
	subSections: TaxonomySubSection<T>[];
};

export type TaxonomyGroupBranch<T> = {
	slug: string;
	name: string;
	directPresets: T[];
	categories: TaxonomyCategoryBranch<T>[];
};
