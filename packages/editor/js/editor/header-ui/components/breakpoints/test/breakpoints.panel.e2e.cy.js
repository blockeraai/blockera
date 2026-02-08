/**
 * Blockera dependencies
 */
import {
	goTo,
	createPost,
	setDeviceType,
} from '@blockera/dev-cypress/js/helpers';

describe('Breakpoints Functionalities', () => {
	beforeEach(() => {
		goTo('/wp-admin/admin.php?page=blockera-settings-general-settings');

		cy.getByDataTest('update-settings').as('update');
	});

	it('should can not add new or delete breakpoint', () => {
		cy.getByDataTest('add-new-breakpoint').click();

		cy.get('.components-popover')
			.eq(0)
			.within(() => {
				cy.get('a').contains('Upgrade to PRO').should('be.visible');

				cy.getByAriaLabel('Close').should('be.visible').click();
			});

		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').realHover();

		cy.getByAriaLabel('Delete tablet').should('not.exist');
	});

	it('should disable tablet breakpoint of top header navigation menu', () => {
		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').within(() => {
			cy.get('input').click();
		});

		cy.get('@update').then(() => {
			cy.get('@update').click();
			// eslint-disable-next-line
			cy.wait(2000);
		});
		createPost();

		// Exit code editor if it's currently active
		cy.get('body').then(($body) => {
			if (
				$body.find(
					'.editor-text-editor .editor-text-editor__toolbar button'
				).length > 0
			) {
				cy.get('button').contains('Exit code editor').click();
			}
		});

		cy.getByAriaLabel('Breakpoints').eq(0).should('be.visible');
		cy.getByAriaLabel('Breakpoints')
			.eq(0)
			.within(() => {
				cy.getByAriaLabel('Tablet').should('not.exist');
			});
	});

	it('should allow changing breakpoint min and max width', () => {
		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').within(() => {
			cy.get('input').click();
		});
		cy.getByDataTest('tablet').click();

		// Assert control value.
		cy.getParentContainer('Size').within(() => {
			cy.getParentContainer('Min Width').within(() => {
				cy.get('input').clear();
				cy.get('input').type('768', { delay: 0 });
				cy.get('input').should('have.value', '768');
			});

			cy.getParentContainer('Max Width').within(() => {
				cy.get('input').clear();
				cy.get('input').type('1024', { delay: 0 });
				cy.get('input').should('have.value', '1024');
			});
		});

		cy.get('@update').then(() => {
			cy.get('@update').click();
			// eslint-disable-next-line
			cy.wait(2000);
		});

		cy.reload();

		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').click();

		// Assert control value.
		cy.getParentContainer('Size').within(() => {
			cy.getParentContainer('Min Width').within(() => {
				cy.get('input').should('have.value', '768');
				cy.get('input').clear();
				cy.get('input').should('have.value', '');
			});

			cy.getParentContainer('Max Width').within(() => {
				cy.get('input').clear();
				cy.get('input').type('991', { delay: 0 });
				cy.get('input').should('have.value', '991');
			});
		});

		cy.get('@update').then(() => {
			cy.get('@update').click();
			// eslint-disable-next-line
			cy.wait(2000);
		});
	});

	it('should allow changing breakpoint icon with default icons', () => {
		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').click();

		cy.getParentContainer('Icon').within(() => {
			cy.get('button').click();
			cy.get('div[role="listbox"')
				.contains('Mobile Portrait')
				.click({ force: true });
		});
	});

	// @debug-ignore
	it.skip('should allow changing breakpoint icon with custom icon field', () => {
		cy.getByDataTest('tablet').should('be.visible');
		cy.getByDataTest('tablet').click();

		cy.get('.components-popover').eq(1).should('be.visible');
		cy.get('.components-popover')
			.eq(1)
			.within(() => {
				cy.getParentContainer('Icon').within(() => {
					cy.get('button').click();
					cy.get('div[role="listbox"').contains('Custom').click();
					cy.getByAriaLabel('Icon Library').click({ force: true });
				});
			});

		cy.get('.components-popover').eq(2).should('be.visible');
		cy.get('.components-popover')
			.eq(2)
			.within(() => {
				cy.getByAriaLabel('add-card Icon').should('be.visible');
				cy.getByAriaLabel('add-card Icon').click();
			});
	});
});

