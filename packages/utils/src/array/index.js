export const arraySortItems = ({
	args,
	toIndex,
	fromIndex,
}: Object): Array<any> => {
	const newArr = [...args];
	const [removed] = newArr.splice(fromIndex, 1);
	newArr.splice(toIndex, 0, removed);

	return newArr;
};

export const toObject = (arr: Array): Object => {
	return arr.reduce((acc, cur) => Object.assign(acc, cur), {});
};
