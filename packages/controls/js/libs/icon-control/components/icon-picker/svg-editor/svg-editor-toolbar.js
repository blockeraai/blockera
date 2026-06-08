/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Button, Tooltip } from '../../../../';
import { getElementLabel } from './svg-editor-utils';

/**
 * @param {boolean} canDelete     Whether delete is allowed.
 * @param {number}  selectedCount Number of selected elements.
 * @return {string} Delete button tooltip text.
 */
function getDeleteTooltipText(canDelete, selectedCount) {
	if (!canDelete) {
		return __('Select an element to delete', 'blockera');
	}

	if (selectedCount > 1) {
		return sprintf(
			/* translators: %d: number of selected SVG elements */
			__('Delete %d selected elements', 'blockera'),
			selectedCount
		);
	}

	return __('Delete selected element', 'blockera');
}

export default function SvgEditorToolbar({
	canUndo = false,
	canRedo = false,
	canDelete = false,
	canUngroup = false,
	selectedCount = 0,
	isBusy = false,
	disabled = false,
	breadcrumb = [],
	onUndo = () => {},
	onRedo = () => {},
	onDelete = () => {},
	onUngroup = () => {},
	onExitGroup = () => {},
}) {
	const isDrilledIn = breadcrumb.length > 1;
	const currentContext =
		breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1] : null;

	return (
		<div
			className={controlInnerClassNames('icon-picker-svg-editor-toolbar')}
		>
			<div
				className={controlInnerClassNames(
					'icon-picker-svg-editor-toolbar-actions'
				)}
			>
				<div
					className={controlInnerClassNames(
						'icon-picker-svg-editor-toolbar-actions-start'
					)}
				>
					<Tooltip
						text={
							canUngroup
								? __(
										'Ungroup — split a group or separate merged path shapes',
										'blockera'
									)
								: __(
										'Select a group or multi-shape path to ungroup',
										'blockera'
									)
						}
					>
						<Button
							className={controlInnerClassNames(
								'icon-picker-svg-editor-toolbar-btn',
								'is-ungroup'
							)}
							variant="tertiary"
							size="extra-small"
							onClick={onUngroup}
							disabled={disabled || !canUngroup || isBusy}
							icon={
								<Icon
									icon="ungroup"
									library="wp"
									iconSize={14}
								/>
							}
						>
							{__('Ungroup', 'blockera')}
						</Button>
					</Tooltip>

					<Tooltip
						text={getDeleteTooltipText(canDelete, selectedCount)}
					>
						<Button
							className={controlInnerClassNames(
								'icon-picker-svg-editor-toolbar-btn',
								'is-delete'
							)}
							variant="tertiary"
							size="extra-small"
							onClick={onDelete}
							disabled={disabled || !canDelete || isBusy}
							icon={
								<Icon icon="trash" library="ui" iconSize={14} />
							}
						>
							{__('Delete', 'blockera')}
						</Button>
					</Tooltip>
				</div>

				<div
					className={controlInnerClassNames(
						'icon-picker-svg-editor-toolbar-actions-end'
					)}
				>
					<Tooltip text={__('Undo', 'blockera')}>
						<Button
							className={controlInnerClassNames(
								'icon-picker-svg-editor-toolbar-btn'
							)}
							variant="tertiary"
							size="extra-small"
							icon={
								<Icon icon="undo" library="ui" iconSize={14} />
							}
							onClick={onUndo}
							disabled={disabled || !canUndo || isBusy}
							aria-label={__('Undo', 'blockera')}
						/>
					</Tooltip>
					<Tooltip text={__('Redo', 'blockera')}>
						<Button
							className={controlInnerClassNames(
								'icon-picker-svg-editor-toolbar-btn'
							)}
							variant="tertiary"
							size="extra-small"
							icon={
								<Icon icon="redo" library="ui" iconSize={14} />
							}
							onClick={onRedo}
							disabled={disabled || !canRedo || isBusy}
							aria-label={__('Redo', 'blockera')}
						/>
					</Tooltip>
				</div>
			</div>

			{isDrilledIn && currentContext && (
				<div
					className={controlInnerClassNames(
						'icon-picker-svg-editor-breadcrumb'
					)}
				>
					<span
						className={controlInnerClassNames(
							'icon-picker-svg-editor-breadcrumb-label'
						)}
					>
						{breadcrumb
							.map((node) => getElementLabel(node))
							.join(' › ')}
					</span>
					<Button
						className={controlInnerClassNames(
							'icon-picker-svg-editor-exit-group-btn'
						)}
						variant="link"
						size="extra-small"
						onClick={onExitGroup}
						disabled={disabled || isBusy}
					>
						{__('Exit group', 'blockera')}
					</Button>
				</div>
			)}
		</div>
	);
}
