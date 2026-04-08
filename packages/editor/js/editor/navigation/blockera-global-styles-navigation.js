// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import { Navigator, useNavigator } from '@wordpress/components';
import { useLayoutEffect, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Flex } from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { NavItemScreen } from './nav-item-screen';
import { OtherNavigation } from './other-navigation';
import { GeneralNavigation } from './general-navigation';
import { DesignSystemNavigation } from './design-system-navigation';

export const initPath = '/';
export const wpRootSelector = '.edit-site-global-styles-screen-root';
export const overrideClassname = 'is-open-blockera-navigation-override';
export const blockeraAdditionalPanelClassname = 'blockera-customized-panel';
export const blockeraNavPanelClassname = 'is-open-blockera-navigation-panel';

function PathSync() {
	const { location } = useNavigator();
	const path = location?.path ?? '/';

	useLayoutEffect(() => {
		const root = document.querySelector(wpRootSelector);
		if (!root) {
			return;
		}

		if (path === '/css') {
			root.classList.add(overrideClassname);
		} else {
			root.classList.remove(overrideClassname);
		}

		const panelPaths = [
			'/spacing',
			'/shadows',
			'/borders',
			'/border-radius',
			'/text-shadows',
			'/transforms',
			'/transitions',
			'/filters',
		];

		if (panelPaths.includes(path)) {
			root.classList.add(blockeraNavPanelClassname);
		} else {
			root.classList.remove(blockeraNavPanelClassname);
		}

		const navPanelClassname = '.blockera-navigation-panel';

		if (document?.querySelector(navPanelClassname)) {
			setTimeout(() => {
				// $FlowFixMe
				document.querySelector(navPanelClassname).style.display =
					'block';
			}, 10);
		}
	}, [path]);

	return null;
}

export const BlockeraGlobalStylesNavigation = ({
	className,
}: {
	className: string,
}): MixedElement => {
	const closeCallback = useCallback(() => {
		document
			.querySelector(wpRootSelector)
			?.classList?.remove(overrideClassname);
		document
			.querySelector(wpRootSelector)
			?.classList?.remove(blockeraNavPanelClassname);
	}, []);

	return (
		<div className="blockera-block-inspector-controls-wrapper">
			<Navigator
				initialPath={initPath}
				className={extensionClassNames('navigation')}
			>
				<PathSync />

				<NavItemScreen
					path={initPath}
					className={extensionClassNames('navigation-categories')}
				>
					<div className={extensionClassNames('navigation-category')}>
						<Navigator.Button
							path={`${initPath}variations`}
							onClick={() =>
								document
									.querySelector('button[id="/variations"]')
									?.click()
							}
						>
							<Flex
								alignItems="center"
								justifyContent="space-between"
								className={extensionClassNames(
									'navigation-item'
								)}
							>
								{__('Browse styles', 'blockera')}
								<Icon icon="chevron-right" library="wp" />
							</Flex>
						</Navigator.Button>
					</div>
					<GeneralNavigation className={className} />
					<DesignSystemNavigation />
					<OtherNavigation />
				</NavItemScreen>

				<DesignSystemNavigation.Screens closeCallback={closeCallback} />
				<OtherNavigation.Screens closeCallback={closeCallback} />
			</Navigator>
		</div>
	);
};
