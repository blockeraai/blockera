/**
 * Internal dependencies
 */
import FontSizes from '.';
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';

export const typographyPanelHandler = (): void => {
	const typographyBodyClassname =
		'is-open-blockera-typography-navigation-override';
	document.body?.classList?.add(typographyBodyClassname);

	(
		document.querySelector('button[id="/typography"]') as HTMLButtonElement
	)?.click();

	const screen = '.edit-site-global-styles-sidebar__navigator-screen';

	const wpSidebarSelector = `${screen} .edit-site-global-styles-screen div[data-wp-component="VStack"]`;

	new IntersectionObserverRenderer(
		screen,
		() => <FontSizes screenSelector={wpSidebarSelector} />,
		{
			targetElementIsRoot: true,
			whenBodyHasClassname: typographyBodyClassname,
			componentSelector: '.blockera-font-size-presets-navigation',
			whileNotExistSelectors: ['.blockera-font-size-presets-count'],
		}
	);
};
