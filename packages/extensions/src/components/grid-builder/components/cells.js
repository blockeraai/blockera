// @flow

/**
 * External dependencies
 */
import { useState } from '@wordpress/element';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { calcGridTemplateAreas } from '../../../libs/layout/utils';

/**
 * Internal dependencies
 */
import { useBlockContext } from '../../../hooks';
import { AreaMergeHandler } from './index';
import { generateAreas } from '../utils';

export const Cells = ({ hoveredColumn, hoveredRow }) => {
	const { getAttributes, handleOnChangeAttributes } = useBlockContext();

	const { publisherGridColumns, publisherGridRows, publisherGridAreas } =
		getAttributes();

	const [activeAreaId, setActiveAreaId] = useState(null);
	const [resizeToElementId, setResizeToElementId] = useState(null);

	const mergeArea = () => {
		const startElement = publisherGridAreas.find(
			(item) => item.id === activeAreaId
		);

		const resizeTo = publisherGridAreas.find(
			(item) => item.id === resizeToElementId
		);

		if (!resizeTo || !startElement || resizeTo.id === startElement.id)
			return null;

		const newArea = {
			id: nanoid(),
			name: startElement.name,
			'column-start': Math.min(
				startElement['column-start'],
				resizeTo['column-start']
			),
			'column-end': Math.max(
				startElement['column-end'],
				resizeTo['column-end']
			),
			'row-start': Math.min(
				startElement['row-start'],
				resizeTo['row-start']
			),
			'row-end': Math.max(startElement['row-end'], resizeTo['row-end']),
			mergedArea: true,
		};

		const deletedAreas = [];
		for (let row = newArea['row-start']; row < newArea['row-end']; row++) {
			for (
				let col = newArea['column-start'];
				col < newArea['column-end'];
				col++
			) {
				deletedAreas.push(
					publisherGridAreas.find(
						(item) =>
							item['column-start'] === col &&
							item['column-end'] === col + 1 &&
							item['row-start'] === row &&
							item['row-end'] === row + 1
					)
				);
			}
		}

		if (deletedAreas.some((item) => item?.mergedArea)) return null;

		const deletedAreasIds = deletedAreas
			.filter((item) => item)
			.map(({ id }) => id);

		const filteredAreas = publisherGridAreas.filter(
			(area) =>
				!deletedAreasIds.includes(area.id) &&
				area.id !== startElement.id &&
				area.id !== resizeTo.id
		);

		const mergedAreasCoordinates = [
			...deletedAreas,
			startElement,
			resizeTo,
		].map((item) => {
			return {
				column: `${item['column-start']}/${item['column-end']}`,
				row: `${item['row-start']}/${item['row-end']}`,
			};
		});

		const deletedAreaIndex = publisherGridAreas.findIndex(
			(item) =>
				deletedAreasIds.includes(item.id) ||
				item.id === startElement.id ||
				item.id === resizeTo.id
		);

		filteredAreas.splice(deletedAreaIndex, 0, {
			...newArea,
			coordinates: mergedAreasCoordinates,
		});

		handleOnChangeAttributes(
			'publisherGridAreas',
			generateAreas({
				gridRows: publisherGridRows.value,
				gridColumns: publisherGridColumns.value,
				prevGridAreas: [...filteredAreas],
			}),
			{
				path: '',
				reset: false,
				action: 'normal',
			}
		);
	};
	const gridTemplateArea = calcGridTemplateAreas({
		gridColumns: publisherGridColumns,
		gridRows: publisherGridRows,
		gridAreas: publisherGridAreas,
	});

	return publisherGridAreas?.map(
		(item) =>
			gridTemplateArea.flat().includes(item.name) && (
				<div
					className={`cell ${
						(`${item['column-start']}/${item['column-end']}` ===
							hoveredColumn ||
							`${item['row-start']}/${item['row-end']}` ===
								hoveredRow) &&
						'hovered'
					}`}
					key={item.id}
					onClick={() => setActiveAreaId(item.id)}
					style={{
						gridColumn: `${item['column-start']}/${item['column-end']}`,
						gridRow: `${item['row-start']}/${item['row-end']}`,
						gridArea: item.name,
					}}
					data-id={item.id}
				>
					<p style={{ pointerEvents: 'none' }}>
						{item.name?.replace(/[^-\.0-9]/g, '')}
					</p>
					{/* <span style={{ fontSize: '15px' }}>{item?.subText}</span> */}
					{activeAreaId === item.id && (
						<AreaMergeHandler
							setResizeToElementId={setResizeToElementId}
							activeAreaId={activeAreaId}
							id={item.id}
							mergeArea={mergeArea}
							resizeToElementId={resizeToElementId}
						/>
					)}
				</div>
			)
	);
};
