// @flow

/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import * as config from '../../../libs/base/config';
import { LayoutStyles } from '../../../libs/layout';
import { useCssGenerator } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { extractCssValue } from '../utils';
import { useBlockContext, useStoreSelectors } from '../../../hooks';
import { AddButton, GridSizeHandler, Cells, GapHandler } from './index';

export const VirtualGrid = ({ block }) => {
	const { handleOnChangeAttributes, getAttributes, activeDeviceType } =
		useBlockContext();
	const attributes = getAttributes();
	const {
		publisherGridColumns,
		publisherGridRows,
		publisherGridGap,
		publisherGridAreas,
	} = attributes;

	const {
		blockEditor: { getSelectedBlock },
	} = useStoreSelectors();
	const { clientId } = getSelectedBlock() || {};

	const generatedStyle = useCssGenerator({
		callback: LayoutStyles,
		attributes,
		activeDeviceType,
		blockName: block.blockName,
		callbackProps: {
			...config,
			blockProps: {
				clientId,
			},
		},
	}).join('\n');

	const styles = {
		gridTemplateRows: extractCssValue('grid-template-rows', generatedStyle),
		gridTemplateColumns: extractCssValue(
			'grid-template-columns',
			generatedStyle
		),
		display: extractCssValue('display', generatedStyle),
		gap: publisherGridGap.gap,
		columnGap: publisherGridGap.columns,
		rowGap: publisherGridGap.rows,
		gridDirection: extractCssValue('grid-auto-flow', generatedStyle),
		gridTemplateAreas: extractCssValue(
			'grid-template-areas',
			generatedStyle
		),
	};

	const gridAreas = ([]: any);

	for (let i = 0; i < publisherGridRows.value.length; i++) {
		gridAreas.push([]);
	}

	let count = 1;

	gridAreas?.forEach((row, i) => {
		publisherGridColumns.value.forEach((item, index) => {
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

	useEffect(() => {
		if (!publisherGridAreas.length) {
			handleOnChangeAttributes('publisherGridAreas', gridAreas?.flat(), {
				path: '',
				reset: false,
				action: 'normal',
			});
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

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
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
				/>
			</div>

			<AddButton
				type="row"
				gridTemplate={gridRows}
				onClick={() => {
					const cellCounts = publisherGridAreas?.map((area) =>
						Number(area.name.replace(/[^-\.0-9]/g, ''))
					);

					const newAreas = [];
					for (let i = 1; i <= publisherGridColumns.length; i++) {
						newAreas.push({
							id: nanoid(),
							name: `cell${Math.max(...cellCounts) + i}`,
							'column-start': i,
							'column-end': i + 1,
							'row-start': publisherGridRows.length + 1,
							'row-end': publisherGridRows.length + 2,
						});
					}

					handleOnChangeAttributes(
						'publisherGridRows',
						{
							length: publisherGridRows.length + 1,
							value: [
								...publisherGridRows.value,
								{
									'sizing-mode': 'normal',
									size: 'auto',
									'min-size': '',
									'max-size': '',
									'auto-fit': false,
									id: nanoid(),
								},
							],
						},
						{
							addOrModifyRootItems: {
								publisherGridAreas: [
									...publisherGridAreas,
									...newAreas,
								],
							},
							ref: {
								path: '',
								reset: false,
								action: 'normal',
							},
						}
					);
				}}
				columnGap={styles.columnGap || styles.gap}
				rowGap={styles.rowGap || styles.gap}
			/>

			<AddButton
				type="column"
				gridTemplate={gridColumns}
				onClick={() => {
					const cellCounts = publisherGridAreas?.map((area) =>
						Number(area.name.replace(/[^-\.0-9]/g, ''))
					);

					const newAreas = [];
					for (let i = 1; i <= publisherGridRows.length; i++) {
						newAreas.push({
							id: nanoid(),
							name: `cell${Math.max(...cellCounts) + i}`,
							'column-start': publisherGridColumns.length + 1,
							'column-end': publisherGridColumns.length + 2,
							'row-start': i,
							'row-end': i + 1,
						});
					}

					handleOnChangeAttributes(
						'publisherGridColumns',
						{
							length: publisherGridColumns.length + 1,
							value: [
								...publisherGridColumns.value,
								{
									'sizing-mode': 'normal',
									size: '1fr',
									'min-size': '',
									'max-size': '',
									'auto-fit': false,
									id: nanoid(),
								},
							],
						},
						{
							addOrModifyRootItems: {
								publisherGridAreas: [
									...publisherGridAreas,
									...newAreas,
								],
							},
							ref: {
								path: '',
								reset: false,
								action: 'normal',
							},
						}
					);
				}}
				columnGap={styles.columnGap || styles.gap}
				rowGap={styles.rowGap || styles.gap}
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

				<Cells hoveredColumn={hoveredColumn} hoveredRow={hoveredRow} />
			</div>
		</div>
	);
};
