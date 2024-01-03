// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { Icon } from '@publisher/components';

export const Preview = ({ refId }: { refId: Object }): MixedElement => {
	return (
		<a
			href={refId.current.previewElement.href}
			target={'_blank'}
			rel="noreferrer"
		>
			<Icon
				className={'publisher-canvas-preview-link'}
				library={'wp'}
				icon={'external'}
			/>
		</a>
	);
};
