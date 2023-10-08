import BackgroundControl from '../index';
import { ControlContextProvider } from '../../../context';
import { nanoid } from 'nanoid';
import { STORE_NAME } from '../../repeater-control/store';
import { PanelBody, Popover, SlotFillProvider } from '@wordpress/components';

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
