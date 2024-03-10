// @flow

/**
 * External dependencies
 */
import { useState, useEffect, useCallback, useMemo } from '@wordpress/element';
import type { MixedElement } from 'react';
/**
 * Publisher dependencies
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
}: {
	block: TBlockProps,
}): MixedElement => {
	const {
		handleOnChangeAttributes,
		getAttributes,
		currentBlock,
		getCurrentState,
	} = useBlockContext();
	const attributes = getAttributes();
	const {
		publisherGridColumns,
		publisherGridRows,
		publisherGridGap,
		publisherGridAreas,
		publisherGridDirection,
	} = attributes;

	const {
		blockEditor: { getSelectedBlock },
	} = useStoreSelectors();
	const { clientId } = getSelectedBlock() || {};

	const generatedStyles = useCallback(
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
		[
			publisherGridColumns,
			publisherGridRows,
			publisherGridGap,
			publisherGridAreas,
			publisherGridDirection,
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
			gap: publisherGridGap.gap,
			columnGap: publisherGridGap.columns,
			rowGap: publisherGridGap.rows,
			gridDirection: extractCssValue('grid-auto-flow', generatedStyles),
			gridTemplateAreas: extractCssValue(
				'grid-template-areas',
				generatedStyles
			),
		};
	}, [generatedStyles]);

	useEffect(() => {
		if (!publisherGridAreas.length) {
			handleOnChangeAttributes(
				'publisherGridAreas',
				generateAreas({
					gridRows: publisherGridRows.value,
					gridColumns: publisherGridColumns.value,
					prevGridAreas: publisherGridAreas,
					publisherGridDirection,
				}),
				{
					path: '',
					reset: false,
					action: 'normal',
				}
			);
		}
	}, []);

	const gridColumns = publisherGridColumns.value;
	const gridRows = publisherGridRows.value;

	const [hoveredColumn, setHoveredColumn] = useState(null);
	const [hoveredRow, setHoveredRow] = useState(null);

	const calcGapLayerTemplate = () => {
		const gapRowHandler = styles.gridTemplateRows
			.split(' ')
			.map((item, i, arr) => {
				if (i + 1 < arr.length)
					return `${item} ${styles.rowGap || styles.gap || '20px'}`;

				return item;
			})
			.join(' ');

		const gapColumnHandler = styles.gridTemplateColumns
			.split(' ')
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
	};

	const gapHandlers = calcGapLayerTemplate();
	const [virtualMergedAreas, setVirtualMergedAreas] = useState([]);
	const [activeAreaId, setActiveAreaId] = useState(null);
	const [targetAreaId, setTargetAreaId] = useState(null);
	const [virtualTargetAreaId, setVirtualTargetAreaId] = useState(null);
	const [newMergedArea, setNewMergedArea] = useState(null);

	const highlightedAreas = calcCoordinates(newMergedArea);

	const createVirtualAreas = useCallback(() => {
		const virtualMergedAreas = ([]: any);
		publisherGridAreas.forEach((item) => {
			if (item.mergedArea) {
				virtualMergedAreas.push(...item.coordinates);
			}
		});

		setVirtualMergedAreas(getUniqueArrayOfObjects(virtualMergedAreas));
	}, [publisherGridAreas]);

	useEffect(() => {
		createVirtualAreas();
	}, [hoveredColumn, hoveredRow]);

	const overlapAreas = calcOverlapAreas({
		newArea: {
			...newMergedArea,
			coordinates: calcCoordinates(newMergedArea),
		},
		publisherGridAreas,
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
				<GridSizeHandler
					type="column"
					attribute={publisherGridColumns}
					setHovered={setHoveredColumn}
					block={block}
					attributeId="publisherGridColumns"
					hovered={hoveredColumn}
					createVirtualAreas={createVirtualAreas}
				/>
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
				<GridSizeHandler
					type="row"
					attribute={publisherGridRows}
					setHovered={setHoveredRow}
					block={block}
					attributeId="publisherGridRows"
					hovered={hoveredRow}
					createVirtualAreas={createVirtualAreas}
				/>
			</div>

			<AddButton
				type="row"
				gridTemplate={gridRows}
				onClick={() => {
					const newValue = [
						...publisherGridRows.value,
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
						'publisherGridRows',
						{
							length: publisherGridRows.length + 1,
							value: newValue,
						},
						{
							effectiveItems: {
								publisherGridAreas: generateAreas({
									gridRows: newValue,
									gridColumns: publisherGridColumns.value,
									prevGridAreas: publisherGridAreas,
									publisherGridDirection,
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
						...publisherGridColumns.value,
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
						'publisherGridColumns',
						{
							length: publisherGridColumns.length + 1,
							value: newValue,
						},
						{
							effectiveItems: {
								publisherGridAreas: generateAreas({
									gridColumns: newValue,
									gridRows: publisherGridRows.value,
									prevGridAreas: publisherGridAreas,
									publisherGridDirection,
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
							></div>
						);
					}

					return <></>;
				})}
			</div>
		</div>
	);
};
