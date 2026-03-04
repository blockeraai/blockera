// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import {
	__experimentalNavigationMenu as NavigationMenu,
	__experimentalNavigationItem as NavigationItem,
} from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
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

const designSystemBackLabel = __('Design System', 'blockera');

export const DesignSystemNavigation = ({
	openCallback,
}: {
	openCallback: () => void,
}): MixedElement => {
	return (
		<>
			<NavigationMenu
				title={
					<>
						<Icon icon="extension-typography" iconSize={20} />
						{__('Design system', 'blockera')}
					</>
				}
				className={extensionClassNames('navigation-category')}
			>
				<NavigationItem
					item="typography"
					id="typography-panel"
					onClick={() =>
						document
							.querySelector('button[id="/typography"]')
							?.click()
					}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret'
					)}
					navigateToMenu="typography"
					title={__('Typography', 'blockera')}
					icon={<Icon icon="wp-typography" iconSize={20} />}
				/>
				<NavigationItem
					item="colors"
					id="colors-panel"
					onClick={() =>
						document.querySelector('button[id="/colors"]')?.click()
					}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret'
					)}
					navigateToMenu="colors"
					title={__('Colors', 'blockera')}
					icon={<Icon icon="wp-colors" iconSize={20} />}
				/>
				<NavigationItem
					item="spacing"
					id="spacing-panel"
					onClick={() => {
						openCallback();
					}}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret'
					)}
					navigateToMenu="spacing"
					title={__('Spacing', 'blockera')}
					icon={<Icon icon="maximize" iconSize={20} />}
				/>
				<NavigationItem
					item="background"
					id="background-panel"
					onClick={() =>
						document
							.querySelector('button[id="/background"]')
							?.click()
					}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret'
					)}
					navigateToMenu="background"
					title={__('Background', 'blockera')}
					icon={<Icon icon="wp-background" iconSize={20} />}
				/>
				<NavigationItem
					item="shadows"
					id="shadows-panel"
					onClick={() =>
						document.querySelector('button[id="/shadows"]')?.click()
					}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret'
					)}
					navigateToMenu="shadows"
					title={__('Shadows', 'blockera')}
					icon={<Icon icon="wp-shadows" iconSize={20} />}
				/>
				<NavigationItem
					item="borders"
					id="borders-panel"
					onClick={() => {
						openCallback();
					}}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret'
					)}
					navigateToMenu="borders"
					title={__('Borders', 'blockera')}
					icon={<Icon icon="border" iconSize={20} />}
				/>
				<NavigationItem
					item="border-radius"
					id="border-radius-panel"
					onClick={() => {
						openCallback();
					}}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret'
					)}
					navigateToMenu="border-radius"
					title={__('Border Radius', 'blockera')}
					icon={<Icon icon="border-radius" iconSize={20} />}
				/>
				<NavigationItem
					item="text-shadows"
					id="text-shadows-panel"
					onClick={() => {
						openCallback();
					}}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret'
					)}
					navigateToMenu="text-shadows"
					title={__('Text Shadows', 'blockera')}
					icon={<Icon icon="wp-shadows" iconSize={20} />}
				/>
				<NavigationItem
					item="transforms"
					id="transforms-panel"
					onClick={() => {
						openCallback();
					}}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret'
					)}
					navigateToMenu="transforms"
					title={__('2D & 3D Transforms', 'blockera')}
					icon={<Icon icon="transform-move" iconSize={20} />}
				/>
				<NavigationItem
					item="transitions"
					id="transitions-panel"
					onClick={() => {
						openCallback();
					}}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret'
					)}
					navigateToMenu="transitions"
					title={__('Transitions', 'blockera')}
					icon={<Icon icon="transition" iconSize={20} />}
				/>
				<NavigationItem
					item="filters"
					id="filters-panel"
					onClick={() => {
						openCallback();
					}}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret'
					)}
					navigateToMenu="filters"
					title={__('Filters', 'blockera')}
					icon={<Icon icon="extension-effects" iconSize={20} />}
				/>
				<NavigationItem
					item="animations"
					id="animations-panel"
					onClick={() => {
						openCallback();
					}}
					className={extensionClassNames(
						'navigation-item',
						'hide-caret',
						{
							'coming-soon': true,
						}
					)}
					navigateToMenu="animations"
					title={
						<>
							<span>{__('Animations', 'blockera')}</span>
							<span className="coming-soon">
								{__('Soon', 'blockera')}
							</span>
						</>
					}
					icon={<Icon icon="animations" iconSize={20} />}
				/>
			</NavigationMenu>

			<Spacing backLabel={designSystemBackLabel} />
			<Borders backLabel={designSystemBackLabel} />
			<Filters backLabel={designSystemBackLabel} />
			<Transforms backLabel={designSystemBackLabel} />
			<Transitions backLabel={designSystemBackLabel} />
			<TextShadows backLabel={designSystemBackLabel} />
			<BorderRadius backLabel={designSystemBackLabel} />
		</>
	);
};
