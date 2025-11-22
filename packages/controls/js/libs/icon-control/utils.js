// @flow

/**
 * External dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import {
	Icon,
	iconSearch,
	isValidIcon,
	getIconLibraryIcons,
	NativeIconLibrariesList,
	createStandardIconObject,
} from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Tooltip } from '../';
import { FeatureWrapper } from '../feature-wrapper';
import ConditionalWrapper from '../conditional-wrapper';

export function getLibraryIcons({
	library,
	query,
	onClick = () => {},
	limit = 21,
	isCurrentIcon = () => {
		return false;
	},
}) {
	let iconLibraryIcons = {};
	const iconsStack = [];

	if (
		'suggestions' === library ||
		'search' === library ||
		'search-2' === library
	) {
		switch (typeof query) {
			case 'function':
				iconLibraryIcons = iconSearch({
					query: query(),
					library: 'all',
					limit,
				});
				break;
			case 'object':
				iconLibraryIcons = query;
				break;
			case 'string':
				iconLibraryIcons = iconSearch({
					query,
					library: 'search-2' === library ? 'all2' : 'all',
					limit,
				});
				break;
		}
	} else {
		iconLibraryIcons = getIconLibraryIcons(library);
	}

	const iconType = applyFilters(
		'blockera.controls.iconControl.utils.getLibraryIcons.type',
		['search-2', ...NativeIconLibrariesList].includes(library)
			? 'native'
			: 'none',
		library
	);

	for (const iconKey in iconLibraryIcons) {
		const icon = createStandardIconObject(
			iconKey,
			iconLibraryIcons[iconKey]?.library
				? iconLibraryIcons[iconKey]?.library
				: library,
			iconLibraryIcons[iconKey]
		);

		if (isValidIcon(icon, iconKey))
			iconsStack.push(
				<ConditionalWrapper
					key={`${iconKey}-${icon.iconName}`}
					condition={iconType === 'native'}
					wrapper={(children) => (
						<FeatureWrapper
							className={controlInnerClassNames('icon-wrapper')}
							type={iconType}
						>
							{children}
						</FeatureWrapper>
					)}
				>
					<span
						className={controlInnerClassNames(
							'icon-control-icon',
							'library-' + icon.library,
							'icon-' + icon.iconName,
							isCurrentIcon(icon.iconName, icon.library)
								? 'icon-current'
								: ''
						)}
						aria-label={sprintf(
							// translators: %s is icon ID in icon libraries for example arrow-left
							__('%s Icon', 'blockera'),
							icon.iconName
						)}
						onClick={(event) =>
							onClick(event, {
								type: 'UPDATE_ICON',
								icon: icon.iconName,
								library: icon.library,
							})
						}
					>
						<Tooltip text={icon.iconName}>
							<Icon
								library={icon.library}
								icon={icon}
								iconSize={
									[
										'faregular',
										'fasolid',
										'fabrands',
									].includes(icon.library)
										? 18
										: 24
								}
							/>
						</Tooltip>
					</span>
				</ConditionalWrapper>
			);
	}

	return iconsStack;
}

export function sanitizeRawSVGString(rawString) {
	if (!rawString || typeof rawString !== 'string') {
		return '';
	}

	// Remove any potential CDATA sections that might contain malicious content
	const cleanedString = rawString.replace(/<!\[CDATA\[.*?\]\]>/gs, '');

	let svgDoc;
	try {
		svgDoc = new window.DOMParser().parseFromString(
			cleanedString,
			'image/svg+xml'
		);
	} catch (error) {
		// Handle parsing errors
		/* @debug-ignore */
		console.warn('SVG parsing error:', error);
		return '';
	}

	// Check for parsing errors
	if (svgDoc.querySelector('parsererror')) {
		/* @debug-ignore */
		console.warn('SVG contains parsing errors');
		return '';
	}

	// Validate that we have exactly one SVG element
	if (
		svgDoc.childNodes.length !== 1 ||
		svgDoc.firstChild.nodeName !== 'svg'
	) {
		/* @debug-ignore */
		console.warn('Invalid SVG structure: expected single SVG element');
		return '';
	}

	const svgElement = svgDoc.documentElement;

	// Sanitize the SVG element
	sanitizeSVGElement(svgElement);

	// Serialize the sanitized SVG
	let svgString = '';
	try {
		svgString = new window.XMLSerializer().serializeToString(svgElement);
	} catch (error) {
		/* @debug-ignore */
		console.warn('SVG serialization error:', error);
		return '';
	}

	return svgString;
}

