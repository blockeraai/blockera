import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

// const cy.getParentContainer = (ariaLabel, dataCy) => {
// 	return cy.get(`[aria-label="${ariaLabel}"]`).parents(`[data-cy=${dataCy}]`);
// };

const calcMatrix = ({ type, matrix }) => {
	/*
		    matrix3d( scaleX, shearYX, shearZX, perspectiveX,
				 shearXY, scaleY, shearZY, perspectiveY, 
				 shearXZ, shearYZ, scaleZ, perspectiveZ,
				  translateX(moveX), translateY(moveY), translateZ(moveZ), perspectiveS)
   */
	// const matrixValues =
	// 	type === 'skew' && matrix.split('(')[1].split(')')[0].split(',');
	const matrix3dValues = matrix.split('(')[1].split(')')[0].split(',');

	if (type === 'skew') {
		//convert radian to degree:
		//radian × 180/π = degree
		//matrix(scaleX, skewY , skewX, scaleY, translateX, translateY)

		const skewX = Math.floor(matrix3dValues[2] * (180 / Math.PI));
		const skewY = Math.floor(matrix3dValues[1] * (180 / Math.PI));
		return { skewX, skewY };
	}

	if (type === 'move') {
		const moveX = Number(matrix3dValues[12].trim());
		const moveY = Number(matrix3dValues[13].trim());
		const moveZ = Number(matrix3dValues[14].trim());

		return { moveX, moveY, moveZ };
	}

	if (type === 'scale') {
		// convert to percent
		const scaleX = matrix3dValues[0] * 100;
		const scaleY = matrix3dValues[5] * 100;

		//calc scaleZ based on scaleY and scaleX:
		const scaleZ = 1 / (scaleX * scaleY);

		return { scaleX, scaleY, scaleZ };
	}
	if (type === 'rotate') {
		const pi = Math.PI,
			sinB = parseFloat(matrix3dValues[8]),
			b = Math.round((Math.asin(sinB) * 180) / pi),
			cosB = Math.cos((b * pi) / 180),
			matrixVal10 = parseFloat(matrix3dValues[9]),
			a = Math.round((Math.asin(-matrixVal10 / cosB) * 180) / pi),
			matrixVal1 = parseFloat(matrix3dValues[0]),
			c = Math.round((Math.acos(matrixVal1 / cosB) * 180) / pi);

		const rotateX = a;
		const rotateY = b;
		const rotateZ = c;

		return { rotateX, rotateY, rotateZ };
	}
};

