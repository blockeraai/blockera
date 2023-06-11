export const isOpenPopoverEvent = (event) =>
	!['svg', 'button', 'path'].includes(event?.target?.tagName);
