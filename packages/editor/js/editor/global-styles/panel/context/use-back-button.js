// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

export const useBackButton = ({
	className,
	selectedBlockStyle,
	setSelectedBlockRef,
	setSelectedBlockStyle,
	resetBlockStateToNormal,
	setSelectedBlockStyleVariation,
	setSelectedBlockSizeVariation,
	statesManagerHandleOnChangeRef,
}: {
	className: string,
	selectedBlockStyle: string,
	resetBlockStateToNormal: () => void,
	statesManagerHandleOnChangeRef?: {
		current: ((value: Object) => void) | null,
	},
	setSelectedBlockRef: (blockRef: string | void) => void,
	setSelectedBlockStyle: (blockName: string | void) => void,
	setSelectedBlockStyleVariation: (blockName: string | void) => void,
	setSelectedBlockSizeVariation?: (variation: Object | void) => void,
}) => {
	const backElement = document.querySelector('.components-heading');

	if (!backElement) {
		return;
	}

	if (backElement && selectedBlockStyle) {
		backElement.innerText = __('Blocks', 'blockera');
		const parent =
			backElement?.parentElement?.parentElement?.parentElement
				?.parentElement?.parentElement;

		// $FlowFixMe
		if (parent && parent?.style) {
			// $FlowFixMe
			parent.style.display = 'block';
		}

		backElement?.parentElement?.parentElement
			?.querySelector('button')
			?.addEventListener(
				'click',
				() => {
					if (statesManagerHandleOnChangeRef?.current) {
						resetBlockStateToNormal();
					}

					document.body?.classList?.remove(className);
					const dataTest = document.body?.getAttribute('data-test');
					if (dataTest) {
						document.body?.setAttribute(
							'data-test',
							dataTest.replace(
								'has-blockera-global-styles-ui',
								''
							)
						);
					}

					setSelectedBlockRef(undefined);
					setSelectedBlockStyle(undefined);
					setSelectedBlockStyleVariation(undefined);
					setSelectedBlockSizeVariation?.(undefined);
				},
				{
					once: true,
				}
			);
	}
};
