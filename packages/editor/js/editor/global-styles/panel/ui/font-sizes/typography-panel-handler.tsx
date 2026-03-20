/**
 * Internal dependencies
 */
import FontSizes from '.';
import {
	overrideClassname,
	blockeraAdditionalPanelClassname,
} from '../../../../navigation/blockera-global-styles-navigation';
import { IntersectionObserverRenderer } from '../../../../intersection-observer-renderer';

export const typographyPanelHandler = (): void => {
	(
		document.querySelector('button[id="/typography"]') as HTMLButtonElement
	)?.click();

	const screen = '.edit-site-global-styles-sidebar__navigator-screen';

	const wpSidebarSelector = `${screen} .edit-site-global-styles-screen div[data-wp-component="VStack"]`;

	const observer = new IntersectionObserverRenderer(
		screen,
		() => <FontSizes screenSelector={wpSidebarSelector} />,
		{
			targetElementIsRoot: true,
			callback: () => {
				document.body?.classList?.add(blockeraAdditionalPanelClassname);
				document
					.querySelector(screen)
					?.classList?.add(overrideClassname);
			},
			whenBodyHasClassname: blockeraAdditionalPanelClassname,
			componentSelector: '.blockera-font-size-presets-navigation',
			whileNotExistSelectors: ['.blockera-font-size-presets-count'],
		}
	);

	setTimeout(() => {
		observer.destroy();
	}, 1000);
};
