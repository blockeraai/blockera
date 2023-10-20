/**
 * Internal dependencies
 */
import BackgroundControl from '../index';
import { STORE_NAME } from '../../repeater-control/store';

describe('background control component testing', () => {
	it('should close modal of third item!', () => {
		cy.withInspector({
			component: <BackgroundControl label={'Background'} />,
			value: [
				{
					type: 'image',
					image: 'https://betterstudio.com/wp-content/uploads/2022/09/publisher-theme.svg',
					isVisible: true,
				},
				{
					type: 'image',
					isVisible: true,
				},
				{
					type: 'image',
					image: 'https://betterstudio.com/wp-content/uploads/2022/09/publisher-theme.svg',
					isVisible: true,
					isOpen: true,
				},
			],
			store: STORE_NAME,
		});

		cy.get('[aria-label="Close Modal"]').click();
	});
});
