// @flow

/**
 * External dependencies
 */
import type { ComponentType, MixedElement } from 'react';
import { memo, useMemo } from '@wordpress/element';
import { SVG, Rect, Path } from '@wordpress/primitives';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { CoreIconLinkToolbar } from './core-icon-link-toolbar';
import { CoreIconInspectorControls } from './core-icon-inspector-controls';

import './core-icon-canvas-edit.css';

/**
 * Internal dependencies
 */
import {
	getBlockeraIconValue,
	getCoreIconAriaLabel,
	getCustomIconSvgSource,
	getIconPresentationStyle,
	getResolvedIconSize,
	hasBlockeraIconValue,
	isCustomUploadedIcon,
} from './icon-attribute-utils';

/** Matches Gutenberg core/icon placeholder (edit.js). */
const IconPlaceholder = (): MixedElement => (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 60 60"
		preserveAspectRatio="none"
		fill="none"
		aria-hidden="true"
		className="wp-block-icon__placeholder blockera-core-icon-canvas-edit__placeholder"
		style={{ height: 'auto' }}
	>
		<Rect width="60" height="60" fill="currentColor" fillOpacity={0.1} />
		<Path
			vectorEffect="non-scaling-stroke"
			stroke="currentColor"
			strokeOpacity={0.25}
			d="M60 60 0 0"
		/>
	</SVG>
);

/**
 * Blockera-owned canvas edit for core/icon (replaces Gutenberg edit.js via canvasEdit).
 * className + align classes come from useBlockProps (includes syncIconBlockClassName output).
 */
export const CoreIconCanvasEdit: ComponentType<{
	attributes: Object,
	setAttributes: (Object) => void,
	clientId: string,
	isSelected?: boolean,
}> = memo(
	({ attributes, setAttributes, clientId, isSelected }): MixedElement => {
		const iconValue = useMemo(
			() => getBlockeraIconValue(attributes),
			[attributes]
		);
		const hasIcon = useMemo(
			() => hasBlockeraIconValue(iconValue),
			[iconValue]
		);
		const resolvedIconSize = useMemo(
			() => getResolvedIconSize(attributes),
			[attributes]
		);
		const iconStyle = useMemo(
			() => getIconPresentationStyle(attributes),
			[attributes]
		);
		const ariaLabel = useMemo(
			() => getCoreIconAriaLabel(attributes),
			[attributes]
		);

		const showSettingsInspector = hasIcon || Boolean(attributes?.icon);

		const customSvgMarkup = useMemo(() => {
			if (!isCustomUploadedIcon(iconValue)) {
				return '';
			}

			return getCustomIconSvgSource(iconValue);
		}, [iconValue]);

		let iconContent;

		if (!hasIcon) {
			iconContent = <IconPlaceholder />;
		} else if (customSvgMarkup) {
			iconContent = (
				<span
					className="blockera-core-icon-canvas-edit__custom-svg"
					style={{
						display: 'inline-flex',
						width: resolvedIconSize,
						height: resolvedIconSize,
						...iconStyle,
					}}
					dangerouslySetInnerHTML={{ __html: customSvgMarkup }}
				/>
			);
		} else {
			iconContent = (
				<Icon
					library={iconValue.library}
					icon={iconValue.icon}
					uploadSVG={iconValue.uploadSVG}
					iconSize={resolvedIconSize}
					style={iconStyle}
				/>
			);
		}

		return (
			<>
				<CoreIconInspectorControls
					attributes={attributes}
					setAttributes={setAttributes}
					isVisible={showSettingsInspector}
				/>
				<CoreIconLinkToolbar
					attributes={attributes}
					setAttributes={setAttributes}
					clientId={clientId}
					isSelected={isSelected}
					ariaLabel={ariaLabel}
				>
					{iconContent}
				</CoreIconLinkToolbar>
			</>
		);
	}
);

CoreIconCanvasEdit.displayName = 'CoreIconCanvasEdit';
