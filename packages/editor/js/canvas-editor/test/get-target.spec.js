import { getTarget } from '../helpers';

describe('getTarget api testing', () => {
	it('should be retrieve target object for wp version greater equal with 6.6.1', () => {
		expect({
			header: '.editor-header__center',
			previewDropdown:
				'.editor-preview-dropdown, a.components-button[aria-label="View Post"], a.components-button[aria-label="View Page"]',
			postPreviewElement: 'a[aria-label="View Post"]',
		}).toStrictEqual(getTarget('6.6.1'));
	});
	it('should be retrieve target object for wp 6.6.3-alpha-59007 version', () => {
		expect({
			header: '.editor-header__center',
			previewDropdown:
				'.editor-preview-dropdown, a.components-button[aria-label="View Post"], a.components-button[aria-label="View Page"]',
			postPreviewElement: 'a[aria-label="View Post"]',
		}).toStrictEqual(getTarget('6.6.3-alpha-59007'));
	});
});