describe('Effects Extension', () => {
	//describe('Extension Initializing', () => {...});

	describe('Opacity', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');

			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update opacity, when adding value', () => {
				cy.get('[aria-label="Opacity"]')
					.parents('[data-cy="base-control"]')
					.within(() => {
						cy.get('input[type=range]').setSliderValue(50);
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'opacity', `${50 / 100}`);

				//Check store
				getWPDataObject().then((data) => {
					expect('50%').to.be.equal(
						getSelectedBlock(data, 'publisherOpacity')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'opacity',
					`${50 / 100}`
				);
			});
		});
	});

	describe('Transform', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');

			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			context('Transform Setting', () => {
				it('should update transform, when add value to self perspective', () => {
					cy.get('[aria-label="Add New Transform"]').click();
					cy.get('[aria-label="Transformation Settings"]').click();

					cy.getParentContainer(
						'Self Perspective',
						'base-control'
					).within(() => {
						cy.get('input[type="number"]').focus();
						cy.get('input[type="number"]').clear();
						cy.get('input[type="number"]').type(150);
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.parent()
						.within(() => {
							cy.get('style')
								.invoke('text')
								.should(
									'include',
									'perspective(150px) translate3d(0px, 0px, 0px)'
								);
						});

					//Check store
					getWPDataObject().then((data) => {
						expect('150px').to.be.equal(
							getSelectedBlock(
								data,
								'publisherTransformSelfPerspective'
							)
						);
					});

					//Check frontEnd
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph')
						.invoke('attr', 'class')
						.then((classNames) => {
							const className = classNames.split(' ')[1];
							cy.get('style#core-block-supports-inline-css')
								.invoke('text')
								.should(
									'include',
									`${className}{transform:perspective(150px) translate3d(0px, 0px, 0px)`
								);
						});
				});

				it('should update transform-origin, when add value to self origin', () => {
					cy.get('[aria-label="Add New Transform"]').click();
					cy.get('[aria-label="Transformation Settings"]').click();

					cy.get('[aria-label="Self Perspective Origin"]').click();
					cy.getByDataTest('popover-body')
						.last()
						.within(() => {
							cy.get('span')
								.contains('center center')
								.click({ force: true });
						});

					//Check block

					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.parent()
						.within(() => {
							cy.get('style')
								.invoke('text')
								.should('include', 'transform-origin: 50% 50%');
						});

					//Check store
					getWPDataObject().then((data) => {
						expect({ top: '50%', left: '50%' }).to.be.deep.equal(
							getSelectedBlock(
								data,
								'publisherTransformSelfOrigin'
							)
						);
					});

					//Check frontEnd
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph')
						.invoke('attr', 'class')
						.then((classNames) => {
							const className = classNames.split(' ')[1];
							cy.get('style#core-block-supports-inline-css')
								.invoke('text')
								.should('include', `${className}`)
								.and('include', 'transform-origin:50% 50%');
						});
				});

				it('should update backface-visibility, when add value to backface-visibility', () => {
					cy.get('[aria-label="Add New Transform"]').click();
					cy.get('[aria-label="Transformation Settings"]').click();

					cy.getParentContainer(
						'Backface Visibility',
						'base-control'
					).within(() => {
						cy.get('[aria-label="Hidden"]').click();
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'backface-visibility', 'hidden');

					//Check store
					getWPDataObject().then((data) => {
						expect('hidden').to.be.equal(
							getSelectedBlock(
								data,
								'publisherBackfaceVisibility'
							)
						);
					});

					//Check frontEnd
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'backface-visibility',
						'hidden'
					);
				});

				it('should update perspective, when add value to child perspective', () => {
					cy.get('[aria-label="Add New Transform"]').click();
					cy.get('[aria-label="Transformation Settings"]').click();

					cy.getParentContainer(
						'Child Perspective',
						'base-control'
					).within(() => {
						cy.get('input[type="number"]').focus();
						cy.get('input[type="number"]').clear();
						cy.get('input[type="number"]').type(150);
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.should('have.css', 'perspective', '150px');

					//Check store
					getWPDataObject().then((data) => {
						expect('150px').to.be.equal(
							getSelectedBlock(
								data,
								'publisherTransformChildPerspective'
							)
						);
					});

					//Check frontEnd
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').should(
						'have.css',
						'perspective',
						'150px'
					);
				});

				it('should update perspective-origin, when add value to child origin', () => {
					cy.get('[aria-label="Add New Transform"]').click();
					cy.get('[aria-label="Transformation Settings"]').click();

					cy.get('[aria-label="Child Perspective Origin"]').click();
					cy.getByDataTest('popover-body')
						.last()
						.within(() => {
							cy.get('span')
								.contains('center center')
								.click({ force: true });
						});

					//Check block

					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.parent()
						.within(() => {
							cy.get('style')
								.invoke('text')
								.should(
									'include',
									'perspective-origin: 50% 50%'
								);
						});

					//Check store
					getWPDataObject().then((data) => {
						expect({ top: '50%', left: '50%' }).to.be.deep.equal(
							getSelectedBlock(
								data,
								'publisherTransformChildOrigin'
							)
						);
					});

					//Check frontEnd
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph')
						.invoke('attr', 'class')
						.then((classNames) => {
							const className = classNames.split(' ')[1];
							cy.get('style#core-block-supports-inline-css')
								.invoke('text')
								.should('include', `${className}`)
								.and('include', 'perspective-origin:50% 50%');
						});
				});
			});

			context('Transform', () => {
				it('should update transform, when add value to move', () => {
					cy.getParentContainer(
						'2D & 3D Transforms',
						'publisher-repeater-control'
					).within(() => {
						cy.get('[aria-label="Add New Transform"]').click();

						cy.getByDataCy('group-control-header').click();
					});
					//Add data
					cy.getByDataTest('popover-body').within(() => {
						cy.get('[aria-label="Move-X"]').clear();
						cy.get('[aria-label="Move-X"]').type(150);
						cy.get('[aria-label="Move-Y"]').clear();
						cy.get('[aria-label="Move-Y"]').type(200);
						cy.get('[aria-label="Move-Z"]').clear();
						cy.get('[aria-label="Move-Z"]').type(100);
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.then(($el) => {
							const matrix = $el.css('transform');
							expect({
								moveX: 150,
								moveY: 200,
								moveZ: 100,
							}).to.be.deep.equal(
								calcMatrix({
									type: 'move',
									matrix,
								})
							);
						});

					//Check store
					getWPDataObject().then((data) => {
						expect([
							{
								type: 'move',
								'move-x': '150px',
								'move-y': '200px',
								'move-z': '100px',
								scale: '100%',
								'rotate-x': '0deg',
								'rotate-y': '0deg',
								'rotate-z': '0deg',
								'skew-x': '0deg',
								'skew-y': '0deg',
								isVisible: true,
							},
						]).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTransform')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').then(($el) => {
						const matrix = $el.css('transform');
						expect({
							moveX: 150,
							moveY: 200,
							moveZ: 100,
						}).to.be.deep.equal(
							calcMatrix({
								type: 'move',
								matrix,
							})
						);
					});
				});

				it('should update transform, when add value to scale', () => {
					cy.getParentContainer(
						'2D & 3D Transforms',
						'publisher-repeater-control'
					).within(() => {
						cy.get('[aria-label="Add New Transform"]').click();

						cy.getByDataCy('group-control-header').click();
					});
					//Add data
					cy.getByDataTest('popover-body').within(() => {
						cy.get('[aria-label="Scale"]').click();
						cy.get('[aria-label="Scale"]')
							.eq(1)
							.parents('[data-cy="base-control"]')
							.within(() => {
								cy.get('input[type=range]').setSliderValue(130);
							});
					});

					//Check block

					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.then(($el) => {
							const matrix = $el.css('transform');
							expect({
								scaleX: 130,
								scaleY: 130,
								scaleZ: 1 / (130 * 130),
							}).to.be.deep.equal(
								calcMatrix({
									type: 'scale',
									matrix,
								})
							);
						});

					//Check store
					getWPDataObject().then((data) => {
						expect([
							{
								type: 'scale',
								'move-x': '0px',
								'move-y': '0px',
								'move-z': '0px',
								scale: '130%',
								'rotate-x': '0deg',
								'rotate-y': '0deg',
								'rotate-z': '0deg',
								'skew-x': '0deg',
								'skew-y': '0deg',
								isVisible: true,
							},
						]).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTransform')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').then(($el) => {
						const matrix = $el.css('transform');
						expect({
							scaleX: 130,
							scaleY: 130,
							scaleZ: 1 / (130 * 130),
						}).to.be.deep.equal(
							calcMatrix({
								type: 'scale',
								matrix,
							})
						);
					});
				});

				it('should update transform, when add value to rotate', () => {
					cy.getParentContainer(
						'2D & 3D Transforms',
						'publisher-repeater-control'
					).within(() => {
						cy.get('[aria-label="Add New Transform"]').click();

						cy.getByDataCy('group-control-header').click();
					});
					//Add data
					cy.getByDataTest('popover-body').within(() => {
						cy.get('[aria-label="Rotate"]').click();
						cy.get('[aria-label="Rotate-X"]').type(10);
						cy.get('[aria-label="Rotate-Y"]').type(20);
						cy.get('[aria-label="Rotate-Z"]').type(30);
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.then(($el) => {
							const matrix = $el.css('transform');
							expect({
								rotateX: 10,
								rotateY: 20,
								rotateZ: 30,
							}).to.be.deep.equal(
								calcMatrix({
									type: 'rotate',
									matrix,
								})
							);
						});
					//Check store
					getWPDataObject().then((data) => {
						expect([
							{
								type: 'rotate',
								'move-x': '0px',
								'move-y': '0px',
								'move-z': '0px',
								scale: '100%',
								'rotate-x': '10deg',
								'rotate-y': '20deg',
								'rotate-z': '30deg',
								'skew-x': '0deg',
								'skew-y': '0deg',
								isVisible: true,
							},
						]).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTransform')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').then(($el) => {
						const matrix = $el.css('transform');
						expect({
							rotateX: 10,
							rotateY: 20,
							rotateZ: 30,
						}).to.be.deep.equal(
							calcMatrix({
								type: 'rotate',
								matrix,
							})
						);
					});
				});

				it('should update transform, when add value to skew', () => {
					cy.getParentContainer(
						'2D & 3D Transforms',
						'publisher-repeater-control'
					).within(() => {
						cy.get('[aria-label="Add New Transform"]').click();

						cy.getByDataCy('group-control-header').click();
					});
					//Add data
					cy.getByDataTest('popover-body').within(() => {
						cy.get('[aria-label="Skew"]').click();

						cy.get('[aria-label="Skew-X"]').type(10);

						cy.get('[aria-label="Skew-Y"]').type(20);
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.then(($el) => {
							const matrix = $el.css('transform');
							expect({
								skewX: 10,
								skewY: 20,
							}).to.be.deep.equal(
								calcMatrix({
									type: 'skew',
									matrix,
								})
							);
						});

					//Check store
					getWPDataObject().then((data) => {
						expect([
							{
								type: 'skew',
								'move-x': '0px',
								'move-y': '0px',
								'move-z': '0px',
								scale: '100%',
								'rotate-x': '0deg',
								'rotate-y': '0deg',
								'rotate-z': '0deg',
								'skew-x': '10deg',
								'skew-y': '20deg',
								isVisible: true,
							},
						]).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTransform')
						);
					});

					//Check frontend
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph').then(($el) => {
						const matrix = $el.css('transform');
						expect({
							skewX: 10,
							skewY: 20,
						}).to.be.deep.equal(
							calcMatrix({
								type: 'skew',
								matrix,
							})
						);
					});
				});

				it('should update transform, when add multiple', () => {
					cy.getParentContainer(
						'2D & 3D Transforms',
						'publisher-repeater-control'
					).within(() => {
						cy.multiClick('[aria-label="Add New Transform"]', 2);

						cy.getByDataCy('group-control-header').eq(0).click();
					});

					//Add data
					cy.getByDataTest('popover-body').within(() => {
						cy.get('[aria-label="Skew"]').click();

						cy.get('[aria-label="Skew-X"]').type(10);

						cy.get('[aria-label="Skew-Y"]').type(20);
					});

					cy.getParentContainer(
						'2D & 3D Transforms',
						'publisher-repeater-control'
					).within(() => {
						cy.getByDataCy('group-control-header').eq(1).click();
					});

					cy.getByDataTest('popover-body').within(() => {
						cy.get('[aria-label="Move-X"]').clear();
						cy.get('[aria-label="Move-X"]').type(150);
						cy.get('[aria-label="Move-Y"]').clear();
						cy.get('[aria-label="Move-Y"]').type(200);
						cy.get('[aria-label="Move-Z"]').clear();
						cy.get('[aria-label="Move-Z"]').type(100);
					});

					//Check block
					cy.getIframeBody()
						.find(`[data-type="core/paragraph"]`)
						.parent()
						.within(() => {
							cy.get('style')
								.invoke('text')
								.should(
									'include',
									'transform: skew(10deg, 20deg) translate3d(150px, 200px, 100px)'
								);
						});

					//Check store
					getWPDataObject().then((data) => {
						expect([
							{
								type: 'skew',
								'move-x': '0px',
								'move-y': '0px',
								'move-z': '0px',
								scale: '100%',
								'rotate-x': '0deg',
								'rotate-y': '0deg',
								'rotate-z': '0deg',
								'skew-x': '10deg',
								'skew-y': '20deg',
								isVisible: true,
							},
							{
								type: 'move',
								'move-x': '150px',
								'move-y': '200px',
								'move-z': '100px',
								scale: '100%',
								'rotate-x': '0deg',
								'rotate-y': '0deg',
								'rotate-z': '0deg',
								'skew-x': '0deg',
								'skew-y': '0deg',
								isVisible: true,
							},
						]).to.be.deep.equal(
							getSelectedBlock(data, 'publisherTransform')
						);
					});

					//Check frontEnd
					savePage();

					redirectToFrontPage();

					cy.get('.publisher-paragraph')
						.invoke('attr', 'class')
						.then((classNames) => {
							const className = classNames.split(' ')[1];
							cy.get('style#core-block-supports-inline-css')
								.invoke('text')
								.should(
									'include',
									`${className}{transform:skew(10deg, 20deg) translate3d(150px, 200px, 100px);}`
								);
						});
				});
			});
		});
	});

	describe('Transition', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');

			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update transition correctly, when add one transition', () => {
				cy.getParentContainer(
					'Transitions',
					'publisher-repeater-control'
				).within(() => {
					cy.get('[aria-label="Add New Transition"]').click();

					cy.getByDataCy('group-control-header').click();
				});
				//add data
				cy.getParentContainer('Type', 'base-control').within(() => {
					cy.get('select').select('margin');
				});

				cy.getByDataTest('transition-input-duration').clear();
				cy.getByDataTest('transition-input-duration').type(200);

				cy.getParentContainer('Timing', 'base-control').within(() => {
					cy.get('select').select('ease-in-out');
				});

				cy.getByDataTest('transition-input-delay').clear();
				cy.getByDataTest('transition-input-delay').type(2000);

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
						'have.css',
						'transition',
						'margin 0.2s ease-in-out 2s'
					);

				//Check store
				getWPDataObject().then((data) => {
					expect([
						{
							type: 'margin',
							duration: '200ms',
							delay: '2000ms',
							timing: 'ease-in-out',
							isVisible: true,
						},
					]).to.be.deep.equal(
						getSelectedBlock(data, 'publisherTransition')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'transition',
					'margin 0.2s ease-in-out 2s'
				);
			});

			it('should update transition correctly, when add multiple transition', () => {
				cy.getParentContainer(
					'Transitions',
					'publisher-repeater-control'
				).within(() => {
					cy.multiClick('[aria-label="Add New Transition"]', 2);

					cy.getByDataCy('group-control-header').eq(0).click();
				});
				//add data
				cy.getByDataTest('popover-body').within(() => {
					cy.getParentContainer('Type', 'base-control').within(() => {
						cy.get('select').select('margin');
					});

					cy.getByDataTest('transition-input-duration').clear();
					cy.getByDataTest('transition-input-duration').type(200);

					cy.getParentContainer('Timing', 'base-control').within(
						() => {
							cy.get('select').select('ease-in-out');
						}
					);

					cy.getByDataTest('transition-input-delay').clear();
					cy.getByDataTest('transition-input-delay').type(2000);
				});

				cy.getParentContainer(
					'Transitions',
					'publisher-repeater-control'
				).within(() => {
					cy.getByDataCy('group-control-header').eq(1).click();
				});

				cy.getByDataTest('popover-body').within(() => {
					cy.getParentContainer('Type', 'base-control').within(() => {
						cy.get('select').select('border');
					});

					cy.getByDataTest('transition-input-duration').clear();
					cy.getByDataTest('transition-input-duration').type(300);

					cy.getParentContainer('Timing', 'base-control').within(
						() => {
							cy.get('select').select('ease-in');
						}
					);

					cy.getByDataTest('transition-input-delay').clear();
					cy.getByDataTest('transition-input-delay').type(3000);
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
						'have.css',
						'transition',
						'margin 0.2s ease-in-out 2s, border 0.3s ease-in 3s'
					);

				//Check store
				getWPDataObject().then((data) => {
					expect([
						{
							type: 'margin',
							duration: '200ms',
							delay: '2000ms',
							timing: 'ease-in-out',
							isVisible: true,
						},
						{
							type: 'border',
							duration: '300ms',
							delay: '3000ms',
							timing: 'ease-in',
							isVisible: true,
						},
					]).to.be.deep.equal(
						getSelectedBlock(data, 'publisherTransition')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'transition',
					'margin 0.2s ease-in-out 2s, border 0.3s ease-in 3s'
				);
			});
		});
	});

	describe('Filter', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');

			cy.getByDataTest('style-tab').click();
		});
		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update filter correctly, when add one drop-shadow', () => {
				cy.getParentContainer(
					'Filters',
					'publisher-repeater-control'
				).within(() => {
					cy.get('[aria-label="Add New Filter Effect"]').click();

					cy.getByDataCy('group-control-header').click();
				});

				//add data
				cy.getByDataTest('popover-body').within(() => {
					cy.getParentContainer('Type', 'base-control').within(() => {
						cy.get('select').select('drop-shadow');
					});

					cy.getByDataTest('filter-drop-shadow-x-input').clear();
					cy.getByDataTest('filter-drop-shadow-x-input').type(50);

					cy.getByDataTest('filter-drop-shadow-y-input').clear();
					cy.getByDataTest('filter-drop-shadow-y-input').type(30);

					cy.getByDataTest('filter-drop-shadow-blur-input').clear();
					cy.getByDataTest('filter-drop-shadow-blur-input').type(40);

					cy.getByDataTest('filter-drop-shadow-color').click();
				});

				cy.getByDataTest('popover-body')
					.last()
					.within(() => {
						cy.get('input[maxlength="9"]').clear();
						cy.get('input[maxlength="9"]').type('cccccc');
					});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
						'have.css',
						'filter',
						'drop-shadow(rgb(204, 204, 204) 50px 30px 40px)'
					);

				//Check store
				getWPDataObject().then((data) => {
					expect([
						{
							type: 'drop-shadow',
							'drop-shadow-x': '50px',
							'drop-shadow-y': '30px',
							'drop-shadow-blur': '40px',
							'drop-shadow-color': '#cccccc',
							isVisible: true,
						},
					]).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFilter')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'filter',
					'drop-shadow(rgb(204, 204, 204) 50px 30px 40px)'
				);
			});

			it('should update filter correctly, when add multiple filter', () => {
				cy.getParentContainer(
					'Filters',
					'publisher-repeater-control'
				).within(() => {
					cy.multiClick('[aria-label="Add New Filter Effect"]', 2);

					cy.getByDataCy('group-control-header').eq(0).click();
				});

				//add data
				cy.getByDataTest('popover-body').within(() => {
					cy.getParentContainer('Type', 'base-control').within(() => {
						cy.getParentContainer('Type', 'base-control').within(
							() => {
								cy.get('select').select('brightness');
							}
						);
					});
					cy.getByDataTest('filter-brightness-input').clear();
					cy.getByDataTest('filter-brightness-input').type(100);
				});

				cy.getParentContainer(
					'Filters',
					'publisher-repeater-control'
				).within(() => {
					cy.getByDataCy('group-control-header').eq(1).click();
				});
				cy.getByDataTest('popover-body').within(() => {
					cy.getParentContainer('Type', 'base-control').within(() => {
						cy.getParentContainer('Type', 'base-control').within(
							() => {
								cy.get('select').select('invert');
							}
						);
					});

					cy.getByDataTest('filter-invert-input').clear();
					cy.getByDataTest('filter-invert-input').type(50);
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
						'have.css',
						'filter',
						`brightness(${100 / 100}) invert(${50 / 100})`
					);

				//Check store
				getWPDataObject().then((data) => {
					expect([
						{
							type: 'brightness',
							brightness: '100%',
							isVisible: true,
						},
						{
							type: 'invert',
							invert: '50%',
							isVisible: true,
						},
					]).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFilter')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'filter',
					`brightness(${100 / 100}) invert(${50 / 100})`
				);
			});
		});
	});

	describe('BackdropFilter', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');

			cy.getByDataTest('style-tab').click();
		});
		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update backdrop-filter correctly, when add one blur', () => {
				cy.getParentContainer(
					'Backdrop Filters',
					'publisher-repeater-control'
				).within(() => {
					cy.get('[aria-label="Add New Backdrop Filter"]').click();

					cy.getByDataCy('group-control-header').click();
				});

				//add data
				cy.getByDataTest('popover-body').within(() => {
					cy.getParentContainer('Type', 'base-control').within(() => {
						cy.get('select').select('blur');
					});

					cy.getByDataTest('filter-blur-input').clear();
					cy.getByDataTest('filter-blur-input').type(5);
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'backdrop-filter', 'blur(5px)');

				//Check store
				getWPDataObject().then((data) => {
					expect([
						{
							type: 'blur',
							blur: '5px',
							isVisible: true,
						},
					]).to.be.deep.equal(
						getSelectedBlock(data, 'publisherBackdropFilter')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'backdrop-filter',
					'blur(5px)'
				);
			});

			it('should update backdrop-filter correctly, when add multiple backdrop-filter', () => {
				cy.getParentContainer(
					'Backdrop Filters',
					'publisher-repeater-control'
				).within(() => {
					cy.multiClick('[aria-label="Add New Backdrop Filter"]', 2);

					cy.getByDataCy('group-control-header').eq(0).click();
				});

				//add data
				cy.getByDataTest('popover-body').within(() => {
					cy.getParentContainer('Type', 'base-control').within(() => {
						cy.getParentContainer('Type', 'base-control').within(
							() => {
								cy.get('select').select('brightness');
							}
						);
					});
					cy.getByDataTest('filter-brightness-input').clear();
					cy.getByDataTest('filter-brightness-input').type(100);
				});

				cy.getParentContainer(
					'Backdrop Filters',
					'publisher-repeater-control'
				).within(() => {
					cy.getByDataCy('group-control-header').eq(1).click();
				});
				cy.getByDataTest('popover-body').within(() => {
					cy.getParentContainer('Type', 'base-control').within(() => {
						cy.getParentContainer('Type', 'base-control').within(
							() => {
								cy.get('select').select('invert');
							}
						);
					});

					cy.getByDataTest('filter-invert-input').clear();
					cy.getByDataTest('filter-invert-input').type(50);
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should(
						'have.css',
						'backdrop-filter',
						`brightness(${100 / 100}) invert(${50 / 100})`
					);

				//Check store
				getWPDataObject().then((data) => {
					expect([
						{
							type: 'brightness',
							brightness: '100%',
							isVisible: true,
						},
						{
							type: 'invert',
							invert: '50%',
							isVisible: true,
						},
					]).to.be.deep.equal(
						getSelectedBlock(data, 'publisherBackdropFilter')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'backdrop-filter',
					`brightness(${100 / 100}) invert(${50 / 100})`
				);
			});
		});
	});

	describe('Cursor', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');

			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update cursor correctly, when add wait', () => {
				cy.getParentContainer('Cursor', 'base-control').within(() => {
					cy.get('button[aria-haspopup="listbox"]').click();

					cy.get('ul').within(() => {
						cy.contains('wait').click();
					});
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'cursor', 'wait');

				//Check store
				getWPDataObject().then((data) => {
					expect('wait').to.be.equal(
						getSelectedBlock(data, 'publisherCursor')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'cursor',
					'wait'
				);
			});
		});
	});

	describe('BlendMode', () => {
		beforeEach(() => {
			addBlockToPost('core/paragraph', true, 'publisher-paragraph');

			cy.getIframeBody()
				.find(`[data-type="core/paragraph"]`)
				.type('this is test text.');

			cy.getByDataTest('style-tab').click();
		});

		//describe('WordPress Compatibility', () => {...});

		describe('Functionality', () => {
			it('should update blend-mode correctly, when add multiply', () => {
				cy.getParentContainer('Blending', 'base-control').within(() => {
					cy.get('button[aria-haspopup="listbox"]').click();

					cy.get('ul').within(() => {
						cy.contains('Multiply').click();
					});
				});

				//Check block
				cy.getIframeBody()
					.find(`[data-type="core/paragraph"]`)
					.should('have.css', 'mix-blend-mode', 'multiply');

				//Check store
				getWPDataObject().then((data) => {
					expect('multiply').to.be.equal(
						getSelectedBlock(data, 'publisherBlendMode')
					);
				});

				//Check frontend
				savePage();

				redirectToFrontPage();

				cy.get('.publisher-paragraph').should(
					'have.css',
					'mix-blend-mode',
					'multiply'
				);
			});
		});
	});
});
