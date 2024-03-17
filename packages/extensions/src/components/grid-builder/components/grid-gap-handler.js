// @flow

/**
 * External Dependencies
 */
import type { MixedElement } from 'react';
import { memo, useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { useDragValue } from '@publisher/utils';
import { useBlockContext } from '../../../hooks';

/**
 * Internal Dependencies
 */
import type { TGapHandlerProps } from '../types';

export const GapHandler: TGapHandlerProps = memo<TGapHandlerProps>(
	({ type, style, styles }: TGapHandlerProps): MixedElement => {
		const { handleOnChangeAttributes, getAttributes } = useBlockContext();
		const { publisherGridGap } = getAttributes();

		const colGapUnit = styles.columnGap
			? styles.columnGap.match(/[^-\.0-9]/g).join('')
			: styles.gap?.match(/[^-\.0-9]/g)?.join('');
		const rowGapUnit = styles.rowGap
			? styles.rowGap.match(/[^-\.0-9]/g).join('')
			: styles.gap?.match(/[^-\.0-9]/g)?.join('');

		const { onDragStart, onDragEnd } = useDragValue({
			value:
				type === 'row'
					? Number(styles.rowGap.replace(/[^-\.0-9]/g, '')) ||
					  Number(styles.gap.replace(/[^-\.0-9]/g, ''))
					: Number(styles.columnGap.replace(/[^-\.0-9]/g, '')) ||
					  Number(styles.gap.replace(/[^-\.0-9]/g, '')),
			setValue: (newValue, ref) => {
				if (type === 'row') {
					handleOnChangeAttributes(
						'publisherGridGap',
						{
							...publisherGridGap,
							lock: false,
							rows: `${newValue}${rowGapUnit || 'px'}`,
							columns:
								publisherGridGap.columns ||
								publisherGridGap.gap,
						},
						{
							ref,
						}
					);
				}
				if (type === 'column') {
					handleOnChangeAttributes(
						'publisherGridGap',
						{
							...publisherGridGap,
							lock: false,
							columns: `${newValue}${colGapUnit || 'px'}`,
							rows: publisherGridGap.rows || publisherGridGap.gap,
						},
						{
							ref,
						}
					);
				}
			},
			movement: type === 'row' ? 'vertical' : 'horizontal',
			min: 0,
		});

		useEffect(() => {
			return onDragEnd;
		}, []);

		return (
			<div
				className={`grid-builder-${type}-gap-handler`}
				data-test={`gap-handler-${type}`}
				style={style}
				onMouseDown={(e) => onDragStart(e)}
			/>
		);
	}
);
