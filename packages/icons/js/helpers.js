//@flow

/**
 * Returns a kebab-cased string of the given icon component name.
 * for example `Device2xlDesktop` becomes `device-2xl-desktop`
 *
 * @param {string} str - The string to convert to kebab-case.
 * @return {string} The kebab-cased string.
 */
export function getIconKebabId(str: string): string {
	return str.replace(/[A-Z0-9]/g, (match, index) => {
		if (index === 0) {
			return match.toLowerCase();
		} else if (/[0-9]/.test(match)) {
			return `-${match}`;
		}
		return `-${match.toLowerCase()}`;
	});
}

const STROKE_ICON_LIBRARIES = ['feather', 'lucide', 'untitledui'];

/**
 * Stroke-based npm icon libraries (Feather, Lucide, Untitled UI).
 *
 * @param {string} library Icon library id.
 * @return {boolean} True when the library uses stroke-based SVG icons.
 */
export function isStrokeIconLibrary(library: string): boolean {
	return STROKE_ICON_LIBRARIES.includes(library);
}

/**
 * Detect stroke SVG markup (fill="none" + stroke).
 *
 * @param {string} svg SVG markup.
 * @return {boolean} True when markup looks like a stroke icon SVG.
 */
export function isStrokeSvgMarkup(svg: string): boolean {
	if (!svg || typeof svg !== 'string') {
		return false;
	}

	return /fill=["']none["']/i.test(svg) && /stroke/i.test(svg);
}

/**
 * Extract the first SVG element from captured icon HTML.
 *
 * @param {string} html Icon markup (may include wrapper spans).
 * @return {string} The first SVG element outer HTML, or the original html.
 */
export function extractSvgMarkup(html: string): string {
	if (!html || typeof html !== 'string') {
		return '';
	}

	if (typeof document !== 'undefined') {
		const template = document.createElement('template');
		template.innerHTML = html.trim();
		const svg = template.content.querySelector('svg');

		if (svg) {
			return svg.outerHTML;
		}
	}

	const match = html.match(/<svg[\s\S]*<\/svg>/i);

	return match ? match[0] : html;
}

/**
 * Normalize stroke icon SVG for storage and frontend output.
 *
 * @param {string} html   Icon markup.
 * @param {string} library Icon library id.
 * @return {string} Normalized SVG markup safe for storage and rendering.
 */
export function prepareIconSvgForStorage(
	html: string,
	library: string = ''
): string {
	let svgMarkup = extractSvgMarkup(html);

	if (!svgMarkup) {
		return html;
	}

	if (!isStrokeIconLibrary(library) && !isStrokeSvgMarkup(svgMarkup)) {
		return svgMarkup;
	}

	if (typeof document === 'undefined') {
		svgMarkup = svgMarkup.replace(
			/(<svg[^>]*\sstyle=["'])([^"']*)(["'])/i,
			(_match, open, style, close) => {
				const cleaned = style
					.replace(/\bfill\s*:\s*[^;]+;?/gi, '')
					.trim();
				return `${open}${cleaned}${close}`;
			}
		);

		if (/\bfill=/i.test(svgMarkup)) {
			svgMarkup = svgMarkup.replace(
				/(<svg[^>]*)\sfill=["'][^"']*["']/i,
				'$1 fill="none"'
			);
		} else {
			svgMarkup = svgMarkup.replace(/<svg/i, '<svg fill="none"', 1);
		}

		if (!/\bstroke=/i.test(svgMarkup)) {
			svgMarkup = svgMarkup.replace(
				/<svg/i,
				'<svg stroke="currentColor"',
				1
			);
		}

		return svgMarkup;
	}

	const template = document.createElement('template');
	template.innerHTML = svgMarkup;
	const svg = template.content.querySelector('svg');

	if (!svg) {
		return svgMarkup;
	}

	svg.setAttribute('fill', 'none');

	if (!svg.getAttribute('stroke')) {
		svg.setAttribute('stroke', 'currentColor');
	}

	if (svg.style?.fill) {
		svg.style.fill = '';
		svg.style.removeProperty('fill');
	}

	const shapeTags = [
		'path',
		'circle',
		'rect',
		'ellipse',
		'line',
		'polyline',
		'polygon',
	];

	shapeTags.forEach((tag) => {
		svg.querySelectorAll(tag).forEach((node) => {
			node.setAttribute('fill', 'none');

			if (!node.getAttribute('stroke')) {
				node.setAttribute('stroke', 'currentColor');
			}

			if (node.style?.fill) {
				node.style.fill = '';
				node.style.removeProperty('fill');
			}
		});
	});

	svg.querySelectorAll('[fill]').forEach((node) => {
		if (node.getAttribute('fill') !== 'none') {
			node.setAttribute('fill', 'none');
		}
	});

	return svg.outerHTML;
}
