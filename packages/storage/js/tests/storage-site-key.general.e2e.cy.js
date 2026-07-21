import { createPost } from '@blockera/dev-cypress/js/helpers';

describe('Storage site key', () => {
	beforeEach(() => {
		createPost();
	});

	it('loads window.blockeraStorageSiteKey on the editor page', () => {
		cy.window().should((win) => {
			expect(win.blockeraStorageSiteKey).to.be.a('string');
			expect(win.blockeraStorageSiteKey).to.have.lengthOf(10);
			expect(win.blockeraStorageSiteKey).to.not.equal('0');
			expect(win.blockeraStorageSiteKey).to.match(/^[0-9a-f]{10}$/i);
			expect(win.blockeraStorageUserId).to.be.a('number');
			expect(win.blockeraStorageUserId).to.be.greaterThan(0);
		});
	});
});
