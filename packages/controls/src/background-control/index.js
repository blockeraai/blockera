/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import Header from './components/header';
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';

export default function BackgroundControl({
	initValue = {
		type: 'image',
		image: '',
		'image-size': 'custom',
		'image-size-width': 'auto',
		'image-size-height': 'auto',
		'image-position-top': '0%',
		'image-position-left': '0%',
		'image-repeat': 'repeat',
		'image-attachment': 'scroll',
		'linear-gradient': 'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
		'linear-gradient-repeat': 'no-repeat',
		'linear-gradient-attachment': 'scroll',
		'radial-gradient':
			'radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)',
		'radial-gradient-position-top': '50%',
		'radial-gradient-position-left': '50%',
		'radial-gradient-size': 'farthest-corner',
		'radial-gradient-repeat': 'no-repeat',
		'radial-gradient-attachment': 'scroll',
		'mesh-gradient': '',
		'mesh-gradient-colors': [],
		'mesh-gradient-attachment': 'scroll',
		isVisible: true,
	},
	popoverLabel = __('Background', 'publisher-core'),
	//
	className,
	...props
}) {
	return (
		<RepeaterControl
			className={controlClassNames('background', className)}
			popoverLabel={popoverLabel}
			Header={Header}
			InnerComponents={Fields}
			initValue={initValue}
			repeaterItemsPopoverClassName={controlClassNames(
				'background-popover'
			)}
			{...props}
		/>
	);
}

export { getBackgroundItemBGProperty } from './utils';
