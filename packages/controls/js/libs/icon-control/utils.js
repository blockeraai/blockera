// @flow

/**
 * External dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { createRoot } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isString } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';
import {
	Icon,
	getIcon,
	iconSearch,
	isValidIcon,
	getIconLibraryIcons,
	getIconLibrary,
	getIconLibrarySearchData,
	prepareIconSvgForStorage,
	extractSvgMarkup,
	NativeIconLibrariesList,
	createStandardIconObject,
} from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Tooltip, Button } from '../';
import { FeatureWrapper } from '../feature-wrapper';
import ConditionalWrapper from '../conditional-wrapper';

/**
 * Whether the current icon value represents a custom SVG (not a library icon).
 *
 * @param {Object} icon The current icon state object.
 * @return {boolean} True when the icon is custom-uploaded or rendered-only custom.
 */
export function isCustomIcon(icon) {
	if (!icon) {
		return false;
	}

	if (icon.svgString && icon.svgString !== '') {
		return true;
	}

	if (icon.uploadSVG && icon.uploadSVG !== '') {
		if (typeof icon.uploadSVG === 'object' && icon.uploadSVG.url) {
			return true;
		}

		if (typeof icon.uploadSVG === 'string' && icon.uploadSVG !== '') {
			return true;
		}
	}

	// Pro-persisted custom icons may only retain renderedIcon.
	if (icon.renderedIcon && !icon.icon) {
		return true;
	}

	return false;
}

const SVG_PREVIEW_SIZE = 50;

/**
 * Whether SVG markup carries explicit fill colors (not currentColor / none).
 *
 * @param {string} svgMarkup Raw SVG markup.
 * @return {boolean} True when SVG has hardcoded fill paints.
 */
