/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	openInserter,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

//
// Converted base64 because we got error in the editor as the html content is complex and special chars.
//
const base64 =
	'PCEtLSB3cDptYXRoIHsibGF0ZXgiOiJcdTAwNWNiZWdpbnthcnJheX17Y31cblx1MDA1Y3VuZGVyYnJhY2V7XG4gIFx1MDA1Y292ZXJicmFjZXtcbiAgICBcdTAwNWNmcmFje1xuICAgICAgXHUwMDVjc3FydFtcdTAwNWNkaXNwbGF5c3R5bGUgM117YV97MX0gKyBiXnsyfX1cbiAgICB9e1xuICAgICAgXHUwMDVjZGlzcGxheXN0eWxlIFx1MDA1Y3N1bV97aT0xfV57bn0gXHUwMDVjZnJhY3t4X2l9e3lfaX1cbiAgICB9XG4gIH1ee1x1MDA1Y3RleHR7bnVtZXJhdG9yfX1cbiAgXHUwMDVjdGltZXNcbiAgXHUwMDVjbGVmdChcbiAgICBcdTAwNWNiZWdpbnthcnJheX17Y2NjfVxuICAgICAgXHUwMDVjYWxwaGEgXHUwMDI2IFx1MDA1Y2JldGEgXHUwMDI2IFx1MDA1Y2dhbW1hIFx1MDA1Y1x1MDA1Y1xuICAgICAgeF8xIFx1MDAyNiB4XzIgXHUwMDI2IHhfMyBcdTAwNWNcdTAwNWNcbiAgICAgIFx1MDA1Y3Npblx1MDA1Y3RoZXRhIFx1MDAyNiBcdTAwNWNjb3NcdTAwNWN0aGV0YSBcdTAwMjYgXHUwMDVjdGFuXHUwMDVjdGhldGFcbiAgICBcdTAwNWNlbmR7YXJyYXl9XG4gIFx1MDA1Y3JpZ2h0KVxuICArXG4gIFx1MDA1Y2xlZnR8XG4gICAgXHUwMDVjYmVnaW57YXJyYXl9e2NjfVxuICAgICAgXHUwMDVjZnJhY3tcdTAwNWNwYXJ0aWFsIGZ9e1x1MDA1Y3BhcnRpYWwgeH0gXHUwMDI2IFx1MDA1Y2ZyYWN7XHUwMDVjcGFydGlhbCBmfXtcdTAwNWNwYXJ0aWFsIHl9IFx1MDA1Y1x1MDA1Y1xuICAgICAgXHUwMDVjZnJhY3tcdTAwNWNwYXJ0aWFsIGd9e1x1MDA1Y3BhcnRpYWwgeH0gXHUwMDI2IFx1MDA1Y2ZyYWN7XHUwMDVjcGFydGlhbCBnfXtcdTAwNWNwYXJ0aWFsIHl9XG4gICAgXHUwMDVjZW5ke2FycmF5fVxuICBcdTAwNWNyaWdodHxcbn1fe1x1MDA1Y3RleHR7bWFpbiBzdHJ1Y3R1cmV9fVxuK1xuXHUwMDVjb3ZlcnNldHtcdTAwNWN0ZXh0e292ZXJ9fXtcdTAwNWN1bmRlcnNldHtcdTAwNWN0ZXh0e3VuZGVyfX17XHUwMDVjaW50X3swfV57XHUwMDVjaW5mdHl9IGVeey14XjJ9XHUwMDVjLGR4fX1cbitcbm1fe1x1MDA1Y3BoYW50b217aX19XntcdTAwNWNwaGFudG9tezJ9fVxuXHUwMDVjZW5ke2FycmF5fSJ9IC0tPgo8bWF0aCBjbGFzcz0id3AtYmxvY2stbWF0aCIgZGlzcGxheT0iYmxvY2siPjxzZW1hbnRpY3M+PG10YWJsZSBjb2x1bW5hbGlnbj0iY2VudGVyIj48bXRyPjxtdGQgc3R5bGU9InBhZGRpbmctbGVmdDowcHQ7cGFkZGluZy1yaWdodDowcHQ7Ij48bXJvdz48bXJvdz48bXVuZGVyPjxtdW5kZXI+PG1yb3c+PG1yb3c+PG1vdmVyPjxtb3Zlcj48bWZyYWM+PG1yb290Pjxtcm93Pjxtc3ViPjxtaT5hPC9taT48bW4+MTwvbW4+PC9tc3ViPjxtbz4rPC9tbz48bXN1cD48bWk+YjwvbWk+PG1uPjI8L21uPjwvbXN1cD48L21yb3c+PG1zdHlsZSBzY3JpcHRsZXZlbD0iMCIgZGlzcGxheXN0eWxlPSJ0cnVlIj48bW4+MzwvbW4+PC9tc3R5bGU+PC9tcm9vdD48bXN0eWxlIHNjcmlwdGxldmVsPSIwIiBkaXNwbGF5c3R5bGU9InRydWUiPjxtcm93PjxtdW5kZXJvdmVyPjxtbyBtb3ZhYmxlbGltaXRzPSJmYWxzZSI+4oiRPC9tbz48bXJvdz48bWk+aTwvbWk+PG1vPj08L21vPjxtbj4xPC9tbj48L21yb3c+PG1pPm48L21pPjwvbXVuZGVyb3Zlcj48L21yb3c+PG1mcmFjPjxtc3ViPjxtaT54PC9taT48bWk+aTwvbWk+PC9tc3ViPjxtc3ViPjxtaT55PC9taT48bWk+aTwvbWk+PC9tc3ViPjwvbWZyYWM+PC9tc3R5bGU+PC9tZnJhYz48bW8gc3RyZXRjaHk9InRydWUiIHN0eWxlPSJtYXRoLWRlcHRoOjA7Ij7ij548L21vPjwvbW92ZXI+PG10ZXh0Pm51bWVyYXRvcjwvbXRleHQ+PC9tb3Zlcj48L21yb3c+PG1vPsOXPC9tbz48bXJvdz48bW8gZmVuY2U9InRydWUiIGZvcm09InByZWZpeCI+KDwvbW8+PG10YWJsZSBjb2x1bW5hbGlnbj0iY2VudGVyIGNlbnRlciBjZW50ZXIiPjxtdHI+PG10ZCBzdHlsZT0icGFkZGluZy1sZWZ0OjBwdDtwYWRkaW5nLXJpZ2h0OjUuOTc3NnB0OyI+PG1pPs6xPC9taT48L210ZD48bXRkIHN0eWxlPSJwYWRkaW5nLWxlZnQ6NS45Nzc2cHQ7cGFkZGluZy1yaWdodDo1Ljk3NzZwdDsiPjxtaT7OsjwvbWk+PC9tdGQ+PG10ZCBzdHlsZT0icGFkZGluZy1sZWZ0OjUuOTc3NnB0O3BhZGRpbmctcmlnaHQ6MHB0OyI+PG1pPs6zPC9taT48L210ZD48L210cj48bXRyPjxtdGQgc3R5bGU9InBhZGRpbmctbGVmdDowcHQ7cGFkZGluZy1yaWdodDo1Ljk3NzZwdDsiPjxtc3ViPjxtaT54PC9taT48bW4+MTwvbW4+PC9tc3ViPjwvbXRkPjxtdGQgc3R5bGU9InBhZGRpbmctbGVmdDo1Ljk3NzZwdDtwYWRkaW5nLXJpZ2h0OjUuOTc3NnB0OyI+PG1zdWI+PG1pPng8L21pPjxtbj4yPC9tbj48L21zdWI+PC9tdGQ+PG10ZCBzdHlsZT0icGFkZGluZy1sZWZ0OjUuOTc3NnB0O3BhZGRpbmctcmlnaHQ6MHB0OyI+PG1zdWI+PG1pPng8L21pPjxtbj4zPC9tbj48L21zdWI+PC9tdGQ+PC9tdHI+PG10cj48bXRkIHN0eWxlPSJwYWRkaW5nLWxlZnQ6MHB0O3BhZGRpbmctcmlnaHQ6NS45Nzc2cHQ7Ij48bXJvdz48bXJvdz48bWk+c2luPC9taT48bW8+4oGhPC9tbz48bXNwYWNlIHdpZHRoPSIwLjE2NjdlbSI+PC9tc3BhY2U+PC9tcm93PjxtaT7OuDwvbWk+PC9tcm93PjwvbXRkPjxtdGQgc3R5bGU9InBhZGRpbmctbGVmdDo1Ljk3NzZwdDtwYWRkaW5nLXJpZ2h0OjUuOTc3NnB0OyI+PG1yb3c+PG1yb3c+PG1pPmNvczwvbWk+PG1vPuKBoTwvbW8+PG1zcGFjZSB3aWR0aD0iMC4xNjY3ZW0iPjwvbXNwYWNlPjwvbXJvdz48bWk+zrg8L21pPjwvbXJvdz48L210ZD48bXRkIHN0eWxlPSJwYWRkaW5nLWxlZnQ6NS45Nzc2cHQ7cGFkZGluZy1yaWdodDowcHQ7Ij48bXJvdz48bXJvdz48bWk+dGFuPC9taT48bW8+4oGhPC9tbz48bXNwYWNlIHdpZHRoPSIwLjE2NjdlbSI+PC9tc3BhY2U+PC9tcm93PjxtaT7OuDwvbWk+PC9tcm93PjwvbXRkPjwvbXRyPjwvbXRhYmxlPjxtbyBmZW5jZT0idHJ1ZSIgZm9ybT0icG9zdGZpeCI+KTwvbW8+PC9tcm93Pjxtbz4rPC9tbz48bXJvdz48bW8gZmVuY2U9InRydWUiIGZvcm09InByZWZpeCI+fDwvbW8+PG10YWJsZSBjb2x1bW5hbGlnbj0iY2VudGVyIGNlbnRlciI+PG10cj48bXRkIHN0eWxlPSJwYWRkaW5nLWxlZnQ6MHB0O3BhZGRpbmctcmlnaHQ6NS45Nzc2cHQ7Ij48bWZyYWM+PG1yb3c+PG1pPuKIgjwvbWk+PG1pPmY8L21pPjwvbXJvdz48bXJvdz48bWk+4oiCPC9taT48bWk+eDwvbWk+PC9tcm93PjwvbWZyYWM+PC9tdGQ+PG10ZCBzdHlsZT0icGFkZGluZy1sZWZ0OjUuOTc3NnB0O3BhZGRpbmctcmlnaHQ6MHB0OyI+PG1mcmFjPjxtcm93PjxtaT7iiII8L21pPjxtaT5mPC9taT48L21yb3c+PG1yb3c+PG1pPuKIgjwvbWk+PG1pPnk8L21pPjwvbXJvdz48L21mcmFjPjwvbXRkPjwvbXRyPjxtdHI+PG10ZCBzdHlsZT0icGFkZGluZy1sZWZ0OjBwdDtwYWRkaW5nLXJpZ2h0OjUuOTc3NnB0OyI+PG1mcmFjPjxtcm93PjxtaT7iiII8L21pPjxtaT5nPC9taT48L21yb3c+PG1yb3c+PG1pPuKIgjwvbWk+PG1pPng8L21pPjwvbXJvdz48L21mcmFjPjwvbXRkPjxtdGQgc3R5bGU9InBhZGRpbmctbGVmdDo1Ljk3NzZwdDtwYWRkaW5nLXJpZ2h0OjBwdDsiPjxtZnJhYz48bXJvdz48bWk+4oiCPC9taT48bWk+ZzwvbWk+PC9tcm93Pjxtcm93PjxtaT7iiII8L21pPjxtaT55PC9taT48L21yb3c+PC9tZnJhYz48L210ZD48L210cj48L210YWJsZT48bW8gZmVuY2U9InRydWUiIGZvcm09InBvc3RmaXgiPnw8L21vPjwvbXJvdz48L21yb3c+PG1vIHN0cmV0Y2h5PSJ0cnVlIiBzdHlsZT0ibWF0aC1kZXB0aDowOyI+4o+fPC9tbz48L211bmRlcj48bXRleHQ+bWFpbiZuYnNwO3N0cnVjdHVyZTwvbXRleHQ+PC9tdW5kZXI+PC9tcm93Pjxtbz4rPC9tbz48bXJvdz48bW92ZXI+PG1yb3c+PG11bmRlcj48bXN1YnN1cD48bW8gbW92YWJsZWxpbWl0cz0iZmFsc2UiPuKIqzwvbW8+PG1uPjA8L21uPjxtaT7iiJ48L21pPjwvbXN1YnN1cD48bXRleHQ+dW5kZXI8L210ZXh0PjwvbXVuZGVyPjwvbXJvdz48bXRleHQ+b3ZlcjwvbXRleHQ+PC9tb3Zlcj48L21yb3c+PG1vPis8L21vPjxtc3Vic3VwPjxtaT5tPC9taT48bXBoYW50b20+PG1pPmk8L21pPjwvbXBoYW50b20+PG1waGFudG9tPjxtbj4yPC9tbj48L21waGFudG9tPjwvbXN1YnN1cD48L21yb3c+PC9tdGQ+PC9tdHI+PC9tdGFibGU+PGFubm90YXRpb24gZW5jb2Rpbmc9ImFwcGxpY2F0aW9uL3gtdGV4Ij5cYmVnaW57YXJyYXl9e2N9Clx1bmRlcmJyYWNlewogIFxvdmVyYnJhY2V7CiAgICBcZnJhY3sKICAgICAgXHNxcnRbXGRpc3BsYXlzdHlsZSAzXXthX3sxfSArIGJeezJ9fQogICAgfXsKICAgICAgXGRpc3BsYXlzdHlsZSBcc3VtX3tpPTF9XntufSBcZnJhY3t4X2l9e3lfaX0KICAgIH0KICB9XntcdGV4dHtudW1lcmF0b3J9fQogIFx0aW1lcwogIFxsZWZ0KAogICAgXGJlZ2lue2FycmF5fXtjY2N9CiAgICAgIFxhbHBoYSAmYW1wOyBcYmV0YSAmYW1wOyBcZ2FtbWEgXFwKICAgICAgeF8xICZhbXA7IHhfMiAmYW1wOyB4XzMgXFwKICAgICAgXHNpblx0aGV0YSAmYW1wOyBcY29zXHRoZXRhICZhbXA7IFx0YW5cdGhldGEKICAgIFxlbmR7YXJyYXl9CiAgXHJpZ2h0KQogICsKICBcbGVmdHwKICAgIFxiZWdpbnthcnJheX17Y2N9CiAgICAgIFxmcmFje1xwYXJ0aWFsIGZ9e1xwYXJ0aWFsIHh9ICZhbXA7IFxmcmFje1xwYXJ0aWFsIGZ9e1xwYXJ0aWFsIHl9IFxcCiAgICAgIFxmcmFje1xwYXJ0aWFsIGd9e1xwYXJ0aWFsIHh9ICZhbXA7IFxmcmFje1xwYXJ0aWFsIGd9e1xwYXJ0aWFsIHl9CiAgICBcZW5ke2FycmF5fQogIFxyaWdodHwKfV97XHRleHR7bWFpbiBzdHJ1Y3R1cmV9fQorClxvdmVyc2V0e1x0ZXh0e292ZXJ9fXtcdW5kZXJzZXR7XHRleHR7dW5kZXJ9fXtcaW50X3swfV57XGluZnR5fSBlXnsteF4yfVwsZHh9fQorCm1fe1xwaGFudG9te2l9fV57XHBoYW50b217Mn19ClxlbmR7YXJyYXl9PC9hbm5vdGF0aW9uPjwvc2VtYW50aWNzPjwvbWF0aD4KPCEtLSAvd3A6bWF0aCAtLT4=';
