// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import { PanelBodyControl } from '@publisher/controls';
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { hasSameProps } from '../utils';
import type { EntranceExtensionProps } from './types/props';
import { EntranceAnimationExtensionIcon } from './index';

export const EntranceAnimationExtension: ComponentType<EntranceExtensionProps> =
	memo(
		({
			values: {},
			mouseConfig: {},
		}: EntranceExtensionProps): MixedElement => {
			return (
				<PanelBodyControl
					title={__('On Entrance', 'publisher-core')}
					initialOpen={true}
					icon={<EntranceAnimationExtensionIcon />}
					className={componentClassNames(
						'extension',
						'extension-mouse'
					)}
				>
					On entrance coming soon...
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
