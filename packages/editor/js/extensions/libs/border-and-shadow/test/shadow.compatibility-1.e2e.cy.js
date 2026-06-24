/**
 * Shadow → WP Compatibility tests
 *
 * Based on WordPress default shadow presets (Twenty Twenty-Five theme, latest WP):
 * - natural: 6px 6px 9px rgba(0, 0, 0, 0.2)
 * - deep: 12px 12px 50px rgba(0, 0, 0, 0.4)
 * - sharp: 6px 6px 0px rgba(0, 0, 0, 0.2)
 * - outlined: 6px 6px 0px -3px rgb(255, 255, 255), 6px 6px rgb(0, 0, 0) (multi-shadow)
 * - crisp: 6px 6px 0px rgb(0, 0, 0)
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

const SHADOW_PRESETS = [
	{
		slug: 'natural',
		presetRef: 'var:preset|shadow|natural',
		presetVarString: 'var(--wp--preset--shadow--natural)',
	},
	{
		slug: 'deep',
		presetRef: 'var:preset|shadow|deep',
		presetVarString: 'var(--wp--preset--shadow--deep)',
	},
	{
		slug: 'sharp',
		presetRef: 'var:preset|shadow|sharp',
		presetVarString: 'var(--wp--preset--shadow--sharp)',
	},
	{
		slug: 'outlined',
		presetRef: 'var:preset|shadow|outlined',
		presetVarString: 'var(--wp--preset--shadow--outlined)',
	},
	{
		slug: 'crisp',
		presetRef: 'var:preset|shadow|crisp',
		presetVarString: 'var(--wp--preset--shadow--crisp)',
	},
];

describe('Shadow → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Button Block', () => {
		SHADOW_PRESETS.forEach(({ slug, presetRef, presetVarString }) => {
			it(`Preset: ${slug}`, () => {
				appendBlocks(
					`<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"style":{"shadow":"${presetRef}"}} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="box-shadow:${presetVarString}">Test</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`
				);

				cy.getBlock('core/button').click();
				cy.getParentContainer('Box Shadows').as('container');
				cy.addNewTransition();

				getWPDataObject().then((data) => {
					const blockeraBoxShadow = getSelectedBlock(
						data,
						'blockeraBoxShadow'
					);
					const wpShadow = getSelectedBlock(data, 'style')?.shadow;

					expect(blockeraBoxShadow).to.be.an('object');
					expect(
						Object.keys(blockeraBoxShadow).length
					).to.be.greaterThan(0);

					const shadowKeys = Object.keys(blockeraBoxShadow);
					const firstShadow = blockeraBoxShadow[shadowKeys[0]];

					expect(firstShadow.isVisible).to.equal(true);
					expect(firstShadow.type).to.equal('outer');

					// Preset resolved or has preset ref in color
					const colorIsPreset =
						typeof firstShadow.color === 'string' &&
						(firstShadow.color.startsWith('var:preset|shadow|') ||
							firstShadow.color.startsWith(
								'var(--wp--preset--shadow--'
							));
					const hasResolvedValues =
						firstShadow.x !== '0px' ||
						firstShadow.y !== '0px' ||
						firstShadow.blur !== '0px';

					expect(colorIsPreset || hasResolvedValues).to.equal(true);

					expect(wpShadow).to.equal(presetRef);
				});
			});
		});

		it('Multi-shadow preset (outlined) creates multiple Blockera items', () => {
			appendBlocks(
				`<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"style":{"shadow":"var:preset|shadow|outlined"}} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="box-shadow:var(--wp--preset--shadow--outlined)">Test</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`
			);

			cy.getBlock('core/button').click();
			cy.getParentContainer('Box Shadows').as('container');
			cy.addNewTransition();

			getWPDataObject().then((data) => {
				const blockeraBoxShadow = getSelectedBlock(
					data,
					'blockeraBoxShadow'
				);

				// Outlined preset resolves to 2 shadows
				expect(Object.keys(blockeraBoxShadow).length).to.be.at.least(2);
			});
		});

		it('Modifying preset shadow updates WP data', () => {
			appendBlocks(
				`<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"style":{"shadow":"var:preset|shadow|natural"}} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="box-shadow:var(--wp--preset--shadow--natural)">Test</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`
			);

			cy.getBlock('core/button').click();
			cy.getParentContainer('Box Shadows').as('container');
			cy.addNewTransition();

			cy.get('@container').within(() => {
				cy.getByDataCy('group-control-header').click();
			});

			cy.getByDataTest('popover-body')
				.eq(0)
				.within(() => {
					cy.getByDataTest('box-shadow-x-input').clear({
						force: true,
					});
					cy.getByDataTest('box-shadow-x-input').type(5, {
						force: true,
					});
				});

			getWPDataObject().then((data) => {
				const wpShadow = getSelectedBlock(data, 'style')?.shadow;

				expect(wpShadow).to.be.a('undefined');
			});
		});
	});

	describe('Image Block', () => {
		it('Preset: natural', () => {
			appendBlocks(
				`<!-- wp:image {"style":{"shadow":"var:preset|shadow|natural"}} -->
<figure class="wp-block-image"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ccc'/%3E%3C/svg%3E" alt="" style="box-shadow:var(--wp--preset--shadow--natural)"/></figure>
<!-- /wp:image -->`
			);

			cy.getBlock('core/image').click();
			cy.getByAriaControls('styles-view').click();
			cy.getParentContainer('Box Shadows').as('container');
			cy.addNewTransition();

			getWPDataObject().then((data) => {
				const blockeraBoxShadow = getSelectedBlock(
					data,
					'blockeraBoxShadow'
				);
				const wpShadow = getSelectedBlock(data, 'style')?.shadow;

				expect(blockeraBoxShadow).to.be.an('object');
				expect(Object.keys(blockeraBoxShadow).length).to.be.greaterThan(
					0
				);
				expect(wpShadow).to.equal('var:preset|shadow|natural');
			});
		});
	});
});
