// @flow

/**
 * External dependencies
 */
import { Rnd } from 'react-rnd';
import { useState, useRef, memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { resizeHandleClasses } from '../utils';
import { useBlockContext } from '../../../hooks';
import type { TAreaMergeHandlerProps } from '../types';

export const AreaMergeHandler: TAreaMergeHandlerProps =
	memo<TAreaMergeHandlerProps>(
		({
			id,
			setTargetAreaId,
			activeAreaId,
			mergeArea,
			setVirtualMergedAreas,
			setVirtualTargetAreaId,
			createVirtualAreas,
			highlightHandler,
			...props
		}: TAreaMergeHandlerProps): any => {
			const { isOpenGridBuilder } = useBlockContext();

			const [position, setPosition] = useState({ left: 0, top: 0 });
			const [dimension, setDimension] = useState({
				width: '100%',
				height: '100%',
			});

			const isDragged = useRef(false);

			const handleClass = 'showHandles';

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
			const onMouseLeave = () => {
				setVirtualMergedAreas([]);
			};

			const findElement = (e: Object, direction: string) => {
				// to increase the speed of finding element when resizing
				const iframe = document.querySelector(
					'iframe[name="editor-canvas"]'
				);
				let targetElement;

				switch (direction) {
					case 'topRight':
					case 'topLeft':
						{
							for (let i = 5; i < 30; i += 2) {
								if (iframe) {
									targetElement =
										iframe.contentWindow.document.elementFromPoint(
											e.pageX,
											e.pageY - i
										);
									if (
										targetElement.getAttribute('data-id') ||
										targetElement.dataset.virtualId
									) {
										break;
									}
								} else {
									targetElement = document.elementFromPoint(
										e.pageX,
										e.pageY - i
									);
									if (
										targetElement.getAttribute('data-id') ||
										targetElement.dataset.virtualId
									)
										break;
								}
							}
						}
						break;
					case 'bottomRight':
					case 'bottomLeft': {
						for (let i = 5; i < 30; i += 2) {
							if (iframe) {
								targetElement =
									iframe.contentWindow.document.elementFromPoint(
										e.pageX,
										e.pageY + i
									);
								if (
									targetElement.getAttribute('data-id') ||
									targetElement.dataset.virtualId
								) {
									break;
								}
							} else {
								targetElement = document.elementFromPoint(
									e.pageX,
									e.pageY + i
								);
								if (
									targetElement.getAttribute('data-id') ||
									targetElement.dataset.virtualId
								)
									break;
							}
						}
					}
				}

				return targetElement;
			};

			const onResize = (
				e: Object,
				direction: string,
				ref: HTMLElement,
				delta: Object,
				_position: Object
			) => {
				createVirtualAreas();
				highlightHandler(direction);

				const targetElement = findElement(e, direction);

				if (
					targetElement !== null &&
					targetElement?.getAttribute('data-id')
				) {
					setTargetAreaId(
						Number(targetElement.getAttribute('data-id'))
					);
				}

				if (targetElement?.dataset?.virtualId) {
					setVirtualTargetAreaId(
						Number(targetElement.dataset.virtualId)
					);
					setTargetAreaId(null);
				}

				if (activeAreaId === id) {
					setDimension({
						width: ref.style.width,
						height: ref.style.height,
					});

					setPosition({ top: _position.y, left: _position.x });
				}
			};

			const onResizeStop = (e: Object, direction: string) => {
				mergeArea(direction);

				setDimension({
					width: '100%',
					height: '100%',
				});
				setPosition({ top: 0, left: 0 });
			};

			if (!isOpenGridBuilder) {
				return null;
			}

			return (
				<Rnd
					className="cell merge-handler"
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
						if (activeAreaId === id)
							setPosition({ top: d.y, left: d.x });
					}}
					onDragStop={(e, d) => {
						isDragged.current = false;
						if (activeAreaId === id)
							setPosition({ top: d.y, left: d.x });
					}}
					resizeHandleWrapperClass={handleClass}
					resizeHandleClasses={resizeHandleClasses}
					onResize={(e, direction, ref, delta, _position) =>
						onResize(e, direction, ref, delta, _position)
					}
					onResizeStop={(e, direction) => onResizeStop(e, direction)}
					enableResizing={getEnableResize()}
					disableDragging={true}
					onMouseLeave={onMouseLeave}
					tabIndex={0}
					lockAspectRatio={false}
					dataId={id}
					{...props}
				/>
			);
		}
	);
