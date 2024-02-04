// @flow

export const calcGridTemplateAreas = ({
	gridColumns,
	gridRows,
	gridAreas,
}: {
	gridColumns: Array<Object>,
	gridRows: Array<Object>,
	gridAreas: Array<Object>,
}): Array<Array> => {
	const gridTemplateAreas = ([]: any);
	for (let i = 0; i < gridRows?.value.length; i++) {
		gridTemplateAreas.push([]);
	}

	gridTemplateAreas?.forEach((row) => {
		gridColumns?.value.forEach(() => {
			row.push('.');
		});
	});

	gridAreas?.forEach((item) => {
		for (let row: any = item['row-start']; row < item['row-end']; row++) {
			for (
				let col: any = item['column-start'];
				col < item['column-end'];
				col++
			) {
				gridTemplateAreas[row - 1]?.splice(col - 1, 1, item.name);
			}
		}
	});

	return gridTemplateAreas;
};
