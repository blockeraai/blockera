/// <reference types="Cypress" />
/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
/**
 * Internal dependencies
 */
import { TextShadowControl } from '../../..';
import { STORE_NAME } from '../../repeater-control/store';
import { getControlValue } from '../../../store/selectors';

describe('ext shadow control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});

	describe('empty', () => {
		it('test', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <TextShadowControl label="text shadow" />,

				value: [
					{
						x: '2px',
						y: '3px',
						blur: '4px',
						color: '#0947eb',
						isVisible: true,
					},
				],
				store: STORE_NAME,
				name,
			});

			// Check data provider value!
			cy.then(() => {
				console.log('value: ', getControlValue(name, STORE_NAME));
				expect(getControlValue(name, STORE_NAME)).to.have.length(7);
			});
		});
	});
});
