// @flow

export type THandleOnChangeAttributes = (
	attributeId?: string,
	newValue?: any,
	// eslint-disable-next-line
	options:
		| Object
		| {
				updateItems?: Object,
				deleteItems?: Array<string>,
				addOrModifyRootItems?: Object,
				deleteItemsOnResetAction?: Array<string>,
		  }
) => void;
