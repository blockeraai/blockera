export type AddVariableModalConfig = {
	headerTitle: string;
	description?: string;
	duplicateSlugMessage?: string;
	controlNamePrefix?: string;
};

export interface VariableType {
	/**
	 * The variable slug value.
	 *
	 * @default empty
	 */
	slug: string;
	/**
	 * The variable name value.
	 *
	 * @default empty
	 */
	name: string;
	/**
	 * While true (new preset, before first close), name and ID stay linked in the editor.
	 */
	creatingStep?: boolean;
	/**
	 * Set by the repeater when the preset list is selectable (e.g. variable picker).
	 */
	selectable?: boolean;
	/**
	 * Optional theme.json preset meta (e.g. `description`, taxonomy hints).
	 */
	meta?: Record<string, unknown>;
}

export type VariablesType = Array<VariableType>;
