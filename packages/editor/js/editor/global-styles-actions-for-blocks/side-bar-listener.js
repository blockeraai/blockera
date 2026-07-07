// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createPortal } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { getDualGlobalStylesSelector } from '@blockera/global-styles-ui/panel-override/selectors';

/**
 * Internal dependencies
 */
import { BlockIcon } from '../../extensions/components/block-icon';

export const getBlockTypeSelector = (blockName: string): string => {
	return `button[id="/blocks/${blockName.replace('/', '%2F')}"]`;
};

export const AddBlockTypeIcons = ({
	blockTypes,
}: {
	blockTypes: Array<Object>,
}): Array<MixedElement> => {
	return blockTypes.map((blockType, index) => {
		if (!blockType.attributes?.blockeraPropsId) {
			return <></>;
		}

		const blockElement = document.querySelector(
			getBlockTypeSelector(blockType.name)
		);

		if (!blockElement) {
			return <></>;
		}

		return createPortal(
			<span
				className="blockera-block-icon-wrapper"
				data-test={`block-icon-${blockType.name.replace('/', '-')}`}
				key={index + '-block-icon'}
			>
				<BlockIcon name={blockType.name} />
			</span>,
			blockElement
		);
	});
};

export const sidebarSelector: string = `${getDualGlobalStylesSelector(
	'blockTypesSearch'
)} input[type="search"]`;
