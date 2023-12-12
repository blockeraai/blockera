// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { isArray } from '@publisher/utils';
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import RepeaterItemHeader from './components/header';
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';
import type { TBackgroundControlProps } from './types';

export default function BackgroundControl({
	defaultValue,
	defaultRepeaterItemValue,
	popoverLabel,
	className,
	...props
}: TBackgroundControlProps): MixedElement {
	// it's commented because we wait for field context provider to use it.
	function valueCleanup(value: any | Array<Object>) {
		if (!isArray(value)) {
			return value;
		}

		return value.map((item) => {
			if (item?.type !== 'image') {
				delete item.image;
				delete item['image-size'];
				delete item['image-size-width'];
				delete item['image-size-height'];
				delete item['image-position'];
				delete item['image-repeat'];
				delete item['image-attachment'];
			}

			if (item?.type !== 'mesh-gradient') {
				delete item['mesh-gradient'];
				delete item['mesh-gradient-colors'];
				delete item['mesh-gradient-attachment'];
			}

			if (item?.type !== 'linear-gradient') {
				delete item['linear-gradient'];
				delete item['linear-gradient-angel'];
				delete item['linear-gradient-repeat'];
				delete item['linear-gradient-attachment'];
			}

			if (item?.type !== 'radial-gradient') {
				delete item['radial-gradient'];
				delete item['radial-gradient-position'];
				delete item['radial-gradient-size'];
				delete item['radial-gradient-repeat'];
				delete item['radial-gradient-attachment'];
			}

			// internal usage
			delete item.isOpen;

			return item;
		});
	}

	return (
		<RepeaterControl
			defaultValue={defaultValue}
			className={controlClassNames('background', className)}
			popoverLabel={popoverLabel}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			popoverClassName={controlClassNames('background-popover')}
			{...props}
			valueCleanup={valueCleanup}
		/>
	);
}

export { getBackgroundItemBGProperty } from './utils';

BackgroundControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.array,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * className that will be use in repeater control wrapper and popover class name.
	 */
	className: PropTypes.string,
	/**
	 * Default value of each repeater item
	 */
	//$FlowFixMe
	defaultRepeaterItemValue: PropTypes.shape({
		type: PropTypes.oneOf([
			'image',
			'linear-gradient',
			'radial-gradient',
			'mesh-gradient',
		]),
		image: PropTypes.string,
		'image-size': PropTypes.string,
		'image-size-width': PropTypes.string,
		'image-size-height': PropTypes.string,
		'image-position': PropTypes.shape({
			top: PropTypes.string,
			left: PropTypes.string,
		}),
		'image-repeat': PropTypes.string,
		'image-attachment': PropTypes.string,
		'linear-gradient': PropTypes.string,
		'linear-gradient-angel': PropTypes.string,
		'linear-gradient-repeat': PropTypes.string,
		'linear-gradient-attachment': PropTypes.string,
		'radial-gradient': PropTypes.string,
		'radial-gradient-position': PropTypes.shape({
			top: PropTypes.string,
			left: PropTypes.string,
		}),
		'radial-gradient-size': PropTypes.string,
		'radial-gradient-repeat': PropTypes.string,
		'radial-gradient-attachment': PropTypes.string,
		'mesh-gradient': PropTypes.string,
		'mesh-gradient-colors': PropTypes.array,
		'mesh-gradient-attachment': PropTypes.string,
		isVisible: PropTypes.bool,
	}),
	/**
	 * Label for popover
	 */
	popoverLabel: PropTypes.string,
};

BackgroundControl.defaultProps = {
	className: '',
	// $FlowFixMe
	defaultValue: [],
	defaultRepeaterItemValue: {
		type: 'image',
		image: '',
		'image-size': 'custom',
		'image-size-width': 'auto',
		'image-size-height': 'auto',
		'image-position': {
			top: '',
			left: '',
		},
		'image-repeat': 'repeat',
		'image-attachment': 'scroll',
		'linear-gradient': 'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
		'linear-gradient-angel': '90',
		'linear-gradient-repeat': 'no-repeat',
		'linear-gradient-attachment': 'scroll',
		'radial-gradient':
			'radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)',
		'radial-gradient-position': {
			top: '',
			left: '',
		},
		'radial-gradient-size': '',
		'radial-gradient-repeat': 'no-repeat',
		'radial-gradient-attachment': 'scroll',
		'mesh-gradient': '',
		// $FlowFixMe
		'mesh-gradient-colors': [],
		'mesh-gradient-attachment': 'scroll',
		isVisible: true,
	},
	// $FlowFixMe
	popoverLabel: __('Background', 'publisher-core'),
};
