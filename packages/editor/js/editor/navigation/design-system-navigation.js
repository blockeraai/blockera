// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import { Navigator } from '@wordpress/components';

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
import { NavItemWrapper } from './nav-item-wrapper';
import { navItemClassName } from './nav-item-classname';
import { initPath } from './blockera-global-styles-navigation';

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
			<NavItemWrapper className={navItemClassName()}>
				<Navigator.Button
					id="typography-panel"
					path={`${initPath}typography`}
					onClick={() =>
						document
							.querySelector('button[id="/typography"]')
							?.click()
					}
				>
					<Icon icon="wp-typography" iconSize={20} />
					{__('Typography', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
			<NavItemWrapper className={navItemClassName()}>
				<Navigator.Button
					id="colors-panel"
					path={`${initPath}colors`}
					onClick={() =>
						document.querySelector('button[id="/colors"]')?.click()
					}
				>
					<Icon icon="wp-colors" iconSize={20} />
					{__('Colors', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
			<NavItemWrapper className={navItemClassName()}>
				<Navigator.Button
					id="spacing-panel"
					path={`${initPath}spacing`}
				>
					<Icon icon="maximize" iconSize={20} />
					{__('Spacing', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
			<NavItemWrapper className={navItemClassName()}>
				<Navigator.Button
					id="background-panel"
					path={`${initPath}background`}
					onClick={() =>
						document
							.querySelector('button[id="/background"]')
							?.click()
					}
				>
					<Icon icon="wp-background" iconSize={20} />
					{__('Background', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
			<NavItemWrapper className={navItemClassName()}>
				<Navigator.Button
					id="shadows-panel"
					path={`${initPath}shadows`}
					onClick={() =>
						document.querySelector('button[id="/shadows"]')?.click()
					}
				>
					<Icon icon="wp-shadows" iconSize={20} />
					{__('Shadows', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
			<NavItemWrapper className={navItemClassName()}>
				<Navigator.Button
					id="borders-panel"
					path={`${initPath}borders`}
					icon={<Icon icon="border" iconSize={20} />}
				>
					{__('Borders', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
			<NavItemWrapper className={navItemClassName()}>
				<Navigator.Button
					id="border-radius-panel"
					path={`${initPath}border-radius`}
					icon={<Icon icon="border-radius" iconSize={20} />}
				>
					{__('Border Radius', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
			<NavItemWrapper className={navItemClassName()}>
				<Navigator.Button
					id="text-shadows-panel"
					path={`${initPath}text-shadows`}
					icon={<Icon icon="wp-shadows" iconSize={20} />}
				>
					{__('Text Shadows', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
			<NavItemWrapper className={navItemClassName()}>
				<Navigator.Button
					id="transforms-panel"
					path={`${initPath}transforms`}
					icon={<Icon icon="transform-move" iconSize={20} />}
				>
					{__('2D & 3D Transforms', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
			<NavItemWrapper className={navItemClassName()}>
				<Navigator.Button
					id="transitions-panel"
					path={`${initPath}transitions`}
					icon={<Icon icon="transition" iconSize={20} />}
				>
					{__('Transitions', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
			<NavItemWrapper className={navItemClassName()}>
				<Navigator.Button
					id="filters-panel"
					path={`${initPath}filters`}
					icon={<Icon icon="extension-effects" iconSize={20} />}
				>
					{__('Filters', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
			<NavItemWrapper
				className={navItemClassName({ 'coming-soon': true })}
			>
				<Navigator.Button
					id="animations-panel"
					path={`${initPath}animations`}
				>
					<Icon icon="animations" iconSize={20} />
					<span>{__('Animations', 'blockera')}</span>
					<span className="coming-soon">
						{__('Soon', 'blockera')}
					</span>
				</Navigator.Button>
			</NavItemWrapper>
		</div>
	);
};

DesignSystemNavigation.Screens = ({
	closeCallback,
}: {
	closeCallback: () => void,
}): MixedElement => (
	<>
		<Navigator.Screen path={`${initPath}spacing`}>
			<Spacing
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</Navigator.Screen>
		<Navigator.Screen path={`${initPath}borders`}>
			<Borders
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</Navigator.Screen>
		<Navigator.Screen path={`${initPath}border-radius`}>
			<BorderRadius
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</Navigator.Screen>
		<Navigator.Screen path={`${initPath}text-shadows`}>
			<TextShadows
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</Navigator.Screen>
		<Navigator.Screen path={`${initPath}transforms`}>
			<Transforms
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</Navigator.Screen>
		<Navigator.Screen path={`${initPath}transitions`}>
			<Transitions
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</Navigator.Screen>
		<Navigator.Screen path={`${initPath}filters`}>
			<Filters
				backLabel={designSystemBackLabel}
				closeCallback={closeCallback}
			/>
		</Navigator.Screen>
	</>
);
