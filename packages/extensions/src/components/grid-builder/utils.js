// @flow

/**
 * External Dependencies
 */
import { nanoid } from 'nanoid';

export const resizeHandleClasses: {
	top: string,
	left: string,
	right: string,
	bottom: string,
	topLeft: string,
	topRight: string,
	bottomLeft: string,
	bottomRight: string,
} = {
	bottom: 'handle long-handle-horizontal bottom-handle',
	bottomLeft: 'handle left-handle bottom-handle',
	bottomRight: 'handle right-handle bottom-handle',
	left: 'handle long-handle left-handle',
	right: 'handle long-handle right-handle',
	top: 'handle long-handle-horizontal top-handle',
	topLeft: 'handle left-handle top-handle',
	topRight: 'handle right-handle top-handle',
};

export const extractCssValue = (property, generatedStyles) => {
	const propertyIndex = generatedStyles.search(property);
	const slicedProperty = generatedStyles.slice(propertyIndex);
	const colonIndex = slicedProperty.search(': ');
	const semicolonIndex = slicedProperty.search(';');
	const cssValue = slicedProperty.slice(colonIndex + 2, semicolonIndex);
	return cssValue;
};

export const generateAreas = ({ gridRows, gridColumns, prevGridAreas }) => {
	const newGridAreas = ([]: any);
	for (let i = 0; i < gridRows.length; i++) {
		newGridAreas.push([]);
	}

	let count = 1;
	newGridAreas?.forEach((row, i) => {
		gridColumns.forEach((item, index) => {
			row.push({
				id: nanoid(),
				name: `cell${count}`,
				'column-start': index + 1,
				'column-end': index + 2,
				'row-start': i + 1,
				'row-end': i + 2,
			});
			count++;
		});
	});

	const mergedAreas = prevGridAreas.filter((item) => item.mergedArea);
	if (!mergedAreas) return newGridAreas.flat();

	const redundantAreas = [];
	mergedAreas.forEach((item) => {
		for (let row = item['row-start']; row < item['row-end']; row++) {
			for (
				let col = item['column-start'];
				col < item['column-end'];
				col++
			) {
				redundantAreas.push(
					newGridAreas
						.flat()
						.find(
							(_item) =>
								_item['column-start'] === col &&
								_item['column-end'] === col + 1 &&
								_item['row-start'] === row &&
								_item['row-end'] === row + 1
						)
				);
			}
		}
	});

	const prevAreasTemplate = [];
	gridRows.forEach(() => prevAreasTemplate.push([]));
	prevGridAreas.forEach((item) => {
		prevAreasTemplate[item['row-start'] - 1].push(item);
	});

	const mergedAreasIndexes = [];
	prevAreasTemplate.forEach((row, i) => {
		row.forEach((col, index) => {
			if (col.mergedArea) mergedAreasIndexes.push([i, index]);
		});
	});

	const redundantAreaIds = redundantAreas.map((item) => item.id);
	const filteredGridAreas = newGridAreas.map((row) =>
		row.filter((col) => !redundantAreaIds.includes(col.id))
	);

	mergedAreasIndexes.forEach((item, index) => {
		filteredGridAreas[item[0]]?.splice(item[1], 0, mergedAreas[index]);
	});

	return filteredGridAreas.flat().map((item, i) => {
		return { ...item, name: `cell${i + 1}` };
	});
};
