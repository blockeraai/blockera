/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import Flex from '../../../flex';
import { UpgradePrompt } from '../../../upgrade-prompt';

export default function CustomIconUploadUpgradePrompt({
	isOpen = false,
	onClose = () => {},
}) {
	return (
		<UpgradePrompt
			lockedFeature={{
				icon: <Icon icon="upload" library="wp" iconSize={22} />,
				title: __('Custom SVG Icons', 'blockera'),
				description: (
					<Flex direction="column" gap="6px">
						{__('Upload unlimited custom SVG icons', 'blockera')}
						<Flex direction="column" gap="6px">
							<span className="blockera-free-plan-hint">
								{__('Free: No uploads allowed', 'blockera')}
							</span>
							<span className="blockera-pro-plan-hint">
								{__(
									'Pro: Upload unlimited custom icons',
									'blockera'
								)}
							</span>
						</Flex>
					</Flex>
				),
			}}
			isOpen={isOpen}
			onClose={onClose}
			type="modal"
		/>
	);
}
