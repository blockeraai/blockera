import { getTargets } from '../helpers';
import { isLoadedSiteEditor } from '@blockera/utils';

describe('getTargets api testing', () => {
	it('should be retrieve targets object for wp version greater equal with 6.6.1', () => {
		expect({
			header: '.editor-header__center',
		}).toStrictEqual({
			header: getTargets('6.6.1')?.header,
		});
	});
	it('should be retrieve targets object for wp 6.6.3-alpha-59007 version', () => {
		expect({
			header: '.editor-header__center',
		}).toStrictEqual({
			header: getTargets('6.6.3-alpha-59007')?.header,
		});
	});

	it('should be retrieve targets object for wp 6.7.3-beta-12345 version', () => {
		expect({
			header: '.editor-header__center',
		}).toStrictEqual({
			header: getTargets('6.7.3-beta-12345')?.header,
		});
	});

	it('should be retrieve targets object for wp 6.6 version', () => {
		expect({
			header: isLoadedSiteEditor()
				? '.edit-site-header-edit-mode__center'
				: '.edit-post-header__center',
		}).toStrictEqual({
			header: getTargets('6.6')?.header,
		});
	});
});
