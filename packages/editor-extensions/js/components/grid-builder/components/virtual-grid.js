// @flow

/**
 * External dependencies
 */
import { useState, useEffect, useCallback, useMemo } from '@wordpress/element';
import type { MixedElement } from 'react';
/**
 * Blockera dependencies
 */
import { LayoutStyles } from '../../../libs/layout';
import type { TBlockProps } from '../../../libs/types';

/**
 * Internal dependencies
 */
import {
	extractCssValue,
	generateAreas,
	calcOverlapAreas,
	calcCoordinates,
	getUniqueArrayOfObjects,
	uId,
} from '../utils';
import { useBlockContext, useStoreSelectors } from '../../../hooks';
import { AddButton, GridSizeHandler, Cells, GapHandler } from './index';

export const VirtualGrid = ({
	block,
	extensionProps,
}: {
	block: TBlockProps,
	extensionProps: Object,
}): MixedElement => {
	const {
		handleOnChangeAttributes,
		getAttributes,
		currentBlock,
		getCurrentState,
	} = useBlockContext();
	const attributes = getAttributes();

	const {
		blockeraGridColumns,
		blockeraGridRows,
		blockeraGridGap,
		blockeraGridAreas,
		blockeraGridDirection,
	} = attributes;

 	const {
		blockEditor: { getSelectedBlock },
	} = useStoreSelectors();
	const { clientId } = getSelectedBlock() || {};

	useEffect(() => {
		if (!blockeraGridAreas.length) {
			handleOnChangeAttributes(
				'blockeraGridAreas',
				generateAreas({
					gridRows: blockeraGridRows.value,
					gridColumns: blockeraGridColumns.value,
					prevGridAreas: blockeraGridAreas,
					blockeraGridDirection,
				}),
				{
					path: '',
					reset: false,
					action: 'normal',
				}
			);
		}
	}, []);

	const generatedStyles = useMemo(
		() =>
			LayoutStyles({
				state: getCurrentState(),
				clientId,
				blockName: block.blockName,
				currentBlock,
				selectors: {},
				attributes,
			})
				?.map((item) => item.declarations)
				.join(' '),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			blockeraGridColumns,
			blockeraGridRows,
			blockeraGridGap,
			blockeraGridAreas,
			blockeraGridDirection,
		]
	);

	const styles = useMemo(() => {
		return {
			// to have clean rows in grid builder : auto => 1fr
			gridTemplateRows: extractCssValue(
				'grid-template-rows',
				generatedStyles
			)
				.split(' ')
				.map((item) => (item === 'auto' ? '1fr' : item))
				.join(' '),

			gridTemplateColumns: extractCssValue(
				'grid-template-columns',
				generatedStyles
			),
			display: extractCssValue('display', generatedStyles),
			gap: blockeraGridGap.gap,
			columnGap: blockeraGridGap.columns,
			rowGap: blockeraGridGap.rows,
			gridDirection: extractCssValue('grid-auto-flow', generatedStyles),
			gridTemplateAreas: extractCssValue(
				'grid-template-areas',
				generatedStyles
			),
		};
	}, [generatedStyles]);

	const gridColumns = blockeraGridColumns.value;
	const gridRows = blockeraGridRows.value;

	const [hoveredColumn, setHoveredColumn] = useState(null);
	const [hoveredRow, setHoveredRow] = useState(null);

	const gapHandlers = useMemo(() => {
		const rowsArray = styles.gridTemplateRows.split(' ');
		rowsArray.forEach((item, i) => {
			if (item.includes('minmax')) {
				rowsArray.splice(i, 2, `${rowsArray[i]} ${rowsArray[i + 1]}`);
			}
		});

		const gapRowHandler = rowsArray
			.map((item, i, arr) => {
				if (i + 1 < arr.length)
					return `${item} ${styles.rowGap || styles.gap || '20px'}`;

				return item;
			})
			.join(' ');

		const columnsArray = styles.gridTemplateColumns.split(' ');
		columnsArray.forEach((item, i) => {
			if (item.includes('minmax')) {
				columnsArray.splice(
					i,
					2,
					`${columnsArray[i]} ${columnsArray[i + 1]}`
				);
			}
		});

		const gapColumnHandler = columnsArray
			.map((item, i, arr) => {
				if (i + 1 < arr.length)
					return `${item} ${
						styles.columnGap || styles.gap || '20px'
					}`;

				return item;
			})
			.join(' ');

		return {
			gapRowHandler,
			gapColumnHandler,
		};
	}, [styles.gridTemplateRows, styles.gridTemplateColumns]);

	const [virtualMergedAreas, setVirtualMergedAreas] = useState([]);
	const [activeAreaId, setActiveAreaId] = useState(null);
	const [targetAreaId, setTargetAreaId] = useState(null);
	const [virtualTargetAreaId, setVirtualTargetAreaId] = useState(null);
	const [newMergedArea, setNewMergedArea] = useState(null);

	const highlightedAreas = calcCoordinates(newMergedArea);

	const createVirtualAreas = useCallback(() => {
		const virtualMergedAreas = ([]: any);
		blockeraGridAreas.forEach((item) => {
			if (item.mergedArea) {
				virtualMergedAreas.push(...item.coordinates);
			}
		});

		setVirtualMergedAreas(getUniqueArrayOfObjects(virtualMergedAreas));
	}, [blockeraGridAreas]);

	useEffect(() => {
		createVirtualAreas();
	}, [hoveredColumn, hoveredRow]);

	const overlapAreas = calcOverlapAreas({
		newArea: {
			...newMergedArea,
			coordinates: calcCoordinates(newMergedArea),
		},
		blockeraGridAreas,
	});

	return (
		<div
			style={{
				width: '100%',
				display: 'grid',
				gridTemplateRows: `26px ${styles.gridTemplateRows}`,
				gridTemplateColumns: `26px ${styles.gridTemplateColumns}`,
				position: 'absolute',
				gap:
					(!styles.columnGap || !styles.rowGap || !styles.gap) &&
					'10px',
				zIndex: 2000,
			}}
		>
			<div
				style={{
					display: 'grid',
					gridColumn: '2/-1',
					gridRow: '1/2',
					gridTemplateRows: '26px',
					gridTemplateColumns: styles.gridTemplateColumns,
					columnGap: styles.columnGap || styles.gap || '20px',
					marginTop: !styles.rowGap || !styles.gap || '-10px',
				}}
			>
				{blockeraGridColumns.value.map((item, index) => (
					<GridSizeHandler
						key={item.id}
						item={item}
						type="column"
						index={index}
						attribute={blockeraGridColumns}
						setHovered={setHoveredColumn}
						block={block}
						attributeId="blockeraGridColumns"
						hovered={hoveredColumn}
						extensionProps={extensionProps}
					/>
				))}
			</div>

			<div
				style={{
					display: 'grid',
					gridColumn: '1/2',
					gridRow: '2/-1',
					gridTemplateColumns: '26px',
					gridTemplateRows: styles.gridTemplateRows,
					rowGap: styles.rowGap || styles.gap || '20px',
					marginLeft: !styles.columnGap || !styles.gap || '-10px',
				}}
			>
				{blockeraGridRows.value.map((item, index) => (
					<GridSizeHandler
						key={item.id}
						type="row"
						item={item}
						index={index}
						attribute={blockeraGridRows}
						setHovered={setHoveredRow}
						block={block}
						attributeId="blockeraGridRows"
						hovered={hoveredRow}
						extensionProps={extensionProps}
					/>
				))}
			</div>

			<AddButton
				type="row"
				gridTemplate={gridRows}
				onClick={() => {
					const newValue = [
						...blockeraGridRows.value,
						{
							'sizing-mode': 'normal',
							size: 'auto',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
							id: uId(),
						},
					];

					handleOnChangeAttributes(
						'blockeraGridRows',
						{
							length: blockeraGridRows.length + 1,
							value: newValue,
						},
						{
							effectiveItems: {
								blockeraGridAreas: generateAreas({
									gridRows: newValue,
									gridColumns: blockeraGridColumns.value,
									prevGridAreas: blockeraGridAreas,
									blockeraGridDirection,
								}),
							},
							ref: {
								path: '',
								reset: false,
								action: 'normal',
							},
						}
					);
				}}
				columnGap={styles.columnGap}
				rowGap={styles.rowGap}
			/>

			<AddButton
				type="column"
				gridTemplate={gridColumns}
				onClick={() => {
					const newValue = [
						...blockeraGridColumns.value,
						{
							'sizing-mode': 'normal',
							size: '1fr',
							'min-size': '',
							'max-size': '',
							'auto-fit': false,
							id: uId(),
						},
					];
					handleOnChangeAttributes(
						'blockeraGridColumns',
						{
							length: blockeraGridColumns.length + 1,
							value: newValue,
						},
						{
							effectiveItems: {
								blockeraGridAreas: generateAreas({
									gridColumns: newValue,
									gridRows: blockeraGridRows.value,
									prevGridAreas: blockeraGridAreas,
									blockeraGridDirection,
								}),
							},
							ref: {
								path: '',
								reset: false,
								action: 'normal',
							},
						}
					);
				}}
				columnGap={styles.columnGap}
				rowGap={styles.rowGap}
			/>

			<div
				className="content-wrapper"
				style={{
					gridTemplateRows: styles.gridTemplateRows,
					gridTemplateColumns: styles.gridTemplateColumns,
					gap:
						styles.columnGap && styles.rowGap
							? `${styles.rowGap} ${styles.columnGap}`
							: styles.gap || '20px',
					gridAutoFlow: styles.gridDirection,
					gridTemplateAreas: styles.gridTemplateAreas,
				}}
			>
				<div
					className="gap-handlers-wrapper"
					style={{
						gridTemplateRows: gapHandlers.gapRowHandler,
						gridTemplateColumns: gapHandlers.gapColumnHandler,
					}}
				>
					{gridColumns.map((item, i) => {
						if (i + 1 < gridColumns.length)
							return (
								<GapHandler
									type="column"
									key={item.id}
									style={{
										gridColumn: `${i * 2 + 2}/${i * 2 + 3}`,
										gridRow: '1/-1',
										width: styles.columnGap || styles.gap,
										minWidth: '1px',
										cursor: 'e-resize',
									}}
									styles={styles}
								/>
							);

						return null;
					})}

					{gridRows.map((item, i) => {
						if (i + 1 < gridRows.length)
							return (
								<GapHandler
									type="row"
									key={item.id}
									style={{
										gridRow: `${i * 2 + 2}/${i * 2 + 3}`,
										gridColumn: '1/-1',
										height: styles.rowGap || styles.gap,
										minHeight: '1px',
										cursor: 'n-resize',
									}}
									styles={styles}
								/>
							);

						return null;
					})}
				</div>

				<Cells
					hoveredColumn={hoveredColumn}
					hoveredRow={hoveredRow}
					setVirtualMergedAreas={setVirtualMergedAreas}
					virtualMergedAreas={virtualMergedAreas}
					virtualTargetAreaId={virtualTargetAreaId}
					setVirtualTargetAreaId={setVirtualTargetAreaId}
					activeAreaId={activeAreaId}
					setActiveAreaId={setActiveAreaId}
					targetAreaId={targetAreaId}
					setTargetAreaId={setTargetAreaId}
					newMergedArea={newMergedArea}
					setNewMergedArea={setNewMergedArea}
					createVirtualAreas={createVirtualAreas}
				/>

				{virtualMergedAreas.map((_item) => {
					if (
						_item.parentId === activeAreaId ||
						_item.parentId === targetAreaId ||
						hoveredColumn ===
							`${_item['column-start']}/${_item['column-end']}` ||
						hoveredRow ===
							`${_item['row-start']}/${_item['row-end']}` ||
						overlapAreas.find(
							(overlapItem) => _item.parentId === overlapItem.id
						)
					) {
						const isHighlighted =
							highlightedAreas.find(
								(item) =>
									item['column-start'] ===
										_item['column-start'] &&
									item['column-end'] ===
										_item['column-end'] &&
									item['row-start'] === _item['row-start'] &&
									item['row-end'] === _item['row-end']
							) ||
							overlapAreas?.find(
								(item) =>
									item['column-start'] ===
										_item['column-start'] &&
									item['column-end'] ===
										_item['column-end'] &&
									item['row-start'] === _item['row-start'] &&
									item['row-end'] === _item['row-end']
							);

						return (
							<div
								key={_item.id}
								data-virtual-id={_item.id}
								style={{
									gridColumn: `${_item['column-start']}/${_item['column-end']}`,
									gridRow: `${_item['row-start']}/${_item['row-end']}`,
									backgroundColor: isHighlighted
										? 'rgba(20, 126, 184, 0.7)'
										: 'rgba(20, 126, 184, 0.25)',
									width: '96%',
									height: '90%',
									display: 'inline-block',
									zIndex: '1999',
									justifySelf: 'center',
									alignSelf: 'center',
								}}
								data-test="virtual-area"
							/>
						);
					}

					return <></>;
				})}
			</div>
		</div>
	);
};
