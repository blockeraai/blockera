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
}

export type VariablesType = Array<VariableType>;
