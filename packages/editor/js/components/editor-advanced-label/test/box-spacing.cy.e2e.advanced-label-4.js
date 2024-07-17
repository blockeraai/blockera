import {
	createPost,
	setBlockState,
	addBlockState,
	setDeviceType,
	setBoxSpacingSide,
} from '@blockera/dev-cypress/js/helpers';

describe('Box spacing label testing (Box Spacing Control)', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();
	});

	it('should display changed value on Spacing -> Normal -> Desktop', () => {
		// Assert label before set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-normal-state',
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '-');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-normal-state',
				'not-have'
			);
		});

		// set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setBoxSpacingSide(`${type}-${side}`, 10);
			});
		});

		// Assert label after set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-normal-state',
					'have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '10');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-normal-state',
				'have'
			);
		});

		/**
		 * Tablet device
		 */
		setDeviceType('Tablet');

		// Assert label after set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-normal-state',
					'have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '10');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-normal-state',
				'have'
			);
		});

		// Assert state graph
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingStateGraph(type, side, {
					desktop: ['Normal'],
				});
			});

			cy.checkBoxSpacingStateGraph(type, '', {
				desktop: ['Normal'],
			});
		});
	});

	it('should display changed value on Spacing -> Hover -> Desktop', () => {
		/**
		 * Hover
		 */
		addBlockState('hover');

		// Assert label before set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-normal-state',
					'not-have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-secondary-state',
					'not-have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '-');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-normal-state',
				'not-have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-secondary-state',
				'not-have'
			);
		});

		// set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				setBoxSpacingSide(`${type}-${side}`, 20);
			});
		});

		// Assert label after set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-normal-state',
					'not-have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-secondary-state',
					'have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '20');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-normal-state',
				'not-have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-secondary-state',
				'have'
			);
		});

		/**
		 * Normal
		 */
		setBlockState('Normal');

		// Assert label after set value
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-normal-state',
					'not-have'
				);

				cy.checkBoxSpacingLabelClassName(
					type,
					side,
					'changed-in-other-state',
					'have'
				);

				cy.checkBoxSpacingLabelContent(type, side, '-');
			});

			// assert the spacing type label
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-normal-state',
				'not-have'
			);
			cy.checkBoxSpacingLabelClassName(
				type,
				'',
				'changed-in-other-state',
				'have'
			);
		});

		// Assert state graph
		['margin', 'padding'].forEach((type) => {
			['top', 'right', 'bottom', 'left'].forEach((side) => {
				cy.checkBoxSpacingStateGraph(type, side, {
					desktop: ['Hover'],
				});
			});

			cy.checkBoxSpacingStateGraph(type, '', {
				desktop: ['Hover'],
			});
		});
	});
});
