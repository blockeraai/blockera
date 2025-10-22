// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

export const filterSetAttributes = () => {
	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.features.icon.setAttributes',
		(attributes, attributeId, newValue) => {
			if (
				!attributes?.className?.includes('blockera-is-icon-block') ||
				!attributes?.blockeraIcon?.value
			) {
				return attributes;
			}

			let svg = atob(
				newValue?.renderedIcon ||
					attributes?.blockeraIcon?.value?.renderedIcon
			);

			// Refactored: Merge/override style attribute to avoid conflicts, but keep previous svg style value and merge with current calculation
			if (svg.includes('<svg')) {
				const styleMatch = svg.match(/<svg\s+([^>]*?)style="([^"]*)"/);
				const prevStyleString = styleMatch ? styleMatch[2] : '';
				const prevStyleObj = {};

				// Parse existing style string into an object
				if (prevStyleString) {
					prevStyleString.split(';').forEach((rule) => {
						const [key, value] = rule
							.split(':')
							.map((s) => s && s.trim());
						if (key && value) {
							prevStyleObj[key] = value;
						}
					});
				}

				// We'll clone prevStyleObj to styleObj, and then apply/override as needed
				const styleObj = { ...prevStyleObj };

				// Prepare transform fragments to merge
				let transformFragments = [];
				if (styleObj.transform) {
					// Split by spaces, but keep function groups together
					// e.g. "rotate(10deg) scaleX(-1)" => ["rotate(10deg)", "scaleX(-1)"]
					transformFragments = styleObj.transform
						.split(/(?<=\))\s+/)
						.map((frag) => frag.trim())
						.filter(Boolean);
				}

				const removeTransformFn = (fnName) => {
					transformFragments = transformFragments.filter(
						(frag) => !frag.startsWith(fnName + '(')
					);
				};

				if (
					attributes?.blockeraIconSize?.value ||
					'blockeraIconSize' === attributeId
				) {
					const size =
						'blockeraIconSize' === attributeId
							? newValue
							: attributes?.blockeraIconSize?.value;

					if (size) {
						// Remove width and height attributes from the SVG tag and set new ones
						svg = svg
							.replace(/\swidth="[^"]*"/, '')
							.replace(/\sheight="[^"]*"/, '');
						svg = svg.replace(
							/<svg([^>]*)/,
							`<svg$1 width="${size}" height="${size}"`
						);
					}
				}
				if (
					attributes?.blockeraIconColor?.value ||
					'blockeraIconColor' === attributeId
				) {
					const color =
						'blockeraIconColor' === attributeId
							? newValue
							: attributes.blockeraIconColor.value;

					if (color) {
						styleObj.color = color;
						styleObj.fill = color;
					}
				}
				if (
					attributes?.blockeraIconRotate?.value ||
					'blockeraIconRotate' === attributeId
				) {
					const rotate =
						'blockeraIconRotate' === attributeId
							? newValue
							: attributes?.blockeraIconRotate?.value;

					if (rotate) {
						removeTransformFn('rotate');
						transformFragments.push(`rotate(${rotate}deg)`);
					}
				}
				if (
					attributes?.blockeraIconFlipVertical?.value ||
					'blockeraIconFlipVertical' === attributeId
				) {
					const scaleX =
						'blockeraIconFlipVertical' === attributeId
							? newValue
							: attributes?.blockeraIconFlipVertical?.value;

					if (scaleX) {
						removeTransformFn('scaleX');
						transformFragments.push('scaleX(-1)');
					}
				}
				if (
					attributes?.blockeraIconFlipHorizontal?.value ||
					'blockeraIconFlipHorizontal' === attributeId
				) {
					const scaleY =
						'blockeraIconFlipHorizontal' === attributeId
							? newValue
							: attributes?.blockeraIconFlipHorizontal?.value;

					if (scaleY) {
						removeTransformFn('scaleY');
						transformFragments.push('scaleY(-1)');
					}
				}

				// Merge transform fragments back into styleObj.transform
				if (
					[
						'blockeraIconRotate',
						'blockeraIconFlipVertical',
						'blockeraIconFlipHorizontal',
					].includes(attributeId)
				) {
					if (transformFragments.length > 0) {
						styleObj.transform = transformFragments.join(' ');
					} else {
						delete styleObj.transform;
					}
				}

				// Rebuild style string, keeping all previous and new/overridden values
				const newStyleString = Object.entries(styleObj)
					.map(([k, v]) => `${k}: ${v}`)
					.join('; ')
					.trim();

				if (styleMatch) {
					// Replace the style attribute in the svg
					svg = svg.replace(
						/<svg\s+([^>]*?)style="([^"]*)"/,
						`<svg $1style="${newStyleString}"`
					);
				} else {
					// Insert style attribute after <svg
					svg = svg.replace(
						/<svg\s?/,
						`<svg style="${newStyleString}" `
					);
				}
			}

			attributes.url = `data:image/svg+xml;utf8,${encodeURIComponent(
				svg
			)}`;

			return attributes;
		}
	);
};
