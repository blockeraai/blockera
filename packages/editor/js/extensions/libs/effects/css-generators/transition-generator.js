/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';
import { getValueAddonRealValue, getSortedRepeater } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';

export function TransitionGenerator(id, props, options) {
	const { attributes } = props;

	if (!Object.keys(attributes?.blockeraTransition)?.length) {
		return '';
	}

	const value = getSortedRepeater(attributes?.blockeraTransition)
		?.map(([, item]) => {
			if (!item.isVisible) {
				return null;
			}

			return `${item.type} ${getValueAddonRealValue(
				item.duration
			)} ${getTimingCSS(item.timing)} ${getValueAddonRealValue(
				item.delay
			)}`;
		})
		?.filter((item) => null !== item);

	return createCssDeclarations({
		options,
		properties: {
			transition: value?.join(', '),
		},
	});
}

const getTimingCSS = (timing) => {
	const allTimings = {
		linear: 'linear',
		ease: 'ease',
		'ease-in': 'ease-in',
		'ease-out': 'ease-out',
		'ease-in-out': 'ease-in-out',
		//
		'ease-in-quad': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
		'ease-in-cubic': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
		'ease-in-quart': 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
		'ease-in-quint': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
		'ease-in-sine': 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
		'ease-in-expo': 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
		'ease-in-circ': 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
		'ease-in-back': 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
		//
		'ease-out-quad': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
		'ease-out-cubic': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
		'ease-out-quart': 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
		'ease-out-quint': 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
		'ease-out-sine': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
		'ease-out-expo': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
		'ease-out-circ': 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
		'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
		//
		'ease-in-out-quad': 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
		'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
		'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
		'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
		'ease-in-out-sine': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
		'ease-in-out-expo': 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
		'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
		'ease-in-out-back': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
	};

	return !isUndefined(allTimings[timing]) ? allTimings[timing] : 'ease';
};
