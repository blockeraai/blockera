// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';

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
	setCurrentBlockStyleVariation,
	setCurrentActiveStyle,
	setBlockStyles,
	activeStyle,
	onSelectStylePreview,
	setCurrentPreviewStyle,
	styleItemHandler,
}: {
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
		<Flex
			className={componentClassNames('block-styles', {
				'blockera-control-is-not-active': isNotActive,
			})}
			direction="column"
			gap="20px"
		>
			<Flex direction="column" gap="10px">
				<AddNewStyleButton
					styles={editorStyles}
					setStyles={setStyles}
					blockName={blockName}
					label={__('Style Variations', 'blockera')}
					blockStyles={blockStyles}
					setCurrentBlockStyleVariation={
						setCurrentBlockStyleVariation
					}
					setCurrentActiveStyle={setCurrentActiveStyle}
					setBlockStyles={setBlockStyles}
				/>

				<div
					className={componentInnerClassNames(
						'block-styles__variants'
					)}
				>
					{blockStyles.map((style) => (
						<StyleItem
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
				</div>
			</Flex>
		</Flex>
	);
};
