// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Flex } from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { Spacing } from './spacing';
import { Borders } from './borders';
import { Filters } from './filters';
import { Transforms } from './transforms';
import { Transitions } from './transitions';
import { TextShadows } from './text-shadows';
import { BorderRadius } from './border-radius';
import { NavItemButton } from './nav-item-button';
import { NavItemScreen } from './nav-item-screen';
import { navItemClassName } from './nav-item-classname';
import { initPath } from './blockera-global-styles-navigation';
import { colorsPanelHandler } from '../global-styles/panel/ui/colors/colors-panel-handler.tsx';
import { typographyPanelHandler } from '../global-styles/panel/ui/font-sizes/typography-panel-handler.tsx';

const designSystemBackLabel = __('Design System', 'blockera');

export const DesignSystemNavigation = (): MixedElement => {
	return (
		<div className={extensionClassNames('navigation-category')}>
			<h2>
				<Flex alignItems="center" justifyContent="flex-start">
					<Icon icon="extension-typography" iconSize={20} />
					{__('Design system', 'blockera')}
				</Flex>
			</h2>
			<NavItemButton
				className={navItemClassName()}
				onClick={typographyPanelHandler}
				id="typography-panel"
				path="typography"
				label={__('Typography', 'blockera')}
				icon={<Icon icon="wp-typography" iconSize={20} />}
			/>
			<NavItemButton
				className={navItemClassName()}
				path={'colors'}
				id="colors-panel"
				onClick={colorsPanelHandler}
				icon={<Icon icon="wp-colors" iconSize={20} />}
				label={__('Colors', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="spacing-panel"
				path={'spacing'}
				icon={<Icon icon="maximize" iconSize={20} />}
				label={__('Spacing', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="background-panel"
				path={`background`}
				onClick={() =>
					document.querySelector('button[id="/background"]')?.click()
				}
				icon={<Icon icon="wp-background" iconSize={20} />}
				label={__('Background', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="shadows-panel"
				path={'shadows'}
				onClick={() =>
					document.querySelector('button[id="/shadows"]')?.click()
				}
				icon={<Icon icon="wp-shadows" iconSize={20} />}
				label={__('Shadows', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="borders-panel"
				path={'borders'}
				icon={<Icon icon="border" iconSize={20} />}
				label={__('Borders', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="border-radius-panel"
				path={'border-radius'}
				icon={<Icon icon="border-radius" iconSize={20} />}
				label={__('Border Radius', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="text-shadows-panel"
				path={'text-shadows'}
				icon={<Icon icon="wp-shadows" iconSize={20} />}
				label={__('Text Shadows', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="transforms-panel"
				path={'transforms'}
				icon={<Icon icon="transform-move" iconSize={20} />}
				label={__('2D & 3D Transforms', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="transitions-panel"
				path={'transitions'}
				icon={<Icon icon="transition" iconSize={20} />}
				label={__('Transitions', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="filters-panel"
				path={'filters'}
				icon={<Icon icon="extension-effects" iconSize={20} />}
				label={__('Filters', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName({ 'coming-soon': true })}
				id="animations-panel"
				path={'animations'}
				label={__('Animations', 'blockera')}
				icon={<Icon icon="animations" iconSize={20} />}
				isComingSoon={true}
			/>
		</div>
	);
};

DesignSystemNavigation.Screens = ({
	closeCallback,
}: {
	closeCallback: () => void,
}): MixedElement => (
	<>
		<NavItemScreen path={`${initPath}spacing`}>
			<Spacing
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>
		<NavItemScreen path={`${initPath}borders`}>
			<Borders
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>
		<NavItemScreen path={`${initPath}border-radius`}>
			<BorderRadius
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>
		<NavItemScreen path={`${initPath}text-shadows`}>
			<TextShadows
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>
		<NavItemScreen path={`${initPath}transforms`}>
			<Transforms
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>
		<NavItemScreen path={`${initPath}transitions`}>
			<Transitions
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>
		<NavItemScreen path={`${initPath}filters`}>
			<Filters
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>
	</>
);
