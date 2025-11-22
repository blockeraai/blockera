// @flow

export function getEditorDocumentElement(): ?Document {
	const canvasElement = document.querySelector("[name='editor-canvas']");
	return (
		(canvasElement instanceof HTMLIFrameElement
			? canvasElement.contentDocument
			: null) || document
	);
}