const content = decodeURIComponent(escape(atob(base64)));

describe('Math Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality', () => {
		appendBlocks(content);

		cy.getBlock('core/math').click({ force: true });

		cy.wait(100);

		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'elements/mi',
			'elements/mn',
			'elements/mo',
			'elements/mfrac',
			'elements/msup',
			'elements/msub',
		]);

		//
		// 1. Edit Block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/math')
			.first()
			.should('have.css', 'background-clip', 'border-box');

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/math')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		//
		// 1.2. elements/mi
		//
		setInnerBlock('elements/mi');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.1.1. Text color
		//
		cy.setColorControlValue('Text Color', 'ff0000');

		cy.getBlock('core/math')
			.first()
			.within(() => {
				cy.get('mi')
					.first()
					.should('have.css', 'color', 'rgb(255, 0, 0)');
			});

		//
		// 1.3. elements/mn
		//
		setInnerBlock('elements/mn');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.3.1. Text color
		//
		cy.setColorControlValue('Text Color', '00ff00');

		cy.getBlock('core/math')
			.first()
			.within(() => {
				cy.get('mn')
					.first()
					.should('have.css', 'color', 'rgb(0, 255, 0)');
			});

		//
		// 1.4. elements/mo
		//
		setInnerBlock('elements/mo');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.4.1. Text color
		//
		cy.setColorControlValue('Text Color', '0000ff');

		cy.getBlock('core/math')
			.first()
			.within(() => {
				cy.get('mo')
					.first()
					.should('have.css', 'color', 'rgb(0, 0, 255)');
			});

		//
		// 1.5. elements/mfrac
		//
		setInnerBlock('elements/mfrac');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.5.1. Text color
		//
		cy.setColorControlValue('Text Color', 'ffff00');

		cy.getBlock('core/math')
			.first()
			.within(() => {
				cy.get('mfrac')
					.first()
					.should('have.css', 'color', 'rgb(255, 255, 0)');
			});

		//
		// 1.6. elements/msup
		//
		setInnerBlock('elements/msup');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.6.1. Text color
		//
		cy.setColorControlValue('Text Color', 'ff00ff');

		cy.getBlock('core/math')
			.first()
			.within(() => {
				cy.get('msup')
					.first()
					.should('have.css', 'color', 'rgb(255, 0, 255)');
			});

		//
		// 1.7. elements/msub
		//
		setInnerBlock('elements/msub');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.7.1. Text color
		//
		cy.setColorControlValue('Text Color', '00ffff');

		cy.getBlock('core/math')
			.first()
			.within(() => {
				cy.get('msub')
					.first()
					.should('have.css', 'color', 'rgb(0, 255, 255)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-math')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		cy.get('.blockera-block.wp-block-math').within(() => {
			cy.get('mi').should('have.css', 'color', 'rgb(255, 0, 0)');
			cy.get('mn').should('have.css', 'color', 'rgb(0, 255, 0)');
			cy.get('mo').should('have.css', 'color', 'rgb(0, 0, 255)');
			cy.get('mfrac').should('have.css', 'color', 'rgb(255, 255, 0)');
			cy.get('msup').should('have.css', 'color', 'rgb(255, 0, 255)');
			cy.get('msub').should('have.css', 'color', 'rgb(0, 255, 255)');
		});
	});
});
