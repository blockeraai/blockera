export type TaxonomyGroupDeclaration = {
	name: string;
	slug: string;
};

export type TaxonomyCategoryDeclaration = {
	name: string;
	slug: string;
	'show-preview'?: boolean;
};

export type TaxonomyDeclarations = {
	groups: TaxonomyGroupDeclaration[];
	categories: TaxonomyCategoryDeclaration[];
};

export type TaxonomySubSection<T> = {
	slug: string;
	name: string;
	showPreview: boolean;
	presets: T[];
};

export type TaxonomyCategoryBranch<T> = {
	slug: string;
	name: string;
	showPreview: boolean;
	directPresets: T[];
	subSections: TaxonomySubSection<T>[];
};

export type TaxonomyGroupBranch<T> = {
	slug: string;
	name: string;
	directPresets: T[];
	categories: TaxonomyCategoryBranch<T>[];
};
