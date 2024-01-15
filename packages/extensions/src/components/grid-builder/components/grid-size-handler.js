// @flow

/**
 * External dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SizeHandler from '../icons/size-handler';

export const GridSizeHandler = ({
	type,
	gridTemplate,
	onDragStart,
	setCurrentItemId,
	setHovered,
}) => {
	const [isSettingShow, setIsSettingShow] = useState(false);

	return gridTemplate.map((item, i) => (
		<div
			style={{
				gridColumn: type === 'column' ? `${i + 1}/${i + 2}` : '1/2',
				gridRow: type === 'column' ? '1/2' : `${i + 1}/${i + 2}`,
				height: type === 'row' && '100%',
				width: type === 'column' && '100%',
			}}
			key={item.id}
			className={`size-handler ${type}-handler`}
			onClick={() => setIsSettingShow(!isSettingShow)}
		>
			<span
				onMouseDown={(e) => {
					setCurrentItemId(item.id);
					onDragStart(e);
				}}
			>
				<SizeHandler />
			</span>

			<span
				// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
				onMouseOver={() => setHovered(`${i + 1}/${i + 2}`)}
				onMouseLeave={() => setHovered(null)}
			>
				{item.size}
			</span>

			<span
				onMouseDown={(e) => {
					setCurrentItemId(item.id);
					onDragStart(e);
				}}
			>
				<SizeHandler />
			</span>
		</div>
	));
};
