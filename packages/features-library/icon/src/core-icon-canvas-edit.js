// @flow

/**
 * External dependencies
 */
import type { ComponentType, MixedElement } from 'react';
import { memo, useEffect, useMemo } from '@wordpress/element';
import { SVG, Rect, Path } from '@wordpress/primitives';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import {
	getCoreIconCanvasAttributes,
	getCoreIconMigrationPatch,
} from '@blockera/blocks-core/js/libs/wordpress/icon/compatibility/core-icon-block-sync';
import { CoreIconBlockToolbar } from './core-icon-block-toolbar';
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
		const displayAttributes = useMemo(
			() => getCoreIconCanvasAttributes(attributes),
			[attributes]
		);

		useEffect(() => {
			const migrationPatch = getCoreIconMigrationPatch(attributes);

			if (migrationPatch) {
				setAttributes(migrationPatch);
			}
		}, [attributes, setAttributes]);

		const iconValue = useMemo(
			() => getBlockeraIconValue(displayAttributes),
			[displayAttributes]
		);
		const hasIcon = useMemo(
			() => hasBlockeraIconValue(iconValue),
			[iconValue]
		);
		const resolvedIconSize = useMemo(
			() => getResolvedIconSize(displayAttributes),
			[displayAttributes]
		);
		const iconStyle = useMemo(
			() => getIconPresentationStyle(displayAttributes),
			[displayAttributes]
		);
		const ariaLabel = useMemo(
			() => getCoreIconAriaLabel(displayAttributes),
			[displayAttributes]
		);

		const showSettingsInspector =
			hasIcon || Boolean(displayAttributes?.icon);

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
					attributes={displayAttributes}
					setAttributes={setAttributes}
					isVisible={showSettingsInspector}
				/>
				<CoreIconBlockToolbar
					attributes={displayAttributes}
					setAttributes={setAttributes}
					clientId={clientId}
					isSelected={isSelected}
					hasIcon={hasIcon}
					ariaLabel={ariaLabel}
				>
					{iconContent}
				</CoreIconBlockToolbar>
			</>
		);
	}
);

CoreIconCanvasEdit.displayName = 'CoreIconCanvasEdit';
