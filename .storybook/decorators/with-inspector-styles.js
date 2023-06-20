/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { PanelBody, Popover, SlotFillProvider } from '@wordpress/components';

import styles from '../playground-styles/style.lazy.scss';

export const WithInspectorStyles = (Story, context) => {
	useEffect(() => {
		styles.use();

		return styles.unuse;
	}, []);

	return (
		<div className="playground__sidebar playground__sidebar-standalone">
			<div className={'block-editor-block-inspector'}>
				<div className="block-editor-block-inspector__tabs">
					<div
						aria-labelledby="tab-panel-0-settings"
						role="tabpanel"
						id="tab-panel-0-settings-view"
						className="components-tab-panel__tab-content"
					>
						<SlotFillProvider>
							<PanelBody>
								<Story {...context} />
							</PanelBody>
							<Popover.Slot name={'Popover'} />
						</SlotFillProvider>
					</div>
				</div>
			</div>
		</div>
	);
};
