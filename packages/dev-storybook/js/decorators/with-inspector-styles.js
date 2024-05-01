/**
 * WordPress dependencies
 */
import { PanelBody, Popover, SlotFillProvider } from '@wordpress/components';

export const WithInspectorStyles = (Story, context) => {
	return (
		<SlotFillProvider>
			<div className="playground__sidebar playground__sidebar-standalone">
				<div className={'block-editor-block-inspector'}>
					<div className="block-editor-block-inspector__tabs">
						<div
							aria-labelledby="tab-panel-0-settings"
							role="tabpanel"
							id="tab-panel-0-settings-view"
							className="components-tab-panel__tab-content"
						>
							<PanelBody>
								<Story {...context} />
							</PanelBody>
						</div>
					</div>
				</div>
			</div>
			<Popover.Slot />
		</SlotFillProvider>
	);
};
