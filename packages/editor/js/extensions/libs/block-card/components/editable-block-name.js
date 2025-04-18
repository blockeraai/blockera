// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useState, useRef, useEffect } from '@wordpress/element';

export function EditableBlockName({
	placeholder,
	content,
	onChange,
}: {
	placeholder: string,
	content: string,
	onChange: (content: string) => void,
}): MixedElement {
	const [text, setText] = useState(content);
	const ref = useRef(null);

	useEffect(() => {
		const currentText = (ref && ref?.current?.textContent) || '';

		if (content !== currentText) {
			setText(content);
		}
	}, [content]);

	const emitChange = (event: SyntheticInputEvent<HTMLSpanElement>) => {
		const newContent = (event.currentTarget.textContent || '').trim();

		if (content !== newContent) {
			onChange(newContent);
		}

		if (newContent === '') {
			ref.current.textContent = '';
		}
	};

	const handleBlur = (event: SyntheticFocusEvent<HTMLSpanElement>) => {
		// Move scroll position to the beginning of the element
		event.currentTarget.scrollLeft = 0;

		// Deselect any selected text
		event.currentTarget.ownerDocument.defaultView
			?.getSelection()
			?.removeAllRanges();
	};

	return (
		<span
			ref={ref}
			placeholder={placeholder}
			contentEditable="true"
			suppressContentEditableWarning={true}
			onInput={emitChange}
			onBlur={handleBlur}
			onKeyDown={(e) => {
				// Prevent newlines
				if (e.key === 'Enter') {
					e.currentTarget.blur();
					return;
				}

				// Handle Escape key to clear name
				if (e.key === 'Escape') {
					e.currentTarget.textContent = '';
					emitChange(e);
					e.currentTarget.blur();
				}
			}}
		>
			{text}
		</span>
	);
}
