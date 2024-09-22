/**
 * Internal dependencies
 */
import {
	addBlockToPost,
	appendBlocks,
	createPost,
	getSelectedBlock,
	getWPDataObject,
} from '@blockera/dev-cypress/js/helpers';

describe('Blockera unique classnames for blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('should be two paragraph blocks have unique classnames while create duplicate from first paragraph', () => {
		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>Test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();

		cy.setColorControlValue('BG Color', '#000000');

		let firstParagraphClassName = '';

		getWPDataObject().then((data) => {
			firstParagraphClassName = getSelectedBlock(data, 'className');
		});

		cy.get(
			'div[aria-label="Block tools"]  button[aria-label="Options"]'
		).click();
		cy.get('.components-menu-item__button').contains('Duplicate').click();

		cy.getBlock('core/paragraph').eq(1).click();

		let clonedParagraphClassName = firstParagraphClassName;

		getWPDataObject().then((data) => {
			clonedParagraphClassName = getSelectedBlock(data, 'className');

			expect(clonedParagraphClassName).to.be.not.equals(
				firstParagraphClassName
			);
		});
	});

	it('should be two core/social-links blocks have unique classnames while paste two blocks with duplicated classnames', () => {
		appendBlocks(
			`<!-- wp:social-links {"showLabels":true,"size":"has-normal-icon-size","blockeraPropsId":"82217494351","blockeraCompatId":"822173656230","blockeraFlexLayout":{"direction":"row","alignItems":"","justifyContent":"flex-start"},"blockeraFlexWrap":{"value":"nowrap","reverse":false},"blockeraSpacing":{"margin":{"top":"8px"}},"className":"is-style-default blockera-block blockera-block\u002d\u002d29rch2","style":{"spacing":{"margin":{"top":"8px","right":"","bottom":"","left":""}}},"layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<ul class="wp-block-social-links has-normal-icon-size has-visible-labels is-style-default blockera-block blockera-block--29rch2" style="margin-top:8px"><!-- wp:social-link {"url":"#test","service":"wordpress","blockeraPropsId":"8221055682","blockeraCompatId":"82210556168","blockeraInnerBlocks":{"elements/item-icon":{"attributes":{"blockeraBackgroundColor":"#ff0000"}},"elements/item-name":{"attributes":{"blockeraBackgroundColor":"#ff2020"}}},"className":"blockera-block blockera-block\u002d\u002dnfqk58"} /-->

<!-- wp:social-link {"url":"#test","service":"dribbble","className":"blockera-block-ngq19y"} /-->

<!-- wp:social-link {"url":"#test","service":"behance","className":"blockera-block\u002d\u002drqxth7"} /--></ul>
<!-- /wp:social-links -->

<!-- wp:social-links {"showLabels":true,"size":"has-normal-icon-size","blockeraPropsId":"82217494351","blockeraCompatId":"822173656230","blockeraFlexLayout":{"direction":"row","alignItems":"","justifyContent":"flex-start"},"blockeraFlexWrap":{"value":"nowrap","reverse":false},"blockeraSpacing":{"margin":{"top":"8px"}},"className":"is-style-default blockera-block blockera-block\u002d\u002d29rch2","style":{"spacing":{"margin":{"top":"8px","right":"","bottom":"","left":""}}},"layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<ul class="wp-block-social-links has-normal-icon-size has-visible-labels is-style-default blockera-block blockera-block--29rch2" style="margin-top:8px"><!-- wp:social-link {"url":"#test","service":"wordpress","blockeraPropsId":"8221055682","blockeraCompatId":"82210556168","blockeraInnerBlocks":{"elements/item-icon":{"attributes":{"blockeraBackgroundColor":"#ff0000"}},"elements/item-name":{"attributes":{"blockeraBackgroundColor":"#ff2020"}}},"className":"blockera-block blockera-block\u002d\u002dnfqk58"} /-->

<!-- wp:social-link {"url":"#test","service":"dribbble","className":"blockera-block-ngq19y"} /-->

<!-- wp:social-link {"url":"#test","service":"behance","className":"blockera-block\u002d\u002drqxth7"} /--></ul>
<!-- /wp:social-links -->`
		);

		cy.getBlock('core/social-links').eq(0).click();

		let firstParagraphClassName = '';

		getWPDataObject().then((data) => {
			firstParagraphClassName = getSelectedBlock(data, 'className');
		});

		cy.get(
			'div[aria-label="Block tools"]  button[aria-label="Options"]'
		).click();
		cy.get('.components-menu-item__button').contains('Duplicate').click();

		cy.getBlock('core/social-links').eq(1).click();

		let clonedParagraphClassName = firstParagraphClassName;

		getWPDataObject().then((data) => {
			clonedParagraphClassName = getSelectedBlock(data, 'className');

			expect(clonedParagraphClassName).to.be.not.equals(
				firstParagraphClassName
			);
		});
	});
});
