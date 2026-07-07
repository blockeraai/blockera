import {
	findGlobalStylesNavigatorBackButton,
	findGlobalStylesScreenHeader,
	setGlobalStylesScreenHeaderTitle,
} from '../navigator-back-button';
import { getDualGlobalStylesSelector } from '../selectors';

describe('panel-override navigator back button', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('finds navigator back button by data-wp-component', () => {
		document.body.innerHTML = `
			<div class="global-styles-ui-sidebar__navigator-screen">
				<button data-wp-component="Navigator.BackButton">Back</button>
			</div>
		`;

		const button = findGlobalStylesNavigatorBackButton();

		expect(button).not.toBeNull();
		expect(button?.getAttribute('data-wp-component')).toBe(
			'Navigator.BackButton'
		);
	});

	it('finds screen header with legacy and WP 7 class hooks', () => {
		document.body.innerHTML = `
			<div class="global-styles-ui-sidebar__navigator-screen">
				<h2 class="global-styles-ui-header">Typography</h2>
			</div>
		`;

		expect(findGlobalStylesScreenHeader()).not.toBeNull();
		expect(
			document.querySelector(getDualGlobalStylesSelector('screenHeader'))
		).not.toBeNull();
	});

	it('updates the screen header title', () => {
		document.body.innerHTML = `
			<div class="edit-site-global-styles-sidebar__navigator-screen">
				<h2 class="edit-site-global-styles-header">Core/Button</h2>
			</div>
		`;

		expect(setGlobalStylesScreenHeaderTitle('Blocks')).toBe(true);
		expect(
			document.querySelector('.edit-site-global-styles-header')
				?.textContent
		).toBe('Blocks');
	});
});
