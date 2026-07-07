// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';
import {
	TextControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToolsPanel as ToolsPanel,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getCoreIconAriaLabel } from './icon-attribute-utils';

/** Class marker so use-block-side-effects does not hide Blockera-owned settings UI. */
export const BLOCKERA_CORE_ICON_SETTINGS_CLASS = 'blockera-core-icon-settings';

/** Matches block-library icon/edit.mjs useToolsPanelDropdownMenuProps. */
const useToolsPanelDropdownMenuProps = () => {
	const isMobile = useViewportMatch('medium', '<');

	return !isMobile
		? {
				popoverProps: {
					placement: 'left-start',
					offset: 259,
				},
			}
		: {};
};

/**
 * Settings inspector for core/icon — mirrors Gutenberg edit.js InspectorControls
 * (ariaLabel Label field) when Blockera canvasEdit replaces the core block edit.
 */
export const CoreIconInspectorControls = ({
	attributes,
	setAttributes,
	isVisible,
}: {
	attributes: Object,
	setAttributes: (Object) => void,
	isVisible: boolean,
}): MixedElement | null => {
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	if (!isVisible) {
		return null;
	}

	const ariaLabel = getCoreIconAriaLabel(attributes);

	return (
		<InspectorControls group="settings">
			<ToolsPanel
				label={__('Settings', 'blockera')}
				className={BLOCKERA_CORE_ICON_SETTINGS_CLASS}
				resetAll={() => setAttributes({ ariaLabel: undefined })}
				dropdownMenuProps={dropdownMenuProps}
			>
				<ToolsPanelItem
					label={__('Label', 'blockera')}
					isShownByDefault
					hasValue={() => !!ariaLabel}
					onDeselect={() => setAttributes({ ariaLabel: undefined })}
				>
					<TextControl
						label={__('Label', 'blockera')}
						help={__(
							'Briefly describe the icon to help screen reader users. Leave blank for decorative icons.',
							'blockera'
						)}
						value={ariaLabel || ''}
						onChange={(value) =>
							setAttributes({ ariaLabel: value })
						}
						__next40pxDefaultSize
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
};
