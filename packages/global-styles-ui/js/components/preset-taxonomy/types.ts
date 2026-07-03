export type TaxonomyGroupChildRef =
	{ kind: 'preset'; slug: string } | { kind: 'category'; slug: string };

export type TaxonomyCategoryChildRef =
	{ kind: 'preset'; slug: string } | { kind: 'sub'; slug: string };

export type TaxonomySubSection<T> = {
	slug: string;
	name: string;
	showPreview: boolean;
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
	/** Palette walk order of direct presets vs sub-section accordions. */
	childOrder: TaxonomyCategoryChildRef[];
};

export type TaxonomyGroupBranch<T> = {
	slug: string;
	name: string;
	directPresets: T[];
	categories: TaxonomyCategoryBranch<T>[];
	/** Palette walk order of direct presets vs category accordions. */
	childOrder: TaxonomyGroupChildRef[];
};
