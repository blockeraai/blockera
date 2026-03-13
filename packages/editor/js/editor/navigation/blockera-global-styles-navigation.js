// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import { useEffect, useCallback } from '@wordpress/element';
import { Navigator, useNavigator } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Flex } from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { OtherNavigation } from './other-navigation';
import { GeneralNavigation } from './general-navigation';
import { GlobalStylesNavigation } from './global-styles-navigation';
import { DesignSystemNavigation } from './design-system-navigation';

export const initPath = '/';
const wpRootClassname = '.edit-site-global-styles-screen-root';
const overrideClassname = 'is-open-blockera-navigation-override';
const blockeraNavPanelClassname = 'is-open-blockera-navigation-panel';

function PathSync() {
	const { location } = useNavigator();
	const path = location?.path ?? '/';

	useEffect(() => {
		const root = document.querySelector(wpRootClassname);
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
			.querySelector(wpRootClassname)
			?.classList?.remove(overrideClassname);
		document
			.querySelector(wpRootClassname)
			?.classList?.remove(blockeraNavPanelClassname);
	}, []);

	return (
		<div className="blockera-block-inspector-controls-wrapper">
			<Navigator
				initialPath={initPath}
				className={extensionClassNames('navigation')}
			>
				<PathSync />

				<Navigator.Screen
					path={initPath}
					className={extensionClassNames('navigation-categories')}
				>
					<div className={extensionClassNames('navigation-category')}>
						<Navigator.Button
							path="/variations"
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
					<DesignSystemNavigation />
					<GeneralNavigation />
					<GlobalStylesNavigation className={className} />
					<OtherNavigation />
				</Navigator.Screen>

				<DesignSystemNavigation.Screens closeCallback={closeCallback} />
				<OtherNavigation.Screens closeCallback={closeCallback} />
			</Navigator>
		</div>
	);
};
