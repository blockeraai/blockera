// @flow

/**
 * Publisher Dependencies
 */
import { calcGridTemplateAreas } from '../../libs/layout/utils';

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

export const extractCssValue = (
	property: string,
	generatedStyles: string
): string => {
	const propertyIndex = generatedStyles.search(property);
	const slicedProperty = generatedStyles.slice(propertyIndex);
	const colonIndex = slicedProperty.search(': ');
	const semicolonIndex = slicedProperty.search(';');
	const cssValue = slicedProperty.slice(colonIndex + 2, semicolonIndex);
	return cssValue;
};

export const generateAreas = ({
	gridRows,
	gridColumns,
	prevGridAreas,
	publisherGridDirection,
}: {
	gridRows: Array<Object>,
	gridColumns: Array<Object>,
	prevGridAreas: Array<Object>,
}): Array<Object> => {
	const newGridAreas = ([]: any);
	for (let i = 0; i < gridRows.length; i++) {
		newGridAreas.push([]);
	}

	let count = 1;
	newGridAreas?.forEach((row, i) => {
		gridColumns.forEach((item, index) => {
			row.push({
				id: uId(),
				name: `area${count}`,
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
		item.coordinates.forEach((coord) => {
			redundantAreas.push(
				newGridAreas
					.flat()
					.find(
						(_item) =>
							_item['column-start'] === coord['column-start'] &&
							_item['column-end'] === coord['column-end'] &&
							_item['row-start'] === coord['row-start'] &&
							_item['row-end'] === coord['row-end']
					)
			);
		});
	});

	const redundantAreaIds = redundantAreas.map((item) => item.id);
	const filteredGridAreas = newGridAreas
		.flat()
		.filter((item) => !redundantAreaIds.includes(item.id));

	filteredGridAreas.push(mergedAreas);

	// re order
	const renamedFilteredAreas = filteredGridAreas.flat().map((item, i) => {
		return { ...item, name: `area${i + 1}` };
	});

	const gridTemplateAreas = calcGridTemplateAreas({
		gridRows: { value: gridRows },
		gridColumns: { value: gridColumns },
		gridAreas: renamedFilteredAreas,
	});

	const reOrderedAreaArray = [];

	gridTemplateAreas.flat().forEach((item) => {
		// find area and push to array based on real place
		const matchedArea = filteredGridAreas
			.flat()
			.map((_item, i) => {
				return {
					..._item,
					name: `area${i + 1}`,
					mergedArea: _item?.coordinates?.length > 1 ? true : false,
				};
			})
			.find((_item) => _item.name === item);

		reOrderedAreaArray.push(matchedArea);
	});

	if (publisherGridDirection.value === 'column') {
		const reOrderedAreaArray = [];
		const gridVerticalTemplate = [];

		for (let i = 0; i <= gridColumns.length; i++) {
			gridTemplateAreas.forEach((item) =>
				gridVerticalTemplate.push(item[i])
			);
		}

		gridVerticalTemplate.forEach((item) => {
			// find area and push to array based on real place

			const matchedArea = filteredGridAreas
				.flat()
				.map((_item, i) => {
					return {
						..._item,
						name: `area${i + 1}`,
						mergedArea:
							_item?.coordinates?.length > 1 ? true : false,
					};
				})
				.find((_item) => _item.name === item);
			reOrderedAreaArray.push(matchedArea);
		});

		return getUniqueArrayOfObjects(reOrderedAreaArray).map((item, i) => {
			return { ...item, name: `area${i + 1}` };
		});
	}

	return getUniqueArrayOfObjects(reOrderedAreaArray).map((item, i) => {
		return { ...item, name: `area${i + 1}` };
	});
};

export const getUniqueArrayOfObjects = (arr: Array<Object>): Array<Object> => {
	const uniqueIds = [...new Set(arr.map((item) => item?.id))];

	const uniqueArr = [];
	for (let i = 0; i <= uniqueIds.length; i++) {
		uniqueArr.push(arr.find((item) => item?.id === uniqueIds[i]));
	}

	return uniqueArr.filter((item) => item);
};

export const calcCoordinates = (area: Object | null): Array<Object> => {
	if (!area) return [];
	const coordinates = [];

	for (let col = area['column-start']; col < area['column-end']; col++) {
		for (let row = area['row-start']; row < area['row-end']; row++) {
			coordinates.push({
				id: uId(),
				parentId: area.id,
				'column-start': col,
				'column-end': col + 1,
				'row-start': row,
				'row-end': row + 1,
			});
		}
	}

	return coordinates;
};

export const calcOverlapAreas = ({
	newArea,
	publisherGridAreas,
}: {
	newArea: Object | null,
	publisherGridAreas: Array<Object>,
}): Array<Object> => {
	if (!newArea) return [];

	// make string to compare easily
	const newAreaCoordinates = newArea?.coordinates?.map(
		(coord) =>
			`${coord['column-start']}/${coord['column-end']}/${coord['row-start']}/${coord['row-end']}`
	);

	if (!newAreaCoordinates.length) return [];

	const overlapAreas = publisherGridAreas.filter((item) => {
		if (item.id === newArea.id) return null;

		return (
			item.mergedArea &&
			item.coordinates.find((_item) =>
				newAreaCoordinates.includes(
					`${_item['column-start']}/${_item['column-end']}/${_item['row-start']}/${_item['row-end']}`
				)
			)
		);
	});

	return overlapAreas;
};

export const updateArrayCoordinates = (array: Array<Object>): Array<Object> => {
	return array
		.map((item) => {
			if (!item) return null;
			const coordinates = calcCoordinates(item);
			return {
				...item,
				coordinates,
				mergedArea: coordinates.length <= 1 ? false : true,
			};
		})
		.filter((item) => item);
};

export const calcReMergedAreas = (item: Object, updatedArea: Object): any => {
	//calculate affected merged areas based on new merged area
	if (!updatedArea) return null;

	if (
		item['column-start'] >= updatedArea['column-start'] &&
		item['column-end'] > updatedArea['column-end']
	) {
		item['column-start'] = updatedArea['column-end'];
	} else if (
		item['column-start'] < updatedArea['column-start'] &&
		item['column-end'] <= updatedArea['column-end']
	) {
		item['column-end'] = updatedArea['column-start'];
	} else if (
		item['row-start'] >= updatedArea['row-start'] &&
		item['row-end'] > updatedArea['row-end']
	) {
		item['row-start'] = updatedArea['row-end'];
	} else if (
		item['row-start'] < updatedArea['row-start'] &&
		item['row-end'] <= updatedArea['row-end']
	) {
		item['row-end'] = updatedArea['row-start'];
	} else if (
		item['column-start'] < updatedArea['column-start'] &&
		item['column-end'] > updatedArea['column-end']
	) {
		return [
			{
				...item,
				'column-start': item['column-start'],
				'column-end': updatedArea['column-start'],
				id: uId(),
			},
			{
				...item,
				'column-start': updatedArea['column-end'],
				'column-end': item['column-end'],
				id: uId(),
			},
		];
	} else if (
		item['row-start'] < updatedArea['row-start'] &&
		item['row-end'] > updatedArea['row-end']
	) {
		return [
			{
				...item,
				'row-start': item['row-start'],
				'row-end': updatedArea['row-start'],
				id: uId(),
			},
			{
				...item,
				'row-start': updatedArea['row-end'],
				'row-end': item['row-end'],
				id: uId(),
			},
		];
	} else if (
		item['row-start'] >= updatedArea['row-start'] &&
		item['row-end'] <= updatedArea['row-end'] &&
		item['column-start'] >= updatedArea['column-start'] &&
		item['column-end'] <= updatedArea['column-end']
	) {
		return null;
	} else if (
		item['row-end'] === updatedArea['row-end'] &&
		item['column-end'] === updatedArea['column-end']
	) {
		return null;
	}
	return item;
};

export const uId = (): number =>
	new Date().getMilliseconds() + Number(Math.random().toFixed(6));