describe('Breakpoints Editor Mode Subscription', () => {
	beforeEach(() => {
		createPost();

		// Exit code editor if it's currently active
		cy.get('body').then(($body) => {
			if (
				$body.find(
					'.editor-text-editor .editor-text-editor__toolbar button'
				).length > 0
			) {
				cy.get('button').contains('Exit code editor').click();
			}
		});

		// Wait for editor to be fully loaded
		cy.get('.edit-post-visual-editor').should('exist');
		cy.getByAriaLabel('Breakpoints').eq(0).should('be.visible');
	});

	const activatedClassName = 'is-active-breakpoint';

	it('should switch to base breakpoint when entering code editor mode', () => {
		// First, switch to tablet breakpoint
		setDeviceType('Tablet');

		// Verify tablet breakpoint is active
		cy.getByAriaLabel('Breakpoints')
			.first()
			.within(() => {
				cy.getByAriaLabel('Tablet').should(
					'have.class',
					activatedClassName
				);
			});

		// Switch to code editor
		cy.get('[aria-label="Options"]').first().click();
		cy.get('span').contains('Code editor').click();

		// Verify code editor is visible
		cy.get('.editor-post-text-editor').should('be.visible');

		// Switch back to visual editor
		cy.get('button').contains('Exit code editor').click();

		// Verify breakpoint panel is visible again
		cy.getByAriaLabel('Breakpoints').eq(0).should('be.visible');

		// Verify tablet breakpoint is still active (restored)
		cy.getByAriaLabel('Breakpoints')
			.first()
			.within(() => {
				cy.getByAriaLabel('Tablet').should(
					'have.class',
					activatedClassName
				);
			});
	});

	it('should restore previously selected device type when returning from code editor', () => {
		// Switch to mobile breakpoint
		setDeviceType('Mobile Portrait');

		// Verify mobile breakpoint is active
		cy.getByAriaLabel('Breakpoints')
			.first()
			.within(() => {
				cy.getByAriaLabel('Mobile Portrait').should(
					'have.class',
					activatedClassName
				);
			});

		// Switch to code editor
		cy.get('[aria-label="Options"]').first().click();
		cy.get('span').contains('Code editor').click();

		// Verify code editor is visible
		cy.get('.editor-post-text-editor').should('be.visible');

		// Switch back to visual editor
		cy.get('button').contains('Exit code editor').click();

		// Verify breakpoint panel is visible again
		cy.getByAriaLabel('Breakpoints').eq(0).should('be.visible');

		// Verify mobile breakpoint is restored
		cy.getByAriaLabel('Breakpoints')
			.first()
			.within(() => {
				cy.getByAriaLabel('Mobile Portrait').should(
					'have.class',
					activatedClassName
				);
			});
	});

	it('should remain on base breakpoint if already on base when switching editor modes', () => {
		// Ensure we're on base breakpoint (Desktop)
		setDeviceType('Desktop');

		// Verify desktop breakpoint is active
		cy.getByAriaLabel('Breakpoints')
			.first()
			.within(() => {
				cy.getByAriaLabel('Desktop').should(
					'have.class',
					activatedClassName
				);
			});

		// Switch to code editor
		cy.get('[aria-label="Options"]').first().click();
		cy.get('span').contains('Code editor').click();

		// Verify code editor is visible
		cy.get('.editor-post-text-editor').should('be.visible');

		// Switch back to visual editor
		cy.get('button').contains('Exit code editor').click();

		// Verify desktop breakpoint is still active
		cy.getByAriaLabel('Breakpoints')
			.first()
			.within(() => {
				cy.getByAriaLabel('Desktop').should(
					'have.class',
					activatedClassName
				);
			});
	});

	it('should handle multiple editor mode switches with different breakpoints', () => {
		// First cycle: Switch to tablet
		setDeviceType('Tablet');

		// Switch to code editor and back
		cy.get('[aria-label="Options"]').first().click();
		cy.get('span').contains('Code editor').click();
		cy.get('.editor-post-text-editor').should('be.visible');
		cy.get('button').contains('Exit code editor').click();

		// Verify tablet is restored
		cy.getByAriaLabel('Breakpoints')
			.first()
			.within(() => {
				cy.getByAriaLabel('Tablet').should(
					'have.class',
					activatedClassName
				);
			});

		// Second cycle: Change to mobile
		setDeviceType('Mobile Portrait');

		// Switch to code editor and back again
		cy.get('[aria-label="Options"]').first().click();
		cy.get('span').contains('Code editor').click();
		cy.get('.editor-post-text-editor').should('be.visible');
		cy.get('button').contains('Exit code editor').click();

		// Verify mobile is restored
		cy.getByAriaLabel('Breakpoints')
			.first()
			.within(() => {
				cy.getByAriaLabel('Mobile Portrait').should(
					'have.class',
					activatedClassName
				);
			});
	});
});
