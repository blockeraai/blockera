// @flow

/**
 * External dependencies
 */
import { useState } from '@wordpress/element';
//import type { MixedElement } from 'react';

/**
 * Publisher Dependencies
 */
import { useDragValue } from '@publisher/utils';
import { useBlockContext } from '../../../hooks';

/**
 * Internal dependencies
 */
import SizeHandler from '../icons/size-handler';
import { SizeSetting } from './setting';
import EditIcon from '../icons/edit';
import type { TGridSizeHandlerProps } from '../types';

export const GridSizeHandler = ({
	type,
	attribute,
	setHovered,
	block,
	attributeId,
	hovered,
	createVirtualAreas,
}: TGridSizeHandlerProps): any => {
	const { handleOnChangeAttributes } = useBlockContext();

	const [isSettingOpen, setIsSettingOpen] = useState(false);
	const [currentItemId, setCurrentItemId] = useState(null);

	const changedItem = attribute.value.find(
		(item) => item.id === currentItemId
	);

	const changedItemIndex = attribute.value.findIndex(
		(item) => item.id === currentItemId
	);

	const { onDragStart } = useDragValue({
		value:
			changedItem !== undefined &&
			changedItem['sizing-mode'] === 'min/max'
				? Number(changedItem['max-size']?.replace(/[^-\.0-9]/g, ''))
				: Number(changedItem?.size?.replace(/[^-\.0-9]/g, '')) || 0,
		setValue: (newValue, ref) => {
			if (
				changedItem !== undefined &&
				changedItem['sizing-mode'] === 'min/max'
			) {
				const unit = changedItem['max-size']
					.match(/[^-\.0-9]/g)
					.join('');

				handleOnChangeAttributes(
					attributeId,
					{
						...attribute,
						value: [
							...attribute.value.slice(0, changedItemIndex),
							{
								...changedItem,
								'max-size': `${
									unit === 'fr'
										? (newValue / 10).toFixed(2)
										: newValue
								}${unit}`,
							},
							...attribute.value.slice(changedItemIndex + 1),
						],
					},
					{
						ref,
					}
				);
			} else if (changedItem !== undefined) {
				const unit = changedItem.size.match(/[^-\.0-9]/g).join('');

				handleOnChangeAttributes(
					attributeId,
					{
						...attribute,
						value: [
							...attribute.value.slice(0, changedItemIndex),
							{
								...changedItem,
								size: `${
									unit === 'fr'
										? (newValue / 10).toFixed(2)
										: newValue
								}${unit}`,
							},
							...attribute.value.slice(changedItemIndex + 1),
						],
					},
					{
						ref,
					}
				);
			}
		},
		min: 1,
		movement: type === 'row' ? 'vertical' : 'horizontal',
	});

	return attribute.value.map((item, i) => {
		let isResizable;
		if (item['sizing-mode'] === 'min/max') {
			isResizable = [...item['max-size']].find((item) => Number(item));
		} else {
			isResizable = [...item.size].find((item) => Number(item));
		}

		let amount, unit, minAmount, minUnit, maxAmount, maxUnit;

		switch (item['sizing-mode']) {
			case 'normal':
				amount = isResizable
					? item.size.replace(/[^-\.0-9]/g, '')
					: item.size;
				unit = isResizable && item.size.match(/[^-\.0-9]/g)?.join('');
				break;
			case 'min/max':
				minAmount = [...item['min-size']].find((item) => Number(item))
					? item['min-size'].replace(/[^-\.0-9]/g, '')
					: item['min-size'];
				minUnit =
					[...item['min-size']].find((item) => Number(item)) &&
					item['min-size'].match(/[^-\.0-9]/g)?.join('');

				maxAmount = isResizable
					? item['max-size'].replace(/[^-\.0-9]/g, '')
					: item['max-size'];
				maxUnit =
					isResizable &&
					item['max-size'].match(/[^-\.0-9]/g)?.join('');
		}

		return (
			<>
				<div
					style={{
						gridColumn:
							type === 'column' ? `${i + 1}/${i + 2}` : '1/2',
						gridRow:
							type === 'column' ? '1/2' : `${i + 1}/${i + 2}`,
						height: type === 'row' && '100%',
						width: type === 'column' && '100%',
					}}
					key={item.id}
					className={`size-handler ${type}-handler ${
						!isResizable && 'not-resizable'
					}`}
				>
					{isResizable && (
						<span
							onMouseDown={(e) => {
								setCurrentItemId(item.id);

								onDragStart(e);
							}}
						>
							<SizeHandler />
						</span>
					)}
					<button
						// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
						onMouseOver={() => {
							createVirtualAreas();
							setHovered(`${i + 1}/${i + 2}`);
						}}
						onMouseLeave={() => setHovered(null)}
						onClick={() => {
							setCurrentItemId(item.id);
							setIsSettingOpen(!isSettingOpen);
						}}
						className="size-handler-content"
					>
						{item['sizing-mode'] === 'normal' ? (
							<>
								<span className="amount">{amount}</span>
								<span className="unit">{unit}</span>
							</>
						) : (
							<>
								<span className="amount">{minAmount}</span>
								<span className="unit">{minUnit}</span>
								<span> / </span>
								<span className="amount">{maxAmount}</span>
								<span className="unit">{maxUnit}</span>
							</>
						)}

						<span
							className={`edit-icon ${
								hovered === `${i + 1}/${i + 2}`
									? 'show'
									: 'hide'
							}`}
						>
							<EditIcon />
						</span>
					</button>

					{isResizable && (
						<span
							onMouseDown={(e) => {
								setCurrentItemId(item.id);

								onDragStart(e);
							}}
						>
							<SizeHandler />
						</span>
					)}
				</div>
				{isSettingOpen && currentItemId === item.id && (
					<SizeSetting
						item={item}
						block={block}
						popoverTitle={type}
						items={attribute}
						attributeId={attributeId}
					/>
				)}
			</>
		);
	});
};