function sanitizeSVGElement(svgElement) {
	// Define whitelist of allowed SVG elements
	const allowedElements = new Set([
		'svg',
		'g',
		'defs',
		'symbol',
		'use',
		'marker',
		'pattern',
		'clippath',
		'mask',
		'lineargradient',
		'radialgradient',
		'stop',
		'path',
		'rect',
		'circle',
		'ellipse',
		'line',
		'polyline',
		'polygon',
		'text',
		'tspan',
		'textpath',
		'image',
		'switch',
		'foreignobject',
		'title',
		'desc',
		'metadata',
		'style',
	]);

	// Define whitelist of allowed attributes
	const allowedAttributes = new Set([
		// Core attributes
		'id',
		'class',
		'style',
		'transform',
		'opacity',
		'fill',
		'stroke',
		'stroke-width',
		'stroke-linecap',
		'stroke-linejoin',
		'stroke-dasharray',
		'stroke-dashoffset',
		'fill-opacity',
		'stroke-opacity',
		'fill-rule',
		'clip-rule',
		'stroke-miterlimit',
		'vector-effect',
		'clip-path',
		'mask',
		'filter',
		'display',
		'visibility',
		'pointer-events',
		'cursor',
		'color',
		'color-interpolation',
		'color-interpolation-filters',
		'color-rendering',
		'image-rendering',
		'shape-rendering',
		'text-rendering',

		// SVG specific attributes
		'viewbox',
		'preserveaspectratio',
		'width',
		'height',
		'x',
		'y',
		'cx',
		'cy',
		'r',
		'rx',
		'ry',
		'x1',
		'y1',
		'x2',
		'y2',
		'points',
		'd',
		'pathlength',
		'font-family',
		'font-size',
		'font-weight',
		'font-style',
		'text-anchor',
		'dominant-baseline',
		'baseline-shift',
		'letter-spacing',
		'word-spacing',
		'text-decoration',
		'text-transform',
		'writing-mode',
		'glyph-orientation-horizontal',
		'glyph-orientation-vertical',
		'unicode-bidi',
		'direction',
		'text-rendering',

		// Gradient attributes
		'gradientunits',
		'gradienttransform',
		'spreadmethod',
		'xlink:href',
		'offset',
		'stop-color',
		'stop-opacity',

		// Pattern attributes
		'patternunits',
		'patterncontentunits',
		'patterntransform',

		// Clip and mask attributes
		'clippathunits',
		'maskunits',
		'maskContentUnits',

		// Image attributes
		'href',
		'xlink:href',
		'preserveaspectratio',

		// Animation attributes (basic support)
		'begin',
		'dur',
		'end',
		'repeatcount',
		'repeatdur',
		'restart',
		'fill',
		'calcmode',
		'values',
		'keytimes',
		'keysplines',
		'from',
		'to',
		'by',
		'attributename',
		'attributetype',
		'additive',
		'accumulate',
	]);

	// Remove dangerous elements and attributes
	removeDangerousContent(svgElement, allowedElements, allowedAttributes);
}

function removeDangerousContent(element, allowedElements, allowedAttributes) {
	// Remove dangerous elements
	const dangerousElements = [
		'script',
		'object',
		'embed',
		'iframe',
		'link',
		'meta',
	];
	dangerousElements.forEach((tagName) => {
		const elements = element.querySelectorAll(tagName);
		elements.forEach((el) => el.remove());
	});

	// Process all child elements
	const children = Array.from(element.children);
	children.forEach((child) => {
		// Remove element if not in whitelist
		if (!allowedElements.has(child.tagName.toLowerCase())) {
			child.remove();
			return;
		}

		// Remove dangerous attributes
		const attributes = Array.from(child.attributes);
		attributes.forEach((attr) => {
			const attrName = attr.name.toLowerCase();

			// Remove event handlers and dangerous attributes
			if (
				attrName.startsWith('on') || // Event handlers (onclick, onload, etc.)
				attrName.startsWith('javascript:') || // JavaScript URLs
				attrName.includes('expression') || // CSS expressions
				(attrName === 'href' &&
					attr.value.toLowerCase().startsWith('javascript:')) || // JavaScript href
				!allowedAttributes.has(attrName) // Not in whitelist
			) {
				child.removeAttribute(attr.name);
			}
		});

		// Recursively process child elements
		removeDangerousContent(child, allowedElements, allowedAttributes);
	});

	// Remove dangerous attributes from the current element
	const attributes = Array.from(element.attributes);
	attributes.forEach((attr) => {
		const attrName = attr.name.toLowerCase();

		if (
			attrName.startsWith('on') || // Event handlers
			attrName.startsWith('javascript:') || // JavaScript URLs
			attrName.includes('expression') || // CSS expressions
			(attrName === 'href' &&
				attr.value.toLowerCase().startsWith('javascript:')) || // JavaScript href
			!allowedAttributes.has(attrName) // Not in whitelist
		) {
			element.removeAttribute(attr.name);
		}
	});
}
