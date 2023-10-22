/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
import { mount } from 'cypress/react';
import '@cypress/code-coverage/support';
import { PanelBody, Popover, SlotFillProvider } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { ControlContextProvider } from '@publisher/controls';

/**
 * Internal dependencies
 */
import './commands';

/**
 * Style dependencies
 */
import '../../packages/controls/src/style.scss';
import '../../.storybook/styles/style.lazy.scss';
import '../../packages/components/src/style.scss';
import { WithControlDataProvider } from './components/providers/control-provider/with-control-data-provider';

Cypress.Commands.add('mount', mount);

Cypress.Commands.add('withInspector', (component) => {
	mount(
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
							<PanelBody>{component}</PanelBody>
						</div>
					</div>
				</div>
			</div>
			<Popover.Slot />
		</SlotFillProvider>
	);
});

Cypress.Commands.add('withDataProvider', ({ component, store, value }) => {
	cy.withInspector(
		<ControlContextProvider
			storeName={store}
			value={{
				name: nanoid(),
				value,
			}}
		>
			<WithControlDataProvider
				contextValue={value}
				children={component}
			/>
		</ControlContextProvider>
	);
});
