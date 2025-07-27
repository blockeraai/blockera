// @flow

/**
 * External dependencies
 */
// import { select } from '@wordpress/data';
// import { createRoot } from '@wordpress/element';

/**
 * Blockera dependencies
 */
// import { Icon } from '@blockera/icons';
// import { experimental } from '@blockera/env';
// import { isEmpty, getIframeTag } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { icon } from './config';
import { IconStyles } from './extension/styles';
import { iconConfig } from './extension/supports';
import { IconExtension } from './extension/extension';
import type {
	// TEditBlockHTMLArgs,
	TFeature,
} from '@blockera/features-core/Js/types';

// const editBlockHTML = ({
// 	name,
// 	clientId,
// 	attributes,
// 	htmlEditable,
// 	getBlockCSSSelector,
// }: TEditBlockHTMLArgs): void => {
// 	const { status } = htmlEditable;

// 	if (!experimental().get('editor.extensions.iconExtension') || !status) {
// 		return;
// 	}

// 	const blockType = select('core/blocks').getBlockType(name);
// 	const selector = getBlockCSSSelector(blockType, 'htmlEditable.root');

// 	if (!selector) {
// 		return;
// 	}

// 	const {
// 		blockeraIcon,
// 		blockeraIconSize = '',
// 		blockeraIconColor = '',
// 		blockeraIconGap = '10px',
// 	} = attributes;

// 	// If icon is empty, don't render anything
// 	if (blockeraIcon?.icon === '' && blockeraIcon?.uploadSVG === '') {
// 		return;
// 	}

// 	const _selector: string = selector
// 		? selector.replace('{{ BLOCK_SELECTOR }}', `#block-${clientId}`)
// 		: `#block-${clientId}`;
// 	const directElement = document.querySelector(_selector);
// 	const el = directElement ? directElement : getIframeTag(_selector);

// 	// If element is not found, don't render anything
// 	if (!el) {
// 		return;
// 	}

// 	// const root = createRoot(el);
// 	const iconNode = document.createElement('span');
// 	iconNode.classList.add('blockera-icon');
// 	iconNode.style.display = 'inline-flex';
// 	iconNode.style.alignItems = 'center';
// 	iconNode.style.alignSelf = 'center';

// 	let { blockeraIconPosition } = attributes;
// 	if (isEmpty(blockeraIconPosition)) {
// 		blockeraIconPosition = 'left';
// 	}

// 	if ('right' === blockeraIconPosition) {
// 		iconNode.style.marginLeft = blockeraIconGap || '10px';
// 	} else if ('left' === blockeraIconPosition) {
// 		iconNode.style.marginRight = blockeraIconGap || '10px';
// 	}

// 	if (blockeraIconSize) {
// 		iconNode.style.verticalAlign = 'middle';
// 		iconNode.style.position = 'relative';
// 		iconNode.style.top = `-0.025em`;
// 	}

// 	const icon = createRoot(iconNode);
// 	icon.render(
// 		<Icon
// 			style={{
// 				...(!blockeraIconSize
// 					? {
// 							position: 'relative',
// 							top: `0.125em`,
// 					  }
// 					: {}),
// 				fill: blockeraIconColor || 'currentColor',
// 				color: blockeraIconColor || 'inherit',
// 			}}
// 			{...(blockeraIcon ?? {})}
// 			iconSize={blockeraIconSize || '1em'}
// 		/>
// 	);

// 	if (el.querySelector('.blockera-icon')) {
// 		el.querySelector('.blockera-icon')?.remove();
// 	}

// 	if ('left' === blockeraIconPosition) {
// 		el?.prepend(iconNode);
// 	} else if (['right', ''].includes(blockeraIconPosition)) {
// 		el?.append(iconNode);
// 	}
// }

export const Icon: TFeature = {
	name: 'icon',
	// editBlockHTML,
	styleGenerator: IconStyles,
	extensionSupports: iconConfig,
	extensionSupportId: 'iconConfig',
	ExtensionComponent: IconExtension,
	isEnabled: (status = icon.block.status): boolean => status,
};
export * from './helpers';
export { icon } from './config';
export { iconConfig } from './extension/supports';
