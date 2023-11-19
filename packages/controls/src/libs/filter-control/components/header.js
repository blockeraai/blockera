// @flow
/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */

import { default as BlurIcon } from '../icons/blur';
import { default as DropShadowIcon } from '../icons/drop-shadow';
import { default as BrightnessIcon } from '../icons/brightness';
import { default as ContrastIcon } from '../icons/contrast';
import { default as GrayscaleIcon } from '../icons/grayscale';
import { default as HueRotateIcon } from '../icons/hue-rotate';
import { default as InvertIcon } from '../icons/invert';
import { default as SaturationIcon } from '../icons/saturate';
import { default as SepiaIcon } from '../icons/sepia';
import type { THeaderItem } from '../types';

const RepeaterItemHeader: THeaderItem = memo<THeaderItem>(
	({
		item,
		itemId,
		isOpen,
		setOpen,
		children,
		isOpenPopoverEvent,
	}: THeaderItem): Element<any> => {
		let label, icon, value;

		switch (item.type) {
			case 'blur':
				label = __('Blur', 'publisher-core');
				value = item.blur;
				icon = <BlurIcon />;
				break;

			case 'drop-shadow':
				label = __('Drop Shadow', 'publisher-core');
				value = `${item['drop-shadow-x']} ${item['drop-shadow-y']} ${item['drop-shadow-blur']}`;
				icon = <DropShadowIcon />;
				break;

			case 'brightness':
				label = __('Brightness', 'publisher-core');
				value = item.brightness;
				icon = <BrightnessIcon />;
				break;

			case 'contrast':
				label = __('Contrast', 'publisher-core');
				value = item.contrast;
				icon = <ContrastIcon />;
				break;

			case 'hue-rotate':
				label = __('Hue Rotate', 'publisher-core');
				value = item['hue-rotate'];
				icon = <HueRotateIcon />;
				break;

			case 'saturate':
				label = __('Saturation', 'publisher-core');
				value = item.saturate;
				icon = <SaturationIcon />;
				break;

			case 'grayscale':
				label = __('Grayscale', 'publisher-core');
				value = item.grayscale;
				icon = <GrayscaleIcon />;
				break;

			case 'invert':
				label = __('Invert', 'publisher-core');
				value = item.invert;
				icon = <InvertIcon />;
				break;

			case 'sepia':
				label = __('Sepia', 'publisher-core');
				value = item.sepia;
				icon = <SepiaIcon />;
				break;
		}

		return (
			<div
				className={controlInnerClassNames('repeater-group-header')}
				onClick={(event) =>
					isOpenPopoverEvent(event) && setOpen(!isOpen)
				}
				aria-label={sprintf(
					// translators: it's the aria label for repeater item
					__('Item %d', 'publisher-core'),
					itemId + 1
				)}
			>
				<span className={controlInnerClassNames('header-icon')}>
					{icon}
				</span>

				<span className={controlInnerClassNames('header-label')}>
					{label}
				</span>

				<span className={controlInnerClassNames('header-values')}>
					{value}
				</span>

				{children}
			</div>
		);
	}
);
export default RepeaterItemHeader;
