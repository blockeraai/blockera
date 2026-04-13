// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	Borders,
	Filters,
	TextShadows,
	Spacing,
	Transforms,
	colorsPanelHandler,
	shadowsPanelHandler,
	typographyPanelHandler,
} from '@blockera/global-styles-ui';
import { Icon } from '@blockera/icons';
import { Flex } from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { Transitions } from './transitions';
import { BorderRadius } from './border-radius';
import { NavItemButton } from './nav-item-button';
import { NavItemScreen } from './nav-item-screen';
import { navItemClassName } from './nav-item-classname';
import { initPath } from './blockera-global-styles-navigation';

export const DesignSystemNavigation = (): MixedElement => {
	return (
		<div className={extensionClassNames('navigation-category')}>
			<h2>
				<Flex alignItems="center" justifyContent="flex-start">
					<Icon icon="extension-typography" iconSize={22} />
					{__('Design system', 'blockera')}
				</Flex>
			</h2>
			<NavItemButton
				className={navItemClassName()}
				onClick={typographyPanelHandler}
				id="typography-panel"
				path="typography"
				label={__('Typography', 'blockera')}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="wp-typography" iconSize={22} />
					</Flex>
				}
			/>
			<NavItemButton
				className={navItemClassName()}
				path={'colors'}
				id="colors-panel"
				onClick={colorsPanelHandler}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="wp-colors" iconSize={22} />
					</Flex>
				}
				label={__('Colors', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="spacing-panel"
				path={'spacing'}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="maximize" iconSize={22} />
					</Flex>
				}
				label={__('Spacing', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="background-panel"
				path={`background`}
				onClick={() =>
					document.querySelector('button[id="/background"]')?.click()
				}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="wp-background" iconSize={22} />
					</Flex>
				}
				label={__('Background', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="shadows-panel"
				path={'shadows'}
				onClick={shadowsPanelHandler}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="wp-shadows" iconSize={22} />
					</Flex>
				}
				label={__('Shadows', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="borders-panel"
				path={'borders'}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="border" iconSize={14} />
					</Flex>
				}
				label={__('Borders', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="border-radius-panel"
				path={'border-radius'}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="border-radius" iconSize={14} />
					</Flex>
				}
				label={__('Border Radius', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="text-shadows-panel"
				path={'text-shadows'}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="text-shadow" iconSize={22} />
					</Flex>
				}
				label={__('Text Shadows', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="transforms-panel"
				path={'transforms'}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="transform-move" iconSize={18} />
					</Flex>
				}
				label={__('2D & 3D Transforms', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="transitions-panel"
				path={'transitions'}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="transition" iconSize={18} />
					</Flex>
				}
				label={__('Transitions', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName()}
				id="filters-panel"
				path={'filters'}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="extension-effects" iconSize={20} />
					</Flex>
				}
				label={__('Filters', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName({ 'coming-soon': true })}
				id="animations-panel"
				path={'animations'}
				label={__('Animations', 'blockera')}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="animations" iconSize={18} />
					</Flex>
				}
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
				backLabel={__('Spacing', 'blockera')}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>

		<NavItemScreen path={`${initPath}borders`}>
			<Borders
				backLabel={__('Borders', 'blockera')}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>

		<NavItemScreen path={`${initPath}border-radius`}>
			<BorderRadius
				backLabel={__('Border Radius', 'blockera')}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>

		<NavItemScreen path={`${initPath}text-shadows`}>
			<TextShadows
				backLabel={__('Text Shadows', 'blockera')}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>

		<NavItemScreen path={`${initPath}transforms`}>
			<Transforms
				backLabel={__('2D & 3D Transforms', 'blockera')}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>

		<NavItemScreen path={`${initPath}transitions`}>
			<Transitions
				backLabel={__('Transitions', 'blockera')}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>

		<NavItemScreen path={`${initPath}filters`}>
			<Filters
				backLabel={__('Filters', 'blockera')}
				closeCallback={closeCallback}
			/>
		</NavItemScreen>
	</>
);
