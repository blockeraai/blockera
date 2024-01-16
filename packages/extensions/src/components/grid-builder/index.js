// @flow

/**
 * External dependencies
 */
import { Rnd } from 'react-rnd';
import type { MixedElement } from 'react';
import { useState, useRef, createPortal, useEffect } from '@wordpress/element';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { useDragValue } from '@publisher/utils';
import {} from '../../libs/layout/css-generators';
import * as config from '../../libs/base/config';
import { LayoutStyles } from '../../libs/layout';
import { useCssGenerator } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { resizeHandleClasses, extractCssValue } from './utils';
import type { GridBuilderProps } from './types';
import { useBlockContext, useStoreSelectors } from '../../hooks';
import { GridSizeHandler } from './components/grid-size-handler';
import { AddButton } from './components/add-button';

export const GridBuilder = ({
	children,
}: GridBuilderProps): MixedElement | null => {
	const { isOpenGridBuilder, getAttributes } = useBlockContext();

	const {
		blockEditor: { getSelectedBlock },
	} = useStoreSelectors();

	const { clientId } = getSelectedBlock() || {};

	const selectedBlock = document
		.querySelector('iframe[name="editor-canvas"]')
		// $FlowFixMe
		?.contentDocument?.body?.querySelector(`#block-${clientId}`);

	useEffect(() => {
		if (!isOpenGridBuilder) {
			selectedBlock.style.visibility = 'visible';
		} else {
			selectedBlock.style.visibility = 'hidden';
		}

		return () => (selectedBlock.style.display = 'visible');
	}, [isOpenGridBuilder]);

	const { publisherWidth, publisherHeight } = getAttributes();

	if (!isOpenGridBuilder) {
		return null;
	}

	const elementStyles = getComputedStyle(selectedBlock);

	return createPortal(
		<div
			style={{
				width: publisherWidth || elementStyles.width,
				height: publisherHeight || elementStyles.height,
				position: 'absolute',
				top: elementStyles.marginTop,
				left: elementStyles.marginLeft,
			}}
		>
			<VirtualGrid />
			{children}
		</div>,
		document
			.querySelector('iframe[name="editor-canvas"]')
			//$FlowFixMe
			?.contentDocument?.body?.querySelector(
				`div:has(#block-${clientId})`
			)
	);
};

