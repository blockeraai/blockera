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
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

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
import { prepValueForHeader } from '../../repeater-control/utils';

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
				label = __('Blur', 'blockera-core');
				value = prepValueForHeader(item.blur);
				icon = <BlurIcon />;
				break;

			case 'drop-shadow':
				label = __('Drop Shadow', 'blockera-core');
				value = (
					<>
						{prepValueForHeader(item['drop-shadow-x'])}
						{prepValueForHeader(item['drop-shadow-y'])}
						{prepValueForHeader(item['drop-shadow-blur'])}
					</>
				);
				icon = <DropShadowIcon />;
				break;

			case 'brightness':
				label = __('Brightness', 'blockera-core');
				value = prepValueForHeader(item.brightness);
				icon = <BrightnessIcon />;
				break;

			case 'contrast':
				label = __('Contrast', 'blockera-core');
				value = prepValueForHeader(item.contrast);
				icon = <ContrastIcon />;
				break;

			case 'hue-rotate':
				label = __('Hue Rotate', 'blockera-core');
				value = prepValueForHeader(item['hue-rotate']);
				icon = <HueRotateIcon />;
				break;

			case 'saturate':
				label = __('Saturation', 'blockera-core');
				value = prepValueForHeader(item.saturate);
				icon = <SaturationIcon />;
				break;

			case 'grayscale':
				label = __('Grayscale', 'blockera-core');
				value = prepValueForHeader(item.grayscale);
				icon = <GrayscaleIcon />;
				break;

			case 'invert':
				label = __('Invert', 'blockera-core');
				value = prepValueForHeader(item.invert);
				icon = <InvertIcon />;
				break;

			case 'sepia':
				label = __('Sepia', 'blockera-core');
				value = prepValueForHeader(item.sepia);
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
					__('Item %d', 'blockera-core'),
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
