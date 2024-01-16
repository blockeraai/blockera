/**
 * External dependencies
 */
import { Slot } from '@wordpress/components';
import { useEffect, memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { prependPortal } from '@publisher/utils';

export const BlockPartials = memo(({ currentState, clientId }) => {
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
						<Slot
							name={`publisher-block-card-content-${clientId}`}
						/>
					</div>
					<div className="publisher-block-edit-wrapper">
						<Slot
							name={`publisher-master-block-${currentState}-edit-content-${clientId}`}
						/>
						<Slot
							name={`publisher-inner-block-${currentState}-edit-content-${clientId}`}
						/>
					</div>
				</>,
				document.querySelector('.block-editor-block-inspector')
			)}
		</>
	);
});
