// @flow

/**
 * External dependencies
 */
import { createRoot } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { experimental } from '@blockera/env';
import { isEmpty, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import iconConfig from './icon.schema.json';
import type { TEditBlockHTMLArgs, TFeature } from '../../Js/types';

const allowedBlocks = Object.keys(iconConfig.blocks);

const editBlockHTML = ({
	name,
	clientId,
	blockRefId,
	attributes,
}: TEditBlockHTMLArgs): void => {
	if (
		!experimental().get('editor.extensions.iconExtension') ||
		!allowedBlocks.includes(name)
	) {
		return;
	}

	const {
		blockeraIcon,
		blockeraIconSize = 25,
		blockeraIconColor = '',
		blockeraIconGap = '5px',
		blockeraIconPosition = 'right',
	} = attributes;

	const blockElement = blockRefId.current;
	const el = blockElement.parentElement?.querySelector(`#block-${clientId}`);

	if (isUndefined(blockeraIcon) || isEmpty(blockeraIcon) || !el) {
		return;
	}

	// const root = createRoot(el);
	const iconNode = document.createElement('span');
	iconNode.classList.add('blockera-icon');
	const icon = createRoot(iconNode);
	const iconSize = blockeraIconSize.replace(/[a-z]+/g, '');

	icon.render(
		<Icon
			style={{
				fill: blockeraIconColor,
				color: blockeraIconColor,
				marginLeft: blockeraIconGap,
				marginRight: blockeraIconGap,
			}}
			{...(blockeraIcon ?? {})}
			size={iconSize}
		/>
	);

	if (el.querySelector('.blockera-icon')) {
		el.querySelector('.blockera-icon')?.remove();
	}

	if ('left' === blockeraIconPosition) {
		el.querySelector('div[role="textbox"]')?.prepend(iconNode);
	} else if (['right', ''].includes(blockeraIconPosition)) {
		el.querySelector('div[role="textbox"]')?.append(iconNode);
	}
};

const IconFeature: TFeature = {
	name: 'icon',
	editBlockHTML,
	isEnabled: (): boolean => true,
};

export default IconFeature;
