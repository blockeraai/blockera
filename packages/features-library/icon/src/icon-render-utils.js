// @flow

/**
 * External dependencies
 */
import { createRoot } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Icon,
	isStrokeIconLibrary,
	isStrokeSvgMarkup,
	prepareIconSvgForStorage,
	extractSvgMarkup,
} from '@blockera/icons';

/**
 * Internal dependencies
 */
import { getAttrValue } from './icon-attribute-utils';

/** Placeholder SVG used when clearing standalone core/icon selection. */
export const CORE_ICON_EMPTY_RENDERED_ICON =
	'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPgogIDxwYXRoIGQ9Ik01LjEyMzIxMjE2LDEzLjU0Njg3ODUgTDUuMDczNzAwNzgsMTMuNjMzNjI0OCBDNC44MzA3NzM4MywxNC4xMzIyMDY2IDUuMjE4OTIwMjcsMTQuNzM1MjE1NSA1Ljc5MTEzNjkyLDE0LjY4MjU4NzYgTDEwLjI2MjQ3MTUsMTQuMjcwNTQ5IEw5LjgyOTMzODY2LDIxLjcyMjc5MTkgQzkuNzg1OTcwMjEsMjIuNDY4Njc1OSAxMC43NDQ3ODYyLDIyLjc5Mzc2NjkgMTEuMTU0NDQ0OCwyMi4xNzIwNzUzIEwxOC44NzY3OTMyLDEwLjQ1Mjc1NTMgTDE4LjkyNjMwNDYsMTAuMzY2MDA1OSBDMTkuMTY5MjI5NSw5Ljg2NzQwNjc2IDE4Ljc4MTA0NDksOS4yNjQzOTE1IDE4LjIwODgxNTIsOS4zMTcwNTkxOCBMMTMuNzM2NTYzLDkuNzI4NDc0NDggTDE0LjE3MDY2MTEsMi4yNzcyMDgxNCBDMTQuMjE0MDI5MiwxLjUzMTMyOTYgMTMuMjU1MjI0OCwxLjIwNjIzNDg5IDEyLjg0NTU2MDYsMS44Mjc5MTYxNCBMNS4xMjMyMTIxNiwxMy41NDY4Nzg1IFogTTEyLjU2NzU5MjUsNC44ODk1MTk2MSBMMTIuMjQyNTcyNSwxMC40OTIxMTk2IEwxMi4yNDI5OTI1LDEwLjU4NjU4MjIgQzEyLjI3MDI1MjEsMTAuOTg5NDk2OCAxMi42MjE0MTk2LDExLjMwMjIzOTYgMTMuMDMwODg2MiwxMS4yNjQ1NTI1IEwxNi44MzEyOTQxLDEwLjkxNDA0MjggTDExLjQzMTQ0MiwxOS4xMDk1MDM4IEwxMS43NTc0MjcyLDEzLjUwNzg4MDQgTDExLjc1NzAwNzUsMTMuNDEzNDIxOCBDMTEuNzI5NzUxLDEzLjAxMDUyMzUgMTEuMzc4NjEyNCwxMi42OTc3ODUgMTAuOTY5MTYxMSwxMi43MzU0NDMxIEw3LjE2Nzc0MDMyLDEzLjA4NDk4MDYgTDEyLjU2NzU5MjUsNC44ODk1MTk2MSBaIj48L3BhdGg+Cjwvc3ZnPg==';

type EncodeIconOptions = {
	library?: string,
	hasInlineStyle?: boolean,
	color?: string,
	preserveSvg?: boolean,
};

/**
 * Encode rendered icon HTML for blockeraIcon.renderedIcon storage.
 *
 * @param {string} iconHTML SVG markup from rendered Icon component.
 * @param {EncodeIconOptions} options Encoding options.
 * @return {{ encodedIcon: string, icon: string }} Encoded forms.
 */
