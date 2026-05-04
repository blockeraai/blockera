/**
 * Main color preset row shape (Site Editor / theme.json).
 */
export type DefaultColorPresetValue = {
	slug: string;
	deletable: boolean;
	cloneable: boolean;
	visibilitySupport: boolean;
	color: string;
	type?: string;
};
