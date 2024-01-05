// @flow

/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { BlockCard } from './block-card';
import type { TBlockProps } from '../../types';
import StatesManager from '../../block-states/components/states-manager';

export function BlockCardWrapper({
	block,
}: {
	block: TBlockProps,
}): MixedElement {
	useEffect(() => {
		document.querySelector('.block-editor-block-card')?.remove();

		document
			.querySelector(
				'.block-editor-block-inspector > .block-editor-block-variation-transforms'
			)
			?.remove();
	}, []);

	return (
		<div className="publisher-block-card-wrapper">
			<BlockCard clientId={block.clientId}>
				<StatesManager
					states={block.attributes.publisherBlockStates}
					block={{
						clientId: block.clientId,
						supports: block.supports,
						blockName: block.blockName,
						attributes: block.attributes,
						setAttributes: block.setAttributes,
					}}
				/>
			</BlockCard>
		</div>
	);
}
