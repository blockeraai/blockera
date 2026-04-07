/**
 * Internal dependencies
 */
import Colors from '.';
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';

export const colorsPanelHandler = (): void => {
	const colorsBodyClassname = 'is-open-blockera-colors-navigation-override';
	document.body?.classList?.add(colorsBodyClassname);

	(
		document.querySelector('button[id="/colors"]') as HTMLButtonElement
	)?.click();

	const screen = '.edit-site-global-styles-sidebar__navigator-screen';

	const wpSidebarSelector = `${screen} .edit-site-global-styles-screen > div[data-wp-component="VStack"]`;

	const observer = new IntersectionObserverRenderer(
		screen,
		() => <Colors screenSelector={wpSidebarSelector} />,
		{
			targetElementIsRoot: true,
			whenBodyHasClassname: colorsBodyClassname,
			componentSelector: '.blockera-colors-presets-navigation',
			whileNotExistSelectors: ['.blockera-colors-presets-count'],
		}
	);

	setTimeout(() => {
		observer.destroy();
	}, 1000);
};
