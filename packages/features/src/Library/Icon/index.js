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
import { IconStyles } from './extension/styles';
import { IconExtension } from './extension/extension';
import type { TEditBlockHTMLArgs, TFeature } from '../../Js/types';

const editBlockHTML = ({
	// name,
	clientId,
	blockRefId,
	attributes,
}: // featureConfig,
TEditBlockHTMLArgs): void => {
	if (!experimental().get('editor.extensions.iconExtension')) {
		return;
	}

	const {
		blockeraIcon,
		blockeraIconSize = '',
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
	iconNode.style.display = 'inline-flex';
	iconNode.style.alignItems = 'center';
	iconNode.style.verticalAlign = 'middle';

	const icon = createRoot(iconNode);
	icon.render(
		<Icon
			style={{
				fill: blockeraIconColor || 'currentColor',
				color: blockeraIconColor || 'inherit',
				marginLeft:
					'right' === blockeraIconPosition || !blockeraIconPosition
						? blockeraIconGap
						: 0,
				marginRight:
					'left' === blockeraIconPosition ? blockeraIconGap : 0,
			}}
			{...(blockeraIcon ?? {})}
			iconSize={blockeraIconSize || '1em'}
		/>
	);

	if (el.querySelector('.blockera-icon')) {
		el.querySelector('.blockera-icon')?.remove();
	}

	if ('left' === blockeraIconPosition) {
		el.querySelector('*[role="textbox"]')?.prepend(iconNode);
	} else if (['right', ''].includes(blockeraIconPosition)) {
		el.querySelector('*[role="textbox"]')?.append(iconNode);
	}
};

const IconFeature: TFeature = {
	name: 'icon',
	editBlockHTML,
	styleGenerator: IconStyles,
	isEnabled: (): boolean => true,
	extensionConfigId: 'iconConfig',
	ExtensionComponent: IconExtension,
};

export default IconFeature;
