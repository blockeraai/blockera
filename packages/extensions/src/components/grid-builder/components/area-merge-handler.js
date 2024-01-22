// @flow

/**
 * External dependencies
 */
import { Rnd } from 'react-rnd';
import { useState, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { resizeHandleClasses } from '../utils';
import { useBlockContext } from '../../../hooks';

export const AreaMergeHandler = ({
	id,
	setResizeToElementId,
	activeAreaId,
	mergeArea,
}) => {
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

	const getEnableResize = () => {
		return {
			bottom: false,
			bottomLeft: true,
			bottomRight: true,

			top: false,
			topLeft: true,
			topRight: true,

			left: false,
			right: false,
		};
	};

	// flow-typed for event param 👉🏻 FocusEvent<HTMLDivElement>
	// in this case missing event param.
	const onBlur = (e) => {
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
				if (e.toElement.getAttribute('data-id'))
					setResizeToElementId(e.toElement.getAttribute('data-id'));

				if (activeAreaId === id) {
					setDimension({
						width: ref.style.width,
						height: ref.style.height,
					});

					setPosition({ top: _position.y, left: _position.x });
				}
			}}
			onResizeStop={mergeArea}
			enableResizing={getEnableResize()}
			//minWidth={100}
			//minHeight={50}
			disableDragging={isReadOnly}
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
