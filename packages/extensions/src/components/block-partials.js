/**
 * External dependencies
 */
import { Slot } from '@wordpress/components';
import { useEffect, memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { prependPortal } from '@publisher/utils';

export const BlockPartials = memo(() => {
	useEffect(() => {
		document.querySelector('.block-editor-block-card')?.remove();

		document
			.querySelector(
				'.block-editor-block-inspector > .block-editor-block-variation-transforms'
			)
			?.remove();
	}, []);

	return (
		<>
			{prependPortal(
				<>
					<div className="publisher-block-card-wrapper">
						<Slot name={'publisher-block-card-content'} />
					</div>
					<div className="publisher-block-edit-wrapper">
						<Slot name={'publisher-block-edit-content'} />
					</div>
				</>,
				document.querySelector('.block-editor-block-inspector')
			)}
		</>
	);
});
