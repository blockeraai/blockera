// @flow

/**
 * External dependencies
 */
import { Rnd } from 'react-rnd';
import type { MixedElement } from 'react';
import { useState, useRef, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { resizeHandleClasses } from './utils';
import type { GridBuilderProps } from './types';
import { useBlockContext, useStoreSelectors } from '../../hooks';

export const GridBuilder = ({
	id,
	children,
	position: _position,
	dimension: _dimension,
}: GridBuilderProps): MixedElement | null => {
	const [position, setPosition] = useState(_position);
	const [dimension, setDimension] = useState(_dimension);
	const [showGrids, setShowGrids] = useState(false);
	const [isReadOnly, setIsReadOnly] = useState(true);

	const isDragged = useRef(false);

	const {
		blockEditor: { getSelectedBlock },
	} = useStoreSelectors();
	const { isOpenGridBuilder } = useBlockContext();

	const { clientId } = getSelectedBlock() || {};

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

	const handleClass = id && clientId === id ? 'showHandles' : '';

	const style: Object = {
		outline: 'none',
		border: `2px solid ${
			(id && clientId === id) || showGrids || isDragged.current
				? '#21dee5'
				: 'transparent'
		}`,
	};

	// flow-typed for event param 👉🏻 FocusEvent<HTMLDivElement>
	// in this case missing event param.
	const onBlur = () => {
		setIsReadOnly(true);
	};

	const onMouseEnter = () => {
		setShowGrids(true);
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

	return createPortal(
		<Rnd
			style={style}
			size={{
				width: dimension?.width || 0,
				height: dimension?.height || 0,
			}}
			position={{ x: position?.left || 0, y: position?.top || 0 }}
			onDragStart={(e, d) => {
				isDragged.current = true;

				setPosition({ top: d.y, left: d.x });
			}}
			onDragStop={(e, d) => {
				isDragged.current = false;

				setPosition({ top: d.y, left: d.x });
			}}
			resizeHandleWrapperClass={handleClass}
			resizeHandleClasses={resizeHandleClasses}
			onResize={(e, direction, ref, delta, position) => {
				console.log(e, direction, ref, delta, position);

				setDimension({
					width: ref.style.width,
					height: ref.style.height,
				});

				setPosition({ top: position.y, left: position.x });
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
			lockAspectRatio={true}
		>
			{children}
		</Rnd>,
		document
			.querySelector('iframe[name="editor-canvas"]')
			// $FlowFixMe
			?.contentDocument?.body?.querySelector(
				'.publisher-core.publisher-block-wrapper'
			)
	);
};
