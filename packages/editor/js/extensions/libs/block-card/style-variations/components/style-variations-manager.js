// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

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

export const StyleVariationsManager = ({
	isNotActive,
	blockStyles,
	editorStyles,
	setStyles,
	blockName,
	counter,
	setCounter,
	setCurrentBlockStyleVariation,
	setCurrentActiveStyle,
	setBlockStyles,
	activeStyle,
	onSelectStylePreview,
	setCurrentPreviewStyle,
	styleItemHandler,
}: {
	counter: number,
	setCounter: (counter: number) => void,
	isNotActive?: boolean,
	blockStyles: Array<Object>,
	editorStyles: Array<Object>,
	setStyles: (styles: Array<Object>) => void,
	blockName: string,
	setCurrentBlockStyleVariation: (style: Object) => void,
	setCurrentActiveStyle: (style: Object) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	activeStyle: Object,
	onSelectStylePreview: (style: Object) => void,
	setCurrentPreviewStyle: (style: Object) => void,
	styleItemHandler: (style: Object) => void,
}): MixedElement => {
	return (
		<PanelBodyControl
			title={__('Style Variations', 'blockera')}
			initialOpen={true}
			icon={
				<Icon
					icon="style-variations-animated"
					iconSize={24}
					isAnimated={true}
				/>
			}
			className={extensionClassNames('style-variations')}
		>
			<div
				className={componentInnerClassNames('block-style-variations', {
					'blockera-control-is-not-active': isNotActive,
					'design-large': true,
				})}
			>
				{blockStyles.map((style) => (
					<StyleItem
						counter={counter}
						setCounter={setCounter}
						key={style.name}
						style={style}
						blockName={blockName}
						blockStyles={blockStyles}
						setBlockStyles={setBlockStyles}
						activeStyle={activeStyle}
						setCurrentActiveStyle={setCurrentActiveStyle}
						inGlobalStylesPanel={true}
						onSelectStylePreview={onSelectStylePreview}
						setCurrentPreviewStyle={setCurrentPreviewStyle}
						styleItemHandler={styleItemHandler}
					/>
				))}

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
					counter={counter}
					setCounter={setCounter}
					design="with-label"
					label={__('Add New Style Variation', 'blockera')}
					styles={editorStyles}
					setStyles={setStyles}
					blockName={blockName}
					blockStyles={blockStyles}
					setCurrentBlockStyleVariation={
						setCurrentBlockStyleVariation
					}
					setCurrentActiveStyle={setCurrentActiveStyle}
					setBlockStyles={setBlockStyles}
				/>
			</div>
		</PanelBodyControl>
	);
};
