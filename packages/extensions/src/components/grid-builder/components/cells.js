// @flow

/**
 * Publisher dependencies
 */
import { calcGridTemplateAreas } from '../../../libs/layout/utils';

/**
 * Internal dependencies
 */
import { useBlockContext } from '../../../hooks';
import { AreaMergeHandler } from './index';
import {
	generateAreas,
	calcCoordinates,
	calcOverlapAreas,
	updateArrayCoordinates,
	calcReMergedAreas,
	uId,
} from '../utils';

export const Cells = ({
	hoveredColumn,
	hoveredRow,
	virtualMergedAreas,
	setVirtualMergedAreas,
	setVirtualTargetAreaId,
	virtualTargetAreaId,
	activeAreaId,
	setActiveAreaId,
	targetAreaId,
	setTargetAreaId,
	createVirtualAreas,
	newMergedArea,
	setNewMergedArea,
}) => {
	const { getAttributes, handleOnChangeAttributes } = useBlockContext();

	const { publisherGridColumns, publisherGridRows, publisherGridAreas } =
		getAttributes();

	const activeArea = publisherGridAreas.find(
		(item) => item.id === activeAreaId
	);

	const targetArea = publisherGridAreas.find(
		(item) => item.id === targetAreaId
	);

	const virtualTargetArea = virtualMergedAreas.find(
		(item) => item.id === virtualTargetAreaId
	);
	const highlightHandler = (direction) => {
		if (!virtualTargetArea && (!targetArea || !activeArea)) return null;

		switch (direction) {
			case 'bottomRight':
				{
					const updatedArea = {
						...activeArea,
						'row-end': virtualTargetArea
							? virtualTargetArea['row-end']
							: targetArea['row-end'],
						'column-end': virtualTargetArea
							? virtualTargetArea['column-end']
							: targetArea['column-end'],
					};

					setNewMergedArea(updatedArea);
				}
				break;
			case 'bottomLeft':
				{
					const updatedArea = {
						...activeArea,
						'row-end': virtualTargetArea
							? virtualTargetArea['row-end']
							: targetArea['row-end'],
						'column-start': virtualTargetArea
							? virtualTargetArea['column-start']
							: targetArea['column-start'],
					};

					setNewMergedArea(updatedArea);
				}
				break;
			case 'topRight':
				{
					const updatedArea = {
						...activeArea,
						'row-start': virtualTargetArea
							? virtualTargetArea['row-start']
							: targetArea['row-start'],
						'column-end': virtualTargetArea
							? virtualTargetArea['column-end']
							: targetArea['column-end'],
					};

					setNewMergedArea(updatedArea);
				}
				break;
			case 'topLeft': {
				const updatedArea = {
					...activeArea,
					'row-start': virtualTargetArea
						? virtualTargetArea['row-start']
						: targetArea['row-start'],
					'column-start': virtualTargetArea
						? virtualTargetArea['column-start']
						: targetArea['column-start'],
				};

				setNewMergedArea(updatedArea);
			}
		}
	};

	const mergeArea = (direction) => {
		if (
			activeAreaId !== virtualTargetArea?.parentId &&
			(!newMergedArea ||
				!targetArea ||
				!activeArea ||
				targetArea.id === activeArea.id)
		) {
			setVirtualMergedAreas([]);
			setActiveAreaId(null);
			setTargetAreaId(null);
			setNewMergedArea(null);
			return null;
		}

		if (virtualTargetArea && activeAreaId === virtualTargetArea.parentId) {
			switch (direction) {
				case 'bottomRight': {
					// unMerge itself

					if (
						activeArea['row-end'] === newMergedArea['row-end'] &&
						activeArea['column-end'] === newMergedArea['column-end']
					)
						return;

					const filteredAreas = publisherGridAreas.filter(
						(item) => item.id !== activeAreaId
					);

					handleOnChangeAttributes(
						'publisherGridAreas',
						generateAreas({
							gridRows: publisherGridRows.value,
							gridColumns: publisherGridColumns.value,
							prevGridAreas: [
								...filteredAreas,
								{
									...newMergedArea,
									coordinates: calcCoordinates(newMergedArea),
								},
							],
						}),
						{
							path: '',
							reset: false,
							action: 'normal',
						}
					);

					setVirtualMergedAreas([]);
					setActiveAreaId(null);
					setTargetAreaId(null);
					setNewMergedArea(null);
					return;
				}

				case 'bottomLeft': {
					// unMerge itself

					if (
						activeArea['row-end'] === newMergedArea['row-end'] &&
						activeArea['column-start'] ===
							newMergedArea['column-start']
					)
						return;

					const filteredAreas = publisherGridAreas.filter(
						(item) => item.id !== activeAreaId
					);

					handleOnChangeAttributes(
						'publisherGridAreas',
						generateAreas({
							gridRows: publisherGridRows.value,
							gridColumns: publisherGridColumns.value,
							prevGridAreas: [
								...filteredAreas,
								{
									...newMergedArea,
									coordinates: calcCoordinates(newMergedArea),
								},
							],
						}),
						{
							path: '',
							reset: false,
							action: 'normal',
						}
					);

					setVirtualMergedAreas([]);
					setActiveAreaId(null);
					setTargetAreaId(null);
					setNewMergedArea(null);
					return;
				}

				case 'topRight': {
					// unMerge itself

					if (
						activeArea['row-start'] ===
							newMergedArea['row-start'] &&
						activeArea['column-end'] === newMergedArea['column-end']
					)
						return;

					const filteredAreas = publisherGridAreas.filter(
						(item) => item.id !== activeAreaId
					);

					handleOnChangeAttributes(
						'publisherGridAreas',
						generateAreas({
							gridRows: publisherGridRows.value,
							gridColumns: publisherGridColumns.value,
							prevGridAreas: [
								...filteredAreas,
								{
									...newMergedArea,
									coordinates: calcCoordinates(newMergedArea),
								},
							],
						}),
						{
							path: '',
							reset: false,
							action: 'normal',
						}
					);

					setVirtualMergedAreas([]);
					setActiveAreaId(null);
					setTargetAreaId(null);
					setNewMergedArea(null);
					return;
				}

				case 'topLeft': {
					// unMerge itself

					if (
						activeArea['row-start'] ===
							newMergedArea['row-start'] &&
						activeArea['column-start'] ===
							newMergedArea['column-start']
					)
						return;

					const filteredAreas = publisherGridAreas.filter(
						(item) => item.id !== activeAreaId
					);

					handleOnChangeAttributes(
						'publisherGridAreas',
						generateAreas({
							gridRows: publisherGridRows.value,
							gridColumns: publisherGridColumns.value,
							prevGridAreas: [
								...filteredAreas,
								{
									...newMergedArea,
									coordinates: calcCoordinates(newMergedArea),
								},
							],
						}),
						{
							path: '',
							reset: false,
							action: 'normal',
						}
					);

					setVirtualMergedAreas([]);
					setActiveAreaId(null);
					setTargetAreaId(null);
					setNewMergedArea(null);
					return;
				}
			}
		}

		if (
			newMergedArea &&
			(virtualTargetArea ||
				activeArea.mergedArea ||
				targetArea.mergedArea)
		) {
			const updatedNewMergedArea = {
				...newMergedArea,
				coordinates: calcCoordinates(newMergedArea),
			};

			const overlapAreas = calcOverlapAreas({
				newArea: updatedNewMergedArea,
				publisherGridAreas,
				targetAreaId,
			});

			if (!virtualTargetArea) {
				overlapAreas.push(targetArea);
			}

			//////////

			const newMergedAreas = overlapAreas.map((item) => {
				return calcReMergedAreas(item, updatedNewMergedArea);
			});

			const overlapAreasIds = overlapAreas.map((item) => item?.id);

			const filteredAreas = publisherGridAreas.filter(
				(item) =>
					!overlapAreasIds.includes(item.id) &&
					item.id !== activeArea.id &&
					(item.id !== virtualTargetArea?.parentId ||
						item.id !== targetAreaId)
			);

			handleOnChangeAttributes(
				'publisherGridAreas',
				generateAreas({
					gridRows: publisherGridRows.value,
					gridColumns: publisherGridColumns.value,
					prevGridAreas: [
						...filteredAreas,
						{
							...updatedNewMergedArea,
							mergedArea:
								updatedNewMergedArea?.coordinates?.length <= 1
									? false
									: true,
						},
						...updateArrayCoordinates(newMergedAreas.flat()),
					],
				}),
				{
					path: '',
					reset: false,
					action: 'normal',
				}
			);

			setVirtualMergedAreas([]);
			setActiveAreaId(null);
			setTargetAreaId(null);
			setNewMergedArea(null);

			return;
		}

		const newArea = {
			id: uId(),
			name: activeArea.name,
			'column-start': Math.min(
				activeArea['column-start'],
				targetArea['column-start']
			),
			'column-end': Math.max(
				activeArea['column-end'],
				targetArea['column-end']
			),
			'row-start': Math.min(
				activeArea['row-start'],
				targetArea['row-start']
			),
			'row-end': Math.max(activeArea['row-end'], targetArea['row-end']),
			mergedArea: true,
			coordinates: [],
		};

		newArea.coordinates = calcCoordinates(newArea);

		const overlapAreas = calcOverlapAreas({
			newArea,
			publisherGridAreas,
			targetAreaId,
		});

		const updatedOverlapAreas = overlapAreas?.map((item) => {
			return calcReMergedAreas(item, newMergedArea);
		});

		const overlapAreasIds = updatedOverlapAreas.map((item) => item?.id);
		const filteredAreas = publisherGridAreas.filter(
			(item) => !overlapAreasIds.includes(item.id)
		);

		handleOnChangeAttributes(
			'publisherGridAreas',
			generateAreas({
				gridRows: publisherGridRows.value,
				gridColumns: publisherGridColumns.value,
				prevGridAreas: [
					...filteredAreas,
					newArea,
					...updateArrayCoordinates(updatedOverlapAreas.flat()),
				],
			}),
			{
				path: '',
				reset: false,
				action: 'normal',
			}
		);

		setActiveAreaId(null);
		setTargetAreaId(null);
		setVirtualMergedAreas([]);
		setNewMergedArea(null);
	};

	const gridTemplateArea = calcGridTemplateAreas({
		gridColumns: publisherGridColumns,
		gridRows: publisherGridRows,
		gridAreas: publisherGridAreas,
	});

	return publisherGridAreas?.map((item) => {
		const isHighlighted = calcCoordinates(newMergedArea)?.find(
			(coord) =>
				coord['column-start'] === item['column-start'] &&
				coord['column-end'] === item['column-end'] &&
				coord['row-start'] === item['row-start'] &&
				coord['row-end'] === item['row-end']
		);
		return (
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
						//gridArea: item.name,
						position: 'relative',
						backgroundColor: isHighlighted
							? 'rgba(20, 126, 184, 0.7)'
							: 'rgba(20, 126, 184, 0.1)',
						minHeight: '50px',
					}}
					data-id={item.id}
				>
					<p style={{ pointerEvents: 'none' }}>{item.name}</p>

					{activeAreaId === item.id && (
						<AreaMergeHandler
							setTargetAreaId={setTargetAreaId}
							activeAreaId={activeAreaId}
							id={item.id}
							mergeArea={mergeArea}
							setVirtualMergedAreas={setVirtualMergedAreas}
							setVirtualTargetAreaId={setVirtualTargetAreaId}
							createVirtualAreas={createVirtualAreas}
							highlightHandler={highlightHandler}
						/>
					)}
				</div>
			)
		);
	});
};
