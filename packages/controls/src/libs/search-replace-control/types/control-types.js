// @flow

export type TItem = {
	search: string,
	replace: string,
	isVisible: boolean,
};

export type TSearchReplaceControlProps = {
	id?: string,
	defaultValue?: [],
	onChange?: () => {},
	defaultRepeaterItemValue?: TItem,
	popoverTitle?: string,
	className?: string,
};
