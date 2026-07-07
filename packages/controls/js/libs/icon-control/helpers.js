// @flow

/**
 * Internal dependencies
 */
import { sanitizeRawSVGString } from './utils';

/**
 * Parse a saved SVG file in the Media Library as a string and
 * set the icon attribute.
 *
 * @param {Object}   media         The media object for the selected SVG file.
 * @param {Function} setSvgString  Sets the SVG string.
 */
export function parseUploadedMediaAndSetIcon(
	media: Object,
	setSvgString: Function
): void {
	if (!media.url?.endsWith('.svg')) {
		return;
	}

	return fetch(media.url)
		.then((response) => response.text())
		.then((rawString) => {
			const svgString = sanitizeRawSVGString(rawString);

			if (!svgString) {
				return;
			}

			// Check if width attribute already exists and replace it, otherwise add it
			const widthValue = (!media.width ? 50 : media.width) + 'px';
			let updatedSvgString = svgString;

			// Check if width attribute exists
			if (svgString.includes('width=')) {
				// Replace existing width attribute
				updatedSvgString = svgString.replace(
					/width\s*=\s*["'][^"']*["']/,
					`width="${widthValue}"`
				);
			} else {
				// Add width attribute after <svg
				updatedSvgString = svgString.replace(
					'<svg ',
					`<svg width="${widthValue}" `
				);
			}

			setSvgString(updatedSvgString);
		})
		.catch((error) => {
			/* @debug-ignore */
			console.log(error);
		});
}

/**
 * Parse the SVG file dropped in the DropZone and set the icon if valid.
 *
 * @param {string}   media         The media object for the selected SVG file.
 * @param {Function} setAttributes Sets the block attributes.
 */
export function parseDroppedMediaAndSetIcon(
	media: string,
	setAttributes: Function
): void {
	const svgString = sanitizeRawSVGString(media);

	if (!svgString) {
		return;
	}

	setAttributes({
		icon: svgString,
		iconName: '',
	});
}
