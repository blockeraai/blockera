/**
 * Internal dependencies
 */
import Shadows from './';
import { IntersectionObserverRenderer } from '../../../../intersection-observer-renderer';

export const shadowsPanelHandler = (): void => {
	const shadowsBodyClassname = 'is-open-blockera-shadows-navigation-override';
	document.body?.classList?.add(shadowsBodyClassname);

	(
		document.querySelector('button[id="/shadows"]') as HTMLButtonElement
	)?.click();

	const callback = () =>
		document
			?.querySelector('button[data-wp-component="Navigator.BackButton"]')
			?.addEventListener?.(
				'click',
				() =>
					setTimeout(
						() =>
							document.body?.classList?.remove?.(
								shadowsBodyClassname
							),
						100
					),
				{
					once: true,
				}
			);

	const screen = '.edit-site-global-styles-sidebar__navigator-screen';

	const wpSidebarSelector = `${screen} .edit-site-global-styles-screen div[data-wp-component="VStack"]`;

	const observer = new IntersectionObserverRenderer(
		screen,
		() => <Shadows screenSelector={wpSidebarSelector} />,
		{
			callback,
			targetElementIsRoot: true,
			whenBodyHasClassname: shadowsBodyClassname,
			componentSelector: '.blockera-shadows-presets-navigation',
			whileNotExistSelectors: ['.blockera-shadows-presets-count'],
		}
	);

	setTimeout(() => {
		observer.destroy();
	}, 1000);
};
