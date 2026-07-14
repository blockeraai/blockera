/**
 * WordPress dependencies
 */
import { __, _n } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import Flex from '../../../../flex';
import { Button } from '../../../../button';
import NoticeControl from '../../../../notice-control';

/**
 * @param {Object}   props
 * @param {'info' | 'warning'} props.variant Notice severity.
 * @param {number}             props.distinctFillCount Distinct hardcoded fill count for plural button label.
 * @param {boolean}  props.disabled        Disable action.
 * @param {boolean}  props.isBusy          Editor busy state.
 * @param {Function} props.onNormalize     Normalize click handler.
 */
export default function SvgColorNormalizeNotice({
	variant = 'info',
	distinctFillCount = 1,
	disabled = false,
	isBusy = false,
	onNormalize = () => {},
}) {
	const isMultiColor = variant === 'warning';

	return (
		<div
			className={controlInnerClassNames(
				'icon-picker-svg-editor-color-notice'
			)}
		>
			<NoticeControl type="warning" showIcon={true}>
				<Flex
					alignItems="center"
					justifyContent="space-between"
					gap="12px"
					className={controlInnerClassNames(
						'icon-picker-svg-editor-color-notice-inner'
					)}
				>
					<span
						className={controlInnerClassNames(
							'icon-picker-svg-editor-color-notice-text'
						)}
					>
						{isMultiColor
							? __(
									'This SVG defines multiple fixed colors, so icon color cannot be applied to them. Fixing removes solid colors and gradients.',
									'blockera'
								)
							: __(
									'This SVG defines its own colors, so icon color cannot be applied. Fix the SVG to apply icon color from block settings.',
									'blockera'
								)}
					</span>
					<Button
						className={controlInnerClassNames(
							'icon-picker-svg-editor-color-notice-btn'
						)}
						variant="secondary"
						size="extra-small"
						onClick={onNormalize}
						disabled={disabled || isBusy}
					>
						{_n(
							'Fix color',
							'Fix colors',
							Math.max(distinctFillCount, 1),
							'blockera'
						)}
					</Button>
				</Flex>
			</NoticeControl>
		</div>
	);
}
