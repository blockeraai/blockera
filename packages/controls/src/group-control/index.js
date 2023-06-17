/**
 * WordPress dependencies
 */
import { useRef, useState, useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Popover } from '@publisher/components';

/**
 * Styles
 */
import './style.scss';

export default function GroupControl({
	design = 'minimal',
	header,
	children,
	groupId = null,
	dropArgs = null,
	isOpen = false,
	isVisible = true,
	isPopover = false,
	popoverClassName,
	isDraggable = false,
	dropCallback = null,
	className,
	popoverLabel,
	onClose,
}) {
	const styleRef = useRef(null);
	const [draggingIndex, setDraggingIndex] = useState(null);

	useEffect(() => {
		styleRef.current = {
			opacity: draggingIndex && draggingIndex !== groupId ? 0.5 : 1,
		};
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
			draggable={isDraggable}
			onDragOver={handleDragOver}
			onDrop={(e) => handleDrop(e, groupId)}
			className={controlClassNames(
				'group',
				'design-' + design,
				isVisible ? ' is-active' : ' is-inactive',
				isOpen ? 'is-open' : 'is-close',
				className
			)}
			onDragStart={(e) => handleDragStart(e, groupId)}
			style={styleRef.current}
		>
			<div
				className={controlInnerClassNames(
					'group-header',
					isDraggable ? ' draggable' : ''
				)}
			>
				{header}
			</div>

			{isPopover
				? isOpen && (
						<Popover
							offset={35}
							placement="left-start"
							className={controlInnerClassNames(
								'group-popover',
								popoverClassName
							)}
							label={popoverLabel}
							onClose={onClose}
						>
							<div className="content">{children}</div>
						</Popover>
				  )
				: isOpen && <div className="content">{children}</div>}
		</div>
	);
}
