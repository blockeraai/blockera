// @flow

/**
 * External Dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { useDragValue } from '@publisher/utils';
import { useBlockContext } from '../../../hooks';

/**
 * Internal Dependencies
 */
import type { TGapHandlerProps } from '../types';

export const GapHandler = ({
	type,
	style,
	styles,
}: TGapHandlerProps): MixedElement => {
	const { handleOnChangeAttributes, getAttributes } = useBlockContext();
	const { publisherGridGap } = getAttributes();

	const colGapUnit = styles.columnGap
		? styles.columnGap.match(/[^-\.0-9]/g).join('')
		: styles.gap?.match(/[^-\.0-9]/g)?.join('');
	const rowGapUnit = styles.rowGap
		? styles.rowGap.match(/[^-\.0-9]/g).join('')
		: styles.gap?.match(/[^-\.0-9]/g)?.join('');

	const { onDragStart } = useDragValue({
		value:
			type === 'row'
				? Number(
						styles.rowGap
							? styles.rowGap.replace(/[^-\.0-9]/g, '')
							: styles.gap.replace(/[^-\.0-9]/g, '')
				  ) || 0
				: Number(
						styles.columnGap
							? styles.columnGap.replace(/[^-\.0-9]/g, '')
							: styles.gap.replace(/[^-\.0-9]/g, '')
				  ) || 0,
		setValue: (newValue, ref) => {
			if (type === 'row') {
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
				);
			}
			if (type === 'column') {
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
				);
			}
		},
		movement: type === 'row' ? 'vertical' : 'horizontal',
		min: 0,
	});

	return (
		<div
			className={`grid-builder-${type}-gap-handler`}
			style={style}
			onMouseDown={(e) => onDragStart(e)}
		/>
	);
};
