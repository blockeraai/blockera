// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useMemo, useCallback } from '@wordpress/element';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { PanelBodyControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { StyleItem } from './style-item';
import { SortableStyleItem } from './sortable-style-item';
import { AddNewStyleButton } from './add-new-style-button';
import { usePersistVariationOrder } from './use-persist-variation-order';
import { useBlockStylesPickerContext } from '../context';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../variation-surfaces';

export const StyleVariationsManager = (): MixedElement => {
	const {
		blockName,
		blockStyles,
		setBlockStyles,
		isNotActive,
		variationSurface = VARIATION_SURFACE_STYLE,
	} = useBlockStylesPickerContext();

	const isSizeSurface = variationSurface === VARIATION_SURFACE_SIZE;
	const persistVariationOrder = usePersistVariationOrder(
		blockName,
		variationSurface
	);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const sortableIds = useMemo(
		() =>
			blockStyles
				.filter((row) => row?.name !== 'default')
				.map((row) => row.name),
		[blockStyles]
	);

	const handleDragEnd = useCallback(
		(event: Object) => {
			if (!event.over || event.active.id === event.over.id) {
				return;
			}

			const sortable = blockStyles.filter(
				(row) => row?.name !== 'default'
			);
			const oldIndex = sortable.findIndex(
				(row) => row.name === event.active.id
			);
			const newIndex = sortable.findIndex(
				(row) => row.name === event.over.id
			);

			if (oldIndex !== -1 && newIndex !== -1) {
				const pinned = blockStyles.filter(
					(row) => row?.name === 'default'
				);
				const nextRows = [
					...pinned,
					...arrayMove(sortable, oldIndex, newIndex),
				];

				setBlockStyles(nextRows);
				persistVariationOrder(nextRows);
			}
		},
		[blockStyles, persistVariationOrder, setBlockStyles]
	);

	const memoizedStyles = useMemo(
		() => (
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={sortableIds}
					strategy={verticalListSortingStrategy}
				>
					{blockStyles.map((style) =>
						style?.name === 'default' ? (
							<StyleItem
								key={style.name}
								style={style}
								inGlobalStylesPanel={true}
							/>
						) : (
							<SortableStyleItem key={style.name} style={style} />
						)
					)}
				</SortableContext>
			</DndContext>
		),
		[blockStyles, handleDragEnd, sensors, sortableIds]
	);

	return (
		<PanelBodyControl
			title={
				<>
					{isSizeSurface
						? __('Size Variations', 'blockera')
						: __('Style Variations', 'blockera')}

					<AddNewStyleButton
						design="no-label"
						style={{ marginLeft: 'auto' }}
					/>
				</>
			}
			initialOpen={true}
			icon={
				<Icon
					icon={
						isSizeSurface
							? 'extension-size'
							: 'extension-style-variations'
					}
					iconSize={20}
				/>
			}
			className={extensionClassNames(
				isSizeSurface ? 'size-variations' : 'style-variations'
			)}
			accordion={false}
		>
			<div
				className={componentInnerClassNames('block-style-variations', {
					'blockera-control-is-not-active': isNotActive,
					'design-large': true,
				})}
			>
				{memoizedStyles}

				<p
					className={componentInnerClassNames(
						'block-style-variations-description'
					)}
				>
					{isSizeSurface
						? __(
								'Define size presets stored as block style variations with a dedicated type, and edit them independently of main style variations.',
								'blockera'
							)
						: __(
								'Create style presets for blocks and apply them instantly across multiple blocks or pages.',
								'blockera'
							)}
				</p>

				<AddNewStyleButton
					design="with-label"
					label={
						isSizeSurface
							? __('Add Size Variation', 'blockera')
							: __('Add Style Variation', 'blockera')
					}
				/>
			</div>
		</PanelBodyControl>
	);
};
