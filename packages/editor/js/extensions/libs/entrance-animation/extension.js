// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	ControlContextProvider,
	PanelBodyControl,
	RepeaterControl,
} from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import { isActiveField, isActiveExtension } from '../../api/utils';
import { useBlockSection } from '../../components';
import { useFeatureSearch } from '../../components/feature-search-context';
import type { EntranceExtensionProps } from './types/props';

export const EntranceAnimationExtension: ComponentType<
	EntranceExtensionProps
> = ({
	values: {},
	block,
	extensionConfig,
}: EntranceExtensionProps): MixedElement => {
	const { initialOpen, onToggle } = useBlockSection(
		'entranceAnimationConfig'
	);
	const { activeSearchMode } = useFeatureSearch();

	if (!isActiveExtension(extensionConfig)) {
		return <></>;
	}

	if (!isActiveField(extensionConfig.blockeraEntranceAnimation)) {
		return <></>;
	}

	return (
		<PanelBodyControl
			onToggle={onToggle}
			title={__('On Entrance', 'blockera')}
			initialOpen={initialOpen}
			noWrapper={activeSearchMode}
			icon={<Icon icon="extension-entrance-animation" />}
			className={extensionClassNames('entrance-animation')}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'entranceAnimation'),
					value: {},
					attribute: 'blockeraEntranceAnimation',
					blockName: block.blockName,
				}}
				storeName={'blockera/controls/repeater'}
			>
				<RepeaterControl
					label=""
					defaultValue={{}}
					design="large"
					icon={<Icon icon="entrance-animation" iconSize="26" />}
					description={__(
						'Block will animate when it enters into view.',
						'blockera'
					)}
					actionButtonAdd={false}
					injectHeaderButtonsStart={
						<span
							style={{
								color: 'var(--blockera-controls-primary-color)',
								fontStyle: 'italic',
							}}
						>
							{__('Coming soon…', 'blockera')}
						</span>
					}
				/>
			</ControlContextProvider>
		</PanelBodyControl>
	);
};
