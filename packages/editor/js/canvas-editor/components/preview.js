// @flow

/**
 * External dependencies
 */
import { PostPreviewButton } from '@wordpress/editor';
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Tooltip } from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';

export const Preview = (): MixedElement => {
	const previewButton = (
		<PostPreviewButton
			textContent={
				<Icon
					className={'blockera-canvas-preview-link'}
					library={'wp'}
					icon={'external'}
					iconSize={22}
				/>
			}
		/>
	);

	if (!previewButton) {
		return <></>;
	}

	return (
		<Tooltip text={__('Preview in new tab', 'blockera')} placement="bottom">
			<div
				className={controlInnerClassNames('canvas-editor-preview-link')}
			>
				{previewButton}
			</div>
		</Tooltip>
	);
};
