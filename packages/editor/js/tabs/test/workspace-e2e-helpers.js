/**
 * Shared helpers for tabs/workspace editor e2e specs (CI stability).
 */

/**
 * Focus the post title field in the editor canvas and set text (works with
 * contenteditable title and legacy textarea).
 *
 * @param {string} text
 */
export function setPostTitleInCanvas(text) {
	cy.getIframeBody()
		.find('.edit-post-visual-editor__post-title-wrapper')
		.should('be.visible')
		.first()
		.within(() => {
			cy.get(
				'[contenteditable="true"], textarea.editor-post-title__input, .editor-post-title__input'
			)
				.first()
				.should('be.visible')
				.click({ force: true })
				.type('{selectall}{backspace}' + text, {
					delay: 0,
				});
		});
}