export function svgHasPreservedColors(svgMarkup) {
	if (!svgMarkup || typeof svgMarkup !== 'string') {
		return false;
	}

	const fills = new Set();
	const attrFills = svgMarkup.match(/\bfill=["']([^"']+)["']/gi) || [];

	for (const match of attrFills) {
		const value = match.replace(/^fill=["']/i, '').replace(/["']$/, '');

		if (
			value &&
			!['none', 'currentcolor', 'inherit', 'transparent'].includes(
				value.toLowerCase()
			)
		) {
			fills.add(value.toLowerCase());
		}
	}

	const styleFills = svgMarkup.match(/fill\s*:\s*([^;"'}]+)/gi) || [];

	for (const match of styleFills) {
		const value = match.replace(/fill\s*:\s*/i, '').trim();

		if (
			value &&
			!['none', 'currentcolor', 'inherit', 'transparent'].includes(
				value.toLowerCase()
			) &&
			!value.toLowerCase().startsWith('url(')
		) {
			fills.add(value.toLowerCase());
		}
	}

	return fills.size > 0;
}

/**
 * Ensure custom SVG preview markup has a definite render box in the sidebar control.
 *
 * @param {string} svgString Raw SVG markup.
 * @param {number} previewSize Preview box size in pixels.
 * @return {string} SVG markup sized for the icon control preview.
 */
export function prepareSvgForPreviewDisplay(
	svgString,
	previewSize = SVG_PREVIEW_SIZE
) {
	if (!svgString || typeof svgString !== 'string') {
		return '';
	}

	if (typeof document === 'undefined') {
		return svgString;
	}

	const template = document.createElement('template');
	template.innerHTML = svgString.trim();
	const svg = template.content.querySelector('svg');

	if (!svg) {
		return svgString;
	}

	const width = svg.getAttribute('width');
	const height = svg.getAttribute('height');
	const hasViewBox = svg.hasAttribute('viewBox');

	if (!width && !height && hasViewBox) {
		svg.setAttribute('width', String(previewSize));
		svg.setAttribute('height', String(previewSize));
	} else if (!width && height) {
		svg.setAttribute('width', height);
	} else if (width && !height && hasViewBox) {
		svg.setAttribute('height', width);
	}

	return svg.outerHTML;
}

/**
 * Build draft SVG content from the current icon for the Custom Icon tab.
 *
 * @param {Object} icon The current icon state object.
 * @return {{ svgString: string, uploadSVG: ?Object }} Draft values for editing.
 */
export function getCustomSvgDraft(icon) {
	if (!icon) {
		return { svgString: '', uploadSVG: null };
	}

	if (icon.svgString) {
		return {
			svgString: icon.svgString,
			uploadSVG:
				icon.uploadSVG &&
				typeof icon.uploadSVG === 'object' &&
				icon.uploadSVG.url
					? icon.uploadSVG
					: null,
		};
	}

	if (icon.renderedIcon && isString(icon.renderedIcon)) {
		try {
			return {
				svgString: atob(icon.renderedIcon),
				uploadSVG:
					icon.uploadSVG &&
					typeof icon.uploadSVG === 'object' &&
					icon.uploadSVG.url
						? icon.uploadSVG
						: null,
			};
		} catch (error) {
			return {
				svgString: '',
				uploadSVG:
					icon.uploadSVG &&
					typeof icon.uploadSVG === 'object' &&
					icon.uploadSVG.url
						? icon.uploadSVG
						: null,
			};
		}
	}

	return {
		svgString: '',
		uploadSVG: null,
	};
}

/**
 * Resolve FeatureWrapper type for custom icon upload controls.
 *
 * @return {'native'|'none'} Locked (`native`) on free; unlocked (`none`) when Pro filter is active.
 */
export function getCustomIconFeatureType() {
	return applyFilters(
		'blockera.controls.iconControl.customIcon.featureType',
		'native'
	);
}

/**
 * Whether custom icon file upload (drop / media library) is locked to PRO.
 *
 * @return {boolean} True on free; false when Pro filter unlocks uploads.
 */
export function isCustomIconUploadLocked() {
	return getCustomIconFeatureType() === 'native';
}

/**
 * Read the first dropped SVG file as text.
 *
 * @param {FileList|File[]} files   Dropped files.
 * @param {Function}        onRead  Callback with the SVG string.
 */
export function readSvgFromDroppedFiles(files, onRead) {
	if (!files?.length) {
		return;
	}

	const file = files[0];
	const isSvgFile =
		file.type === 'image/svg+xml' ||
		file.name?.toLowerCase().endsWith('.svg');

	if (!isSvgFile) {
		return;
	}

	const reader = new FileReader();

	reader.onload = () => {
		if (typeof reader.result === 'string') {
			onRead(reader.result);
		}
	};

	reader.readAsText(file);
}

const iconSearchMetadataCache = new Map();

/**
 * Look up icon metadata (title, tags) from library search data.
 *
 * @param {string}      iconName   Icon id.
 * @param {string}      library    Library id.
 * @param {Object|null} sourceMeta Optional metadata from search results.
 * @return {Object|null} Search metadata entry or null.
 */
export function getIconSearchMetadata(iconName, library, sourceMeta = null) {
	if (sourceMeta?.iconName) {
		return sourceMeta;
	}

	const cacheKey = `${library}:${iconName}`;

	if (iconSearchMetadataCache.has(cacheKey)) {
		return iconSearchMetadataCache.get(cacheKey);
	}

	const searchData = getIconLibrarySearchData(library);
	const found =
		searchData.find(
			(item) => item.iconName === iconName && item.library === library
		) ||
		searchData.find((item) => item.iconName === iconName) ||
		null;

	iconSearchMetadataCache.set(cacheKey, found);

	return found;
}

/**
 * Human-readable display name for a library icon.
 *
 * @param {string}      iconName   Icon id.
 * @param {string}      library    Library id.
 * @param {Object|null} sourceMeta Optional metadata from search results.
 * @return {string} Display name.
 */
export function getLibraryIconDisplayName(
	iconName,
	library,
	sourceMeta = null
) {
	const meta = getIconSearchMetadata(iconName, library, sourceMeta);

	return meta?.title || iconName;
}

/**
 * Human-readable display name for an icon library.
 *
 * @param {string} library Library id.
 * @return {string} Library display name.
 */
export function getLibraryDisplayName(library) {
	const libraryInfo = getIconLibrary(library);

	return libraryInfo?.[library]?.name || library;
}

/**
 * Resolve icon size for library footer / grid previews.
 *
 * @param {string} library Library id.
 * @return {number} Icon size in pixels.
 */
export function getLibraryIconPreviewSize(library) {
	return [
		'faregular',
		'fasolid',
		'fabrands',
		'feather',
		'lucide',
		'untitledui',
		'tabler',
		'tabler-filled',
	].includes(library)
		? 18
		: 24;
}

/**
 * Build rich tooltip content for a library grid icon.
 *
 * @param {string}      iconName   Icon id.
 * @param {string}      library    Library id.
 * @param {Object|null} sourceMeta Optional metadata from search results.
 * @return {Object} React tooltip content node.
 */
export function buildIconLibraryTooltipContent(
	iconName,
	library,
	sourceMeta = null
) {
	const meta = getIconSearchMetadata(iconName, library, sourceMeta);
	const name = meta?.title || iconName;
	const tags =
		meta?.tags && meta.tags.length > 0
			? meta.tags.join(', ')
			: __('—', 'blockera');
	const libraryInfo = getIconLibrary(library);
	const libraryName = libraryInfo?.[library]?.name || library;

	return (
		<div className={controlInnerClassNames('icon-library-tooltip')}>
			<div
				className={controlInnerClassNames('icon-library-tooltip__row')}
			>
				<span
					className={controlInnerClassNames(
						'icon-library-tooltip__label'
					)}
				>
					{__('Name', 'blockera')}:
				</span>{' '}
				{name}
			</div>
			<div
				className={controlInnerClassNames('icon-library-tooltip__row')}
			>
				<span
					className={controlInnerClassNames(
						'icon-library-tooltip__label'
					)}
				>
					{__('ID', 'blockera')}:
				</span>{' '}
				{iconName}
			</div>
			<div
				className={controlInnerClassNames('icon-library-tooltip__row')}
			>
				<span
					className={controlInnerClassNames(
						'icon-library-tooltip__label'
					)}
				>
					{__('Library', 'blockera')}:
				</span>{' '}
				{libraryName}
			</div>
			<div
				className={controlInnerClassNames('icon-library-tooltip__row')}
			>
				<span
					className={controlInnerClassNames(
						'icon-library-tooltip__label'
					)}
				>
					{__('Tags', 'blockera')}:
				</span>{' '}
				{tags}
			</div>
		</div>
	);
}

/**
 * Convert a library icon to SVG markup via toSvg when available.
 *
 * @param {Object} iconObject Icon object from getIcon().
 * @param {string} library    Library id.
 * @return {string} SVG markup or empty string.
 */
function libraryIconToSvgMarkupFromObject(iconObject, library) {
	if (!iconObject) {
		return '';
	}

	const iconData = iconObject?.icon ?? iconObject;

	if (iconData?.toSvg) {
		const svg = iconData.toSvg({
			width: 24,
			height: 24,
			'stroke-width': 2,
		});
		const markup =
			typeof svg === 'string'
				? svg
				: svg?.outerHTML || svg?.toString?.() || '';

		return prepareIconSvgForStorage(extractSvgMarkup(markup), library);
	}

	if (typeof iconData === 'string' && iconData.trim().startsWith('<')) {
		return prepareIconSvgForStorage(extractSvgMarkup(iconData), library);
	}

	return '';
}

/**
 * Convert a library icon to a sanitized SVG string (sync path when possible).
 *
 * @param {Object} options        Options.
 * @param {string} options.icon   Icon id.
 * @param {string} options.library Library id.
 * @return {string} Sanitized SVG string or empty string.
 */
export function libraryIconToSvgString({ icon, library }) {
	const iconObject = getIcon(icon, library);
	const markup = libraryIconToSvgMarkupFromObject(iconObject, library);

	if (!markup) {
		return '';
	}

	return sanitizeRawSVGString(markup);
}

/**
 * Convert a library icon to a sanitized SVG string, rendering off-DOM when needed.
 *
 * @param {Object} options        Options.
 * @param {string} options.icon   Icon id.
 * @param {string} options.library Library id.
 * @return {Promise<string>} Sanitized SVG string.
 */
export function libraryIconToSvgStringAsync({ icon, library }) {
	const syncResult = libraryIconToSvgString({ icon, library });

	if (syncResult) {
		return Promise.resolve(syncResult);
	}

	if (typeof document === 'undefined' || !document.body) {
		return Promise.resolve('');
	}

	return new Promise((resolve) => {
		const iconNode = document.createElement('span');
		document.body.appendChild(iconNode);
		const iconRoot = createRoot(iconNode);

		iconRoot.render(<Icon icon={icon} library={library} iconSize={24} />);

		window.setTimeout(() => {
			const html = iconNode.innerHTML || '';
			const markup = prepareIconSvgForStorage(
				extractSvgMarkup(html),
				library
			);
			const svgString = sanitizeRawSVGString(markup);

			iconRoot.unmount();
			iconNode.remove();
			resolve(svgString);
		}, 1);
	});
}

/**
 * Whether a library icon click should be ignored (Pro icons in free tier).
 *
 * @param {Object} event Click event from an icon grid cell.
 * @return {boolean} True when the click targets a locked Pro icon.
 */
export function isProIconClickBlocked(event) {
	let target = event?.target;

	if (!target) {
		return false;
	}

	if ('SVG' !== target.nodeName) {
		target = target.closest('svg');
	}

	return target?.classList?.contains('blockera-is-pro-icon');
}

export function getLibraryIcons({
	library,
	query,
	onClick = () => {},
	onDoubleClick = () => {},
	limit = 21,
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
		const sourceMeta = iconLibraryIcons[iconKey];
		const icon = createStandardIconObject(
			iconKey,
			iconLibraryIcons[iconKey]?.library
				? iconLibraryIcons[iconKey]?.library
				: library,
			iconLibraryIcons[iconKey]
		);

		if (isValidIcon(icon, iconKey)) {
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
							'icon-' + icon.iconName
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
						onDoubleClick={(event) =>
							onDoubleClick(event, {
								type: 'UPDATE_ICON',
								icon: icon.iconName,
								library: icon.library,
							})
						}
					>
						<Tooltip
							text={buildIconLibraryTooltipContent(
								icon.iconName,
								icon.library,
								sourceMeta
							)}
							width="220px"
						>
							<Icon
								library={icon.library}
								icon={icon}
								iconSize={
									[
										'faregular',
										'fasolid',
										'fabrands',
										'feather',
										'lucide',
										'untitledui',
										'tabler',
										'tabler-filled',
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
	}

	return iconsStack;
}

/**
 * Build React elements for recently used icons grid.
 *
 * @param {Object}   options              Options.
 * @param {Array}    options.items        Recent icon storage entries.
 * @param {Function} options.onSelect     Click handler (event, action).
 * @param {Function} options.onDoubleSelect Double-click handler (event, action).
 * @param {Function} options.onRemove     Remove handler (id).
 * @return {Array} React elements.
 */
export function buildRecentIconElements({
	items = [],
	onSelect = () => {},
	onDoubleSelect = () => {},
	onRemove = () => {},
}) {
	const elements = [];

	for (const entry of items) {
		if (entry.type === 'library') {
			const icon = getIcon(entry.icon, entry.library);

			if (!icon || !isValidIcon(icon, entry.icon)) {
				continue;
			}

			const iconType = applyFilters(
				'blockera.controls.iconControl.utils.getLibraryIcons.type',
				NativeIconLibrariesList.includes(entry.library)
					? 'native'
					: 'none',
				entry.library
			);

			elements.push(
				<ConditionalWrapper
					key={entry.id}
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
							'recent-icon-item',
							'library-' + icon.library,
							'icon-' + icon.iconName
						)}
						aria-label={sprintf(
							// translators: %s is icon ID in icon libraries for example arrow-left
							__('%s Icon', 'blockera'),
							icon.iconName
						)}
						onClick={(event) =>
							onSelect(event, {
								type: 'UPDATE_ICON',
								icon: icon.iconName,
								library: icon.library,
							})
						}
						onDoubleClick={(event) =>
							onDoubleSelect(event, {
								type: 'UPDATE_ICON',
								icon: icon.iconName,
								library: icon.library,
							})
						}
					>
						<Button
							className={controlInnerClassNames(
								'recent-icon-remove'
							)}
							label={__('Remove from recently used', 'blockera')}
							noBorder={true}
							icon={
								<Icon icon="close" library="ui" iconSize={12} />
							}
							onClick={(event) => {
								event.stopPropagation();
								onRemove(entry.id);
							}}
							showTooltip={true}
						/>

						<Tooltip
							text={buildIconLibraryTooltipContent(
								icon.iconName,
								icon.library
							)}
							width="220px"
						>
							<Icon
								library={icon.library}
								icon={icon}
								iconSize={
									[
										'faregular',
										'fasolid',
										'fabrands',
										'feather',
										'lucide',
										'untitledui',
										'tabler',
										'tabler-filled',
									].includes(icon.library)
										? 18
										: 24
								}
							/>
						</Tooltip>
					</span>
				</ConditionalWrapper>
			);

			continue;
		}

		if (entry.type === 'custom') {
			const label =
				entry.uploadSVG &&
				typeof entry.uploadSVG === 'object' &&
				entry.uploadSVG.title
					? entry.uploadSVG.title.replaceAll('-', ' ')
					: __('Custom icon', 'blockera');

			let preview = null;

			if (entry.svgString) {
				preview = (
					<div
						className={controlInnerClassNames(
							'recent-icon-custom-preview'
						)}
						dangerouslySetInnerHTML={{
							__html: entry.svgString.replace(
								/\s*style\s*=\s*["'][^"']*["']/g,
								''
							),
						}}
					/>
				);
			} else if (
				entry.uploadSVG &&
				typeof entry.uploadSVG === 'object' &&
				entry.uploadSVG.url
			) {
				preview = <img src={entry.uploadSVG.url} alt={label} />;
			}

			if (!preview) {
				continue;
			}

			elements.push(
				<span
					key={entry.id}
					className={controlInnerClassNames(
						'icon-control-icon',
						'recent-icon-item',
						'is-custom'
					)}
					aria-label={label}
					onClick={(event) =>
						onSelect(event, {
							type: 'UPDATE_SVG',
							svgString: entry.svgString,
							uploadSVG: entry.uploadSVG || '',
						})
					}
				>
					<Button
						className={controlInnerClassNames('recent-icon-remove')}
						aria-label={__('Remove from recently used', 'blockera')}
						noBorder={true}
						icon={<Icon icon="close" library="ui" iconSize={12} />}
						onClick={(event) => {
							event.stopPropagation();
							onRemove(entry.id);
						}}
					/>
					<Tooltip text={label}>{preview}</Tooltip>
				</span>
			);
		}
	}

	return elements;
}

/**
 * Extract the single root SVG element from a parsed SVG document.
 * Tolerates XML declarations, comments, and other non-element nodes
 * before or after the root `<svg>` (common in Illustrator/Tabler exports).
 *
 * @param {Document} svgDoc Parsed SVG document.
 * @return {SVGSVGElement | null} Root svg element or null when invalid.
 */
function extractRootSvgElement(svgDoc) {
	if (!svgDoc || svgDoc.querySelector('parsererror')) {
		return null;
	}

	const root = svgDoc.documentElement;

	if (!root || root.nodeName.toLowerCase() !== 'svg') {
		return null;
	}

	// Reject multiple root-level `<svg>` siblings (security / malformed input).
	let svgCount = 0;

	for (let i = 0; i < svgDoc.childNodes.length; i++) {
		const node = svgDoc.childNodes[i];

		if (node.nodeType === 1 && node.nodeName.toLowerCase() === 'svg') {
			svgCount++;
		}
	}

	if (svgCount !== 1) {
		return null;
	}

	return /** @type {SVGSVGElement} */ (root);
}

/**
 * Whether an SVG root has enough structure to display in the icon picker.
 *
 * @param {Element} svgElement Root svg element.
 * @return {boolean} True when the SVG can be rendered.
 */
function isRenderableSvgElement(svgElement) {
	if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
		return false;
	}

	if (
		svgElement.hasAttribute('viewBox') ||
		(svgElement.hasAttribute('width') && svgElement.hasAttribute('height'))
	) {
		return true;
	}

	return (
		svgElement.querySelector(
			'path, rect, circle, ellipse, line, polyline, polygon, text, use, image, g'
		) !== null
	);
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

	const svgElement = extractRootSvgElement(svgDoc);

	if (!svgElement || !isRenderableSvgElement(svgElement)) {
		/* @debug-ignore */
		console.warn(
			'Invalid SVG structure: missing or non-renderable root svg element'
		);
		return '';
	}

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
