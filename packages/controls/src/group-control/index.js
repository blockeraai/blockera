/**
 * WordPress dependencies
 */
import { useRef, useState, useEffect } from '@wordpress/element';
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './style.scss';
import { controlClassNames } from '@publisher/classnames';

export default function GroupControl({
	isOpen,
	header,
	children,
	groupId = null,
	dropArgs = null,
	isPopover = false,
	isDraggable = false,
	dropCallback = null,
	className = 'group',
}) {
	const styleRef = useRef({});
	const [draggingIndex, setDraggingIndex] = useState(null);

	useEffect(() => {
		styleRef.current = { opacity: draggingIndex !== groupId ? 0.5 : 1 };
	}, [draggingIndex, groupId]);

	const handleDragStart = (e, index) => {
		e.dataTransfer.setData('text/plain', index);
		setDraggingIndex(index);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const handleDrop = (e, index) => {
		e.preventDefault();

		setDraggingIndex(index);

		if (!dropCallback) {
			return;
		}

		const toIndex = index;
		const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);

		dropCallback({ args: dropArgs, fromIndex, toIndex });
	};

	return (
		<div
			draggable
			onDragOver={handleDragOver}
			onDrop={(e) => handleDrop(e, groupId)}
			className={controlClassNames(className)}
			onDragStart={(e) => handleDragStart(e, groupId)}
			style={styleRef.current}
		>
			<div className={`header${isDraggable ? ' draggable' : ''}`}>
				<div className="header-label">{header}</div>
			</div>
			{isPopover
				? isOpen && (
						<Popover>
							<div className="content">{children}</div>
						</Popover>
				  )
				: isOpen && <div className="content">{children}</div>}
		</div>
	);
}