export const VirtualGrid = ({}) => {
	const { handleOnChangeAttributes, getAttributes, activeDeviceType } =
		useBlockContext();
	const attributes = getAttributes();
	const { publisherGridColumns, publisherGridRows, publisherGridGap } =
		attributes;

	const {
		blockEditor: { getSelectedBlock },
	} = useStoreSelectors();
	const { clientId } = getSelectedBlock() || {};

	const generatedStyle = useCssGenerator({
		callback: LayoutStyles,
		attributes,
		activeDeviceType,
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
	};
	console.log(styles);

	const gridColumns = publisherGridColumns.value;
	const gridRows = publisherGridRows.value;

	const [currentColItemId, setCurrentColItemId] = useState(null);
	const [currentRowItemId, setCurrentRowItemId] = useState(null);

	const changedColItem = gridColumns.find(
		(item) => item.id === currentColItemId
	);

	const changedColItemIndex = gridColumns.findIndex(
		(item) => item.id === currentColItemId
	);

	const changedRowItem = gridRows.find(
		(item) => item.id === currentRowItemId
	);

	const changedRowItemIndex = gridRows.findIndex(
		(item) => item.id === currentRowItemId
	);

	const [hoveredColumn, setHoveredColumn] = useState(null);
	const [hoveredRow, setHoveredRow] = useState(null);

	const { onDragStart: onDragStartCol } = useDragValue({
		value: Number(changedColItem?.size?.replace(/[^-\.0-9]/g, '')) || 0,
		setValue: (newValue, ref) =>
			handleOnChangeAttributes(
				'publisherGridColumns',
				{
					...publisherGridColumns,
					value: [
						...gridColumns.slice(0, changedColItemIndex),
						{
							...changedColItem,
							size: `${newValue}${changedColItem?.size
								.match(/[^-\.0-9]/g)
								.join('')}`,
						},
						...gridColumns.slice(changedColItemIndex + 1),
					],
				},
				{
					ref,
				}
			),
		movement: 'horizontal',
		min: 1,
	});

	const { onDragStart: onDragStartRow } = useDragValue({
		value: Number(changedRowItem?.size?.replace(/[^-\.0-9]/g, '')) || 0,
		setValue: (newValue, ref) =>
			handleOnChangeAttributes(
				'publisherGridRows',
				{
					...publisherGridRows,
					value: [
						...gridRows.slice(0, changedRowItemIndex),
						{
							...changedRowItem,
							size: `${newValue}${changedRowItem?.size
								.match(/[^-\.0-9]/g)
								.join('')}`,
						},
						...gridRows.slice(changedRowItemIndex + 1),
					],
				},
				{
					ref,
				}
			),
		min: 1,
	});

	const colGapUnit = styles.columnGap
		? styles.columnGap.match(/[^-\.0-9]/g).join('')
		: styles.gap?.match(/[^-\.0-9]/g)?.join('');
	const rowGapUnit = styles.rowGap
		? styles.rowGap.match(/[^-\.0-9]/g).join('')
		: styles.gap?.match(/[^-\.0-9]/g)?.join('');

	const { onDragStart: onDragStartColumnGap } = useDragValue({
		value:
			Number(
				styles.columnGap
					? styles.columnGap.replace(/[^-\.0-9]/g, '')
					: styles.gap.replace(/[^-\.0-9]/g, '')
			) || 0,
		setValue: (newValue, ref) =>
			handleOnChangeAttributes(
				'publisherGridGap',
				{
					...publisherGridGap,
					lock: false,
					columns: `${newValue}${colGapUnit || 'px'}`,
				},
				{
					ref,
				}
			),
		movement: 'horizontal',
		min: 0,
	});

	const { onDragStart: onDragStartRowGap } = useDragValue({
		value:
			Number(
				styles.rowGap
					? styles.rowGap.replace(/[^-\.0-9]/g, '')
					: styles.gap.replace(/[^-\.0-9]/g, '')
			) || 0,
		setValue: (newValue, ref) =>
			handleOnChangeAttributes(
				'publisherGridGap',
				{
					...publisherGridGap,
					lock: false,
					rows: `${newValue}${rowGapUnit || 'px'}`,
				},
				{
					ref,
				}
			),
		min: 0,
	});

	const calcGapGrid = () => {
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

	const gapHandlers = calcGapGrid();

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
					gridTemplate={gridColumns}
					onDragStart={onDragStartCol}
					setCurrentItemId={setCurrentColItemId}
					setHovered={setHoveredColumn}
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
					gridTemplate={gridRows}
					onDragStart={onDragStartRow}
					setCurrentItemId={setCurrentRowItemId}
					setHovered={setHoveredRow}
				/>
			</div>

			<AddButton
				type="row"
				gridTemplate={gridRows}
				onClick={() =>
					handleOnChangeAttributes('publisherGridRows', {
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
					})
				}
				columnGap={styles.columnGap || styles.gap}
				rowGap={styles.rowGap || styles.gap}
			/>

			<AddButton
				type="column"
				gridTemplate={gridColumns}
				onClick={() =>
					handleOnChangeAttributes('publisherGridColumns', {
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
					})
				}
			/>

			<div
				className="content-container"
				style={{
					gridTemplateRows: styles.gridTemplateRows,
					gridTemplateColumns: styles.gridTemplateColumns,
					gap:
						styles.columnGap && styles.rowGap
							? `${styles.rowGap} ${styles.columnGap}`
							: styles.gap || '20px',
					gridAutoFlow: styles.gridDirection,
				}}
			>
				<div
					className="gap-handlers-container"
					style={{
						gridTemplateRows: gapHandlers.gapRowHandler,
						gridTemplateColumns: gapHandlers.gapColumnHandler,
					}}
				>
					{gridColumns.map((item, i) => {
						if (i + 1 < gridColumns.length)
							return (
								<div
									className="grid-builder-col-gap-handler"
									key={item.id}
									style={{
										gridColumn: `${i * 2 + 2}/${i * 2 + 3}`,
										gridRow: '1/-1',
										width: styles.columnGap || styles.gap,
										minWidth: '1px',
									}}
									onMouseDown={(e) => onDragStartColumnGap(e)}
								></div>
							);

						return null;
					})}

					{gridRows.map((item, i) => {
						if (i + 1 < gridRows.length)
							return (
								<div
									className="grid-builder-row-gap-handler"
									key={item.id}
									style={{
										gridRow: `${i * 2 + 2}/${i * 2 + 3}`,
										gridColumn: '1/-1',
										height: styles.rowGap || styles.gap,
										minHeight: '1px',
									}}
									onMouseDown={(e) => onDragStartRowGap(e)}
								></div>
							);

						return null;
					})}
				</div>

				<Cells hoveredColumn={hoveredColumn} hoveredRow={hoveredRow} />
			</div>
		</div>
	);
};

const Cells = ({ hoveredColumn, hoveredRow }) => {
	const { getAttributes } = useBlockContext();

	const { publisherGridColumns, publisherGridRows } = getAttributes();

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

	// eslint-disable-next-line no-unused-vars
	const [activeAreaId, setActiveAreaId] = useState(null);
	//const [resizeToElementId, setResizeToElementId] = useState(null);

	return gridAreas.flat().map((item, i) => {
		return (
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
				}}
				data-id={item.id}
			>
				{/* <ConditionalWrapper
					condition={activeAreaId === item.id}
					wrapper={(children) => (
						<RndComponent
							setResizeToElementId={setResizeToElementId}
							activeAreaId={activeAreaId}
							id={item.id}
						>
							{children}
						</RndComponent>
					)}
				> */}
				cell{i + 1}
				{/* </ConditionalWrapper> */}
			</div>
		);
	});
};

