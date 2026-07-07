/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
import { select } from '@wordpress/data';
import { mount } from 'cypress/react';
import 'cypress-real-events/support';
import { PanelBody, Popover, SlotFillProvider } from '@wordpress/components';

/**
 *  dependencies
 */
import { STORE_NAME } from '@blockera/controls/js/store';
import { ControlContextProvider } from '@blockera/controls/js/context';

/**
 * Internal dependencies
 */
import { registerComponentCommands } from './component-commands';

/**
 * Style dependencies — pre-built CSS (no sass recompilation on rebuild).
 */
import '@wordpress/components/build-style/style.css';
import '@wordpress/block-editor/build-style/style.css';
import '@blockera/controls-styles-css';
import '../style.lazy.scss';
import { WithControlDataProvider } from './components/providers/control-provider/with-control-data-provider';
import { controlReducer } from '@blockera/controls/js/store/reducers/control-reducer';
import { modifyControlValue } from '@blockera/controls/js/store/actions';

registerComponentCommands();

beforeEach(() => {
	cy.viewport(1280, 900);
});

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

const handleOnChange = ({ value, store, name }) => {
	controlReducer(
		select(store).getControl(name),
		modifyControlValue({
			value,
			controlId: name,
		})
	);
};

Cypress.Commands.add(
	'withDataProvider',
	({
		component,
		store = STORE_NAME,
		value,
		name = nanoid(),
		onChange = handleOnChange,
		skipSyncValue = true,
	}) => {
		cy.withInspector(
			<ControlContextProvider
				storeName={store}
				value={{
					name,
					value,
					skipSyncValue,
				}}
			>
				<WithControlDataProvider
					contextValue={value}
					children={component}
					onChange={(_value) => {
						onChange({
							store,
							name,
							value: _value,
						});
					}}
				/>
			</ControlContextProvider>
		);
	}
);
