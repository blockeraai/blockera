// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import type { ControlContextRefCurrent } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	customCssFromWPCompatibility,
	customCssToWPCompatibility,
} from './compatibility/custom-css';
import type { BlockDetail } from '../block-card/block-states/types';
import { isInvalidCompatibilityRun } from '../utils';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.customStyleExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { insideBlockInspector, editorSelectedBlockEvent } =
				blockDetail;

			attributes = customCssFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.customStyleExtension.bootstrap.setAttributes',
		/**
		 * Convert blockeraCustomCSS to WordPress format when saving.
		 *
		 * Block Inspector: attributes.style.css
		 * Global Styles: blocks[blockName].css or blocks[blockName].variations[styleName].css
		 *
		 * @param {Object} nextState - Block attributes with blockera changes
		 * @param {string} featureId - Blockera feature identifier
		 * @param {*} newValue - New value from control
		 * @param {ControlContextRefCurrent} ref - Control context ref
		 * @param {Function} getAttributes - Getter for current attributes
		 * @param {BlockDetail} blockDetail - Block context
		 * @return {Object} Updated attributes with WP compatibility
		 */
		(
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRefCurrent,
			getAttributes: () => Object,
			blockDetail: BlockDetail
		): Object => {
			if (isInvalidCompatibilityRun(blockDetail, ref)) {
				return nextState;
			}

			const { insideBlockInspector, editorSelectedBlockEvent } =
				blockDetail;

			if ('blockeraCustomCSS' === featureId) {
				return mergeObject(
					nextState,
					customCssToWPCompatibility({
						newValue:
							'object' === typeof newValue &&
							null !== newValue?.value
								? newValue.value
								: newValue,
						ref,
						insideBlockInspector,
						editorSelectedBlockEvent,
					})
				);
			}

			return nextState;
		}
	);
};