// eslint-disable-next-line no-unused-vars
const RndComponent = ({ id, setResizeToElementId, activeAreaId }) => {
	const { isOpenGridBuilder } = useBlockContext();
	const [position, setPosition] = useState({ left: 0, top: 0 });
	const [dimension, setDimension] = useState({
		width: '100%',
		height: '100%',
	});
	const [showGrids, setShowGrids] = useState(false);
	const [isReadOnly, setIsReadOnly] = useState(true);

	const isDragged = useRef(false);

	const handleClass = 'showHandles';

	const style: Object = {
		outline: 'none',
		border: `2px solid ${
			showGrids || isDragged.current ? '#21dee5' : 'transparent'
		}`,
	};

	//const { clientId } = getSelectedBlock() || {};

	const getEnableResize = () => {
		return {
			bottom: true,
			bottomLeft: true,
			bottomRight: true,

			top: true,
			topLeft: true,
			topRight: true,

			left: true,
			right: true,
		};
	};

	// flow-typed for event param 👉🏻 FocusEvent<HTMLDivElement>
	// in this case missing event param.
	const onBlur = (e) => {
		// setActiveAreaId(e.target.getAttribute('dataid'));
		if (e.target.getAttribute('dataid') === activeAreaId) {
			setIsReadOnly(true);
			setShowGrids(true);
		}
	};
	const onMouseEnter = (e) => {
		if (e.target.getAttribute('dataid') === activeAreaId)
			setShowGrids(true);
		setShowGrids(false);
	};

	const onMouseLeave = () => {
		setShowGrids(false);
	};

	const onDoubleClick = () => {
		if (!isReadOnly) return;
		setIsReadOnly(false);
	};

	if (!isOpenGridBuilder) {
		return null;
	}

	return (
		<Rnd
			className="cell"
			style={style}
			size={{
				width: dimension?.width || 0,
				height: dimension?.height || 0,
			}}
			position={{
				x: position?.left || 0,
				y: position?.top || 0,
			}}
			onDragStart={(e, d) => {
				isDragged.current = true;
				if (activeAreaId === id) setPosition({ top: d.y, left: d.x });
			}}
			onDragStop={(e, d) => {
				isDragged.current = false;
				if (activeAreaId === id) setPosition({ top: d.y, left: d.x });
			}}
			resizeHandleWrapperClass={handleClass}
			resizeHandleClasses={resizeHandleClasses}
			onResize={(e, direction, ref, delta, _position) => {
				console.log(e, direction, ref, delta, _position);
				setResizeToElementId(e.toElement.getAttribute('data-id'));

				if (activeAreaId === id) {
					setDimension({
						width: ref.style.width,
						height: ref.style.height,
					});

					setPosition({ top: position.y, left: position.x });
				}
			}}
			enableResizing={getEnableResize()}
			minWidth={100}
			minHeight={50}
			disableDragging={!isReadOnly}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onDoubleClick={onDoubleClick}
			// onFocus={onfocus}
			onBlur={onBlur}
			tabIndex={0}
			lockAspectRatio={false}
			dataId={id}
		/>
	);
};
