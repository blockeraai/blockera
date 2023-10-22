/// <reference types="Cypress" />
/**
 * Internal dependencies
 */
import BackgroundControl from '../index';
import { STORE_NAME } from '../../repeater-control/store';
import RepeaterControl from '../index';

describe('repeater control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});
	describe('popover -> empty', () => {
		it('should add new item', () => {
			cy.withDataProvider({
				component: (
					<RepeaterControl
						label="Items"
						repeaterItemChildren={() => <p>hi</p>}
						storeName={STORE_NAME}
					/>
				),
				value: [
					{
						isVisible: true,
					},
					{
						isVisible: true,
					},
				],
				store: STORE_NAME,
			});
			cy.get(`[aria-label="Add New Items"]`).click();
			cy.get('[aria-label="Add New Items"]').click();
		});
	});
});
