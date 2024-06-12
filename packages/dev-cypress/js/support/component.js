/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
import { select } from '@wordpress/data';
import { mount } from 'cypress/react';
import 'cypress-real-events/support';
import '@cypress/code-coverage/support';
import { PanelBody, Popover, SlotFillProvider } from '@wordpress/components';

/**
 *  dependencies
 */
import { ControlContextProvider, STORE_NAME } from '@blockera/controls';

/**
 * Internal dependencies
 */
import './commands';

/**
 * Style dependencies
 */
import '../../../controls/js/style.scss';
import '../../../../.storybook/styles/style.lazy.scss';
import '../../../components/js/style.scss';
import { WithControlDataProvider } from './components/providers/control-provider/with-control-data-provider';
import { controlReducer } from '@blockera/controls/js/store/reducers/control-reducer';
import { modifyControlValue } from '@blockera/controls/js/store/actions';

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
	}) => {
		cy.withInspector(
			<ControlContextProvider
				storeName={store}
				value={{
					name,
					value,
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
