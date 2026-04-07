/**
 * External dependencies
 */
import { Navigator } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { prependPortal } from '@blockera/utils';

/**
 * Internal dependencies
 */
import ColorsScreen from './colors-screen';
import ColorPaletteScreen from './color-palette-screen';
import LinearGradientsScreen from './linear-gradients-screen';
import RadialGradientsScreen from './radial-gradients-screen';
import { NavItemScreen } from '../navigation/nav-item-screen';

const onBack = () => {
	document.body.classList.remove('blockera-cleanup-screen-styles');
	const parent = document.querySelector(
		'.blockera-colors-preset-inspector-active'
	);

	if (parent && parent instanceof HTMLElement) {
		parent.classList.remove('blockera-colors-preset-inspector-active');
		const prev = parent?.parentElement?.previousElementSibling;
		if (prev && prev instanceof HTMLElement) {
			prev.style.removeProperty('display');
		}
	}
};

const onClick = (event: Event) => {
	document.body.classList.add('blockera-cleanup-screen-styles');
	const inspectorWrapper = (event.target as HTMLElement)?.closest(
		'.blockera-block-inspector-controls-wrapper'
	);

	if (
		inspectorWrapper?.parentElement?.parentElement
			?.previousElementSibling &&
		inspectorWrapper.parentElement.parentElement
			.previousElementSibling instanceof HTMLElement
	) {
		inspectorWrapper.parentElement.parentElement.previousElementSibling.style.display =
			'none';
	}

	if (inspectorWrapper?.parentElement) {
		inspectorWrapper.parentElement.classList.add(
			'blockera-colors-preset-inspector-active'
		);
	}
};

interface ColorsProps {
	screenSelector: string;
}

function Colors({ screenSelector }: ColorsProps) {
	return prependPortal(
		<Navigator initialPath="/">
			<NavItemScreen path="/">
				<ColorsScreen onClick={onClick} />
			</NavItemScreen>
			<NavItemScreen path="/colors/palette">
				<ColorPaletteScreen onBackHandler={onBack} />
			</NavItemScreen>
			<NavItemScreen path="/colors/linear-gradients">
				<LinearGradientsScreen onBackHandler={onBack} />
			</NavItemScreen>
			<NavItemScreen path="/colors/radial-gradients">
				<RadialGradientsScreen onBackHandler={onBack} />
			</NavItemScreen>
		</Navigator>,
		document.querySelector(screenSelector)
	);
}

export default Colors;
