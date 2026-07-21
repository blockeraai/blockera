/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Button, MediaUploader } from '../../../';
import { FeatureWrapper } from '../../../feature-wrapper';
import ConditionalWrapper from '../../../conditional-wrapper';
import {
	sanitizeRawSVGString,
	getCustomIconFeatureType,
	isCustomIconUploadLocked,
} from '../../utils';
import SvgEditorPreview from './svg-editor/svg-editor-preview';

const SVG_PLACEHOLDER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path d="..." />
</svg>`;

export default function CustomIconTab({
	draftSvgString = '',
	draftUploadSVG = null,
	onDraftChange = () => {},
}) {
	const sanitizedDraft = sanitizeRawSVGString(draftSvgString);
	const hasValidPreview = sanitizedDraft !== '';
	const customIconFeatureType = getCustomIconFeatureType();
	const isUploadLocked = isCustomIconUploadLocked();

	const updateDraft = useCallback(
		(svgString, uploadSVG = null) => {
			onDraftChange({
				svgString,
				uploadSVG,
			});
		},
		[onDraftChange]
	);

	const handleSvgInput = useCallback(
		(rawValue) => {
			updateDraft(rawValue, null);
		},
		[updateDraft]
	);

	const handlePaste = useCallback(
		(event) => {
			event.preventDefault();
			const pastedText = event.clipboardData.getData('text');
			updateDraft(pastedText, null);
		},
		[updateDraft]
	);

	const handleMediaSelect = useCallback(
		(media) => {
			if ('svg+xml' !== media.subtype) {
				return;
			}

			onDraftChange({
				media,
				fromMedia: true,
			});
		},
		[onDraftChange]
	);

	const handleBrowseClick = useCallback((event, open) => {
		event.stopPropagation();
		open();
	}, []);

	const uploadUrl =
		draftUploadSVG &&
		typeof draftUploadSVG === 'object' &&
		draftUploadSVG.url
			? draftUploadSVG.url
			: '';

	let previewContent = null;

	if (hasValidPreview) {
		previewContent = (
			<SvgEditorPreview
				svgString={sanitizedDraft}
				onChange={handleSvgInput}
			/>
		);
	} else if (uploadUrl) {
		previewContent = (
			<img
				src={uploadUrl}
				alt={
					draftUploadSVG?.title
						? draftUploadSVG.title.replaceAll('-', ' ')
						: __('Custom SVG icon', 'blockera')
				}
			/>
		);
	}

	return (
		<div className={controlInnerClassNames('icon-picker-custom-icon-tab')}>
			<div
				className={controlInnerClassNames(
					'icon-picker-custom-icon-input-column'
				)}
			>
				<div
					className={controlInnerClassNames(
						'icon-picker-custom-icon-input-header'
					)}
				>
					<Icon icon="curly-braces" library="ui" iconSize={18} />
					<span>
						{__('Paste SVG code or drop a file', 'blockera')}
					</span>
				</div>

				<ConditionalWrapper
					condition={isUploadLocked}
					wrapper={(children) => (
						<FeatureWrapper
							type={customIconFeatureType}
							showText="always"
							className={controlInnerClassNames(
								'icon-picker-custom-icon-dropzone-wrapper'
							)}
						>
							{children}
						</FeatureWrapper>
					)}
				>
					<div
						className={controlInnerClassNames(
							'icon-picker-custom-icon-dropzone'
						)}
					>
						<textarea
							className={controlInnerClassNames(
								'icon-picker-custom-icon-textarea'
							)}
							value={draftSvgString}
							onChange={(event) =>
								handleSvgInput(event.target.value)
							}
							onPaste={handlePaste}
							placeholder={SVG_PLACEHOLDER}
							spellCheck={false}
							disabled={isUploadLocked}
						/>
					</div>
				</ConditionalWrapper>

				<div
					className={controlInnerClassNames(
						'icon-picker-custom-icon-divider'
					)}
				>
					<span>{__('or', 'blockera')}</span>
				</div>

				<ConditionalWrapper
					condition={isUploadLocked}
					wrapper={(children) => (
						<FeatureWrapper
							type={customIconFeatureType}
							showText="always"
							className={controlInnerClassNames(
								'icon-picker-custom-icon-browse-wrapper'
							)}
						>
							{children}
						</FeatureWrapper>
					)}
				>
					<MediaUploader
						allowedTypes={['image/svg+xml']}
						onSelect={handleMediaSelect}
						mode="browse"
						render={({ open }) => (
							<Button
								className={controlInnerClassNames(
									'icon-picker-custom-icon-browse-btn'
								)}
								onClick={(event) =>
									handleBrowseClick(event, open)
								}
								variant="secondary"
							>
								<Icon icon="image" library="wp" iconSize={18} />
								{__(
									'Browse WordPress Media Library',
									'blockera'
								)}
							</Button>
						)}
					/>
				</ConditionalWrapper>
			</div>

			<div
				className={controlInnerClassNames(
					'icon-picker-custom-icon-preview-column'
				)}
			>
				<div
					className={controlInnerClassNames(
						'icon-picker-custom-icon-preview-header'
					)}
				>
					{__('SVG editor', 'blockera')}
				</div>

				{previewContent ? (
					previewContent
				) : (
					<div
						className={controlInnerClassNames(
							'icon-picker-custom-icon-preview-area'
						)}
					>
						<div
							className={controlInnerClassNames(
								'icon-picker-custom-icon-preview-placeholder'
							)}
						>
							{__(
								'Paste code, drop a file, or pick from media to preview your icon',
								'blockera'
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
