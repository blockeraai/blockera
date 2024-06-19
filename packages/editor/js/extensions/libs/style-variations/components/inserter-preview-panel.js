// @flow
/**
 * External dependencies
 */
import {
	isReusableBlock,
	createBlock,
	getBlockFromExample,
} from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { BlockPreview } from '@wordpress/block-editor';
import type { MixedElement } from 'react';

// It's a clone of '@wordpress/block-editor/js/components/inserter/preview-panel'
function InserterPreviewPanel({ item }: { item: Object }): MixedElement {
	const { name, title, description, initialAttributes, example } = item;

	const isReusable = isReusableBlock(item);

	return (
		<div className="block-editor-inserter__preview-container">
			<div className="block-editor-inserter__preview">
				{isReusable || example ? (
					<div className="block-editor-inserter__preview-content">
						<BlockPreview
							blocks={
								example
									? getBlockFromExample(name, {
											attributes: {
												...example.attributes,
												...initialAttributes,
											},
											innerBlocks: example.innerBlocks,
									  })
									: createBlock(name, initialAttributes)
							}
							viewportWidth={example?.viewportWidth ?? 500}
							additionalStyles={[
								{ css: 'body { padding: 16px; }' },
							]}
						/>
					</div>
				) : (
					<div className="block-editor-inserter__preview-content-missing">
						{__('No Preview Available.')}
					</div>
				)}
			</div>

			{!isReusable && (
				<div className="block-editor-block-card">
					<div className="block-editor-block-card__content">
						<h2 className="block-editor-block-card__title">
							{title}
						</h2>
						<span className="block-editor-block-card__description">
							{description}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

export default InserterPreviewPanel;