export const encodeIconMarkup = (
	iconHTML: string,
	{
		library = '',
		hasInlineStyle = false,
		color,
		preserveSvg = false,
	}: EncodeIconOptions = {}
): { encodedIcon: string, icon: string } => {
	let normalizedHTML = preserveSvg
		? extractSvgMarkup(iconHTML) || iconHTML
		: prepareIconSvgForStorage(iconHTML, library);

	if (hasInlineStyle) {
		const iconDoc = new DOMParser().parseFromString(
			normalizedHTML,
			'text/html'
		);
		const svgElement = iconDoc.querySelector('svg');

		if (svgElement) {
			if (color) {
				svgElement.style.color = color;

				if (
					!preserveSvg &&
					!isStrokeIconLibrary(library) &&
					!isStrokeSvgMarkup(svgElement.outerHTML)
				) {
					svgElement.style.fill = color;
				} else if (
					preserveSvg &&
					!isStrokeSvgMarkup(svgElement.outerHTML)
				) {
					svgElement.style.fill = color;
				} else {
					svgElement.style.fill = 'none';
					svgElement.setAttribute('stroke', 'currentColor');
				}
			}

			normalizedHTML = preserveSvg
				? svgElement.outerHTML
				: prepareIconSvgForStorage(svgElement.outerHTML, library);
		}
	}

	return {
		encodedIcon: btoa(unescape(encodeURIComponent(normalizedHTML))),
		icon: encodeURIComponent(normalizedHTML),
	};
};

type RenderIconOptions = {
	iconColor?: string,
	iconSize?: string,
	iconGap?: string,
	iconPosition?: string,
};

/**
 * Render a library icon off-DOM and return encoded renderedIcon payload.
 *
 * @param {Object} iconValue Icon picker value (icon + library).
 * @param {RenderIconOptions} options Presentation options for encoding.
 * @return {Promise<{ encodedIcon: string, icon: string }>} Encoded rendered icon.
 */
export const renderLibraryIconMarkup = (
	iconValue: Object,
	{
		iconColor = '',
		iconSize = '',
		iconGap = '',
		iconPosition = '',
	}: RenderIconOptions = {}
): Promise<{ encodedIcon: string, icon: string }> => {
	const iconNode = document.createElement('span');
	document.querySelector('.blockera-temp-icon-wrapper')?.append(iconNode);
	const iconRoot = createRoot(iconNode);

	const color = iconColor;
	const isStrokeLibrary = isStrokeIconLibrary(iconValue.library);

	iconRoot.render(
		<Icon
			style={{
				color,
				...(!isStrokeLibrary && color ? { fill: color } : {}),
				width: iconSize ? iconSize : '1em',
				height: iconSize ? iconSize : '1em',
				...(iconPosition === 'start' && {
					marginRight: iconGap,
				}),
				...(iconPosition === 'end' && {
					marginLeft: iconGap,
				}),
			}}
			xmlns="http://www.w3.org/2000/svg"
			icon={iconValue.icon}
			library={iconValue.library}
			uploadSVG={iconValue.uploadSVG}
		/>
	);

	return new Promise((resolve) => {
		setTimeout(() => {
			const renderedIcon = encodeIconMarkup(iconNode?.innerHTML || '', {
				library: iconValue.library,
				color,
			});
			resolve(renderedIcon);
			iconRoot.unmount();
			iconNode.remove();
		}, 1);
	});
};

/**
 * Resolve icon color from core/icon canvas attributes (font color alias).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Resolved color value.
 */
export const getCoreIconColorFromAttributes = (attributes: Object): string =>
	getAttrValue(attributes?.blockeraFontColor) ||
	getAttrValue(attributes?.blockeraIconColor) ||
	'';

/**
 * Resolve icon size from core/icon canvas attributes (width alias).
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Resolved size value.
 */
export const getCoreIconSizeFromAttributes = (attributes: Object): string =>
	getAttrValue(attributes?.blockeraWidth) ||
	getAttrValue(attributes?.blockeraIconSize) ||
	'';
