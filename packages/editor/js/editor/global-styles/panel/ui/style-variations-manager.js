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

export const StyleVariationsManager = (): MixedElement => {
	const { blockStyles, isNotActive } = useBlockStylesPickerContext();

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
					{__('Style Variations', 'blockera')}

					<AddNewStyleButton
						design="no-label"
						style={{ marginLeft: 'auto' }}
					/>
				</>
			}
			initialOpen={true}
			icon={<Icon icon="extension-style-variations" iconSize={20} />}
			className={extensionClassNames('style-variations')}
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
					{__(
						'Create style presets for blocks and apply them instantly across multiple blocks or pages.',
						'blockera'
					)}
				</p>

				<AddNewStyleButton
					design="with-label"
					label={__('Add New Style', 'blockera')}
				/>
			</div>
		</PanelBodyControl>
	);
};
