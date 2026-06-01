// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { PanelBodyControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { StyleItem } from './style-item';
import { AddNewStyleButton } from './add-new-style-button';
import { useBlockStylesPickerContext } from '../context';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../variation-surfaces';

export const StyleVariationsManager = (): MixedElement => {
	const {
		blockStyles,
		isNotActive,
		variationSurface = VARIATION_SURFACE_STYLE,
	} = useBlockStylesPickerContext();

	const isSizeSurface = variationSurface === VARIATION_SURFACE_SIZE;

	const memoizedStyles = useMemo(
		() =>
			blockStyles.map((style) => (
				<StyleItem
					key={style.name}
					style={style}
					inGlobalStylesPanel={true}
				/>
			)),
		[blockStyles]
	);

	return (
		<PanelBodyControl
			title={
				<>
					{isSizeSurface
						? __('Size Variations', 'blockera')
						: __('Style Variations', 'blockera')}

					<AddNewStyleButton
						design="no-label"
						style={{ marginLeft: 'auto' }}
					/>
				</>
			}
			initialOpen={true}
			icon={
				<Icon
					icon={
						isSizeSurface
							? 'extension-size'
							: 'extension-style-variations'
					}
					iconSize={20}
				/>
			}
			className={extensionClassNames(
				isSizeSurface ? 'size-variations' : 'style-variations'
			)}
			accordion={false}
		>
			<div
				className={componentInnerClassNames('block-style-variations', {
					'blockera-control-is-not-active': isNotActive,
					'design-large': true,
				})}
			>
				{memoizedStyles}

				<p
					className={componentInnerClassNames(
						'block-style-variations-description'
					)}
				>
					{isSizeSurface
						? __(
								'Define size presets stored as block style variations with a dedicated type, and edit them independently of main style variations.',
								'blockera'
							)
						: __(
								'Create style presets for blocks and apply them instantly across multiple blocks or pages.',
								'blockera'
							)}
				</p>

				<AddNewStyleButton
					design="with-label"
					label={
						isSizeSurface
							? __('Add Size Variations', 'blockera')
							: __('Add Style Variations', 'blockera')
					}
				/>
			</div>
		</PanelBodyControl>
	);
};
