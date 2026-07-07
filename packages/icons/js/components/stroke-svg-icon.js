/**
 * Renders stroke-based SVG icons from HTML strings (Feather, Lucide).
 *
 * @param {Object} props          Component props.
 * @param {string} props.svg        SVG markup string.
 * @param {number} props.iconSize   Icon width/height in pixels.
 * @param {Object} props.style      Inline styles.
 * @param {string} props.className  CSS class name.
 * @return {JSX.Element} Rendered SVG wrapper.
 */
export function StrokeSvgIcon({
	svg,
	iconSize = 24,
	style = {},
	className,
	...props
}) {
	if (!svg) {
		return <></>;
	}

	const sizedSvg = svg
		.replace(/\bwidth="[^"]*"/, `width="${iconSize}"`)
		.replace(/\bheight="[^"]*"/, `height="${iconSize}"`);

	return (
		<span
			className={['blockera-stroke-svg-icon', className]
				.filter(Boolean)
				.join(' ')}
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: iconSize,
				height: iconSize,
				lineHeight: 0,
				color: style?.color || 'currentColor',
				...style,
			}}
			dangerouslySetInnerHTML={{ __html: sizedSvg }}
			{...props}
		/>
	);
}
