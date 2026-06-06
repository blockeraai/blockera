/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { useCallback } from '@wordpress/element';
import { DropZone } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Button, MediaUploader } from '../../../';
import { sanitizeRawSVGString } from '../../utils';

const SVG_PLACEHOLDER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path d="..." />
</svg>`;

export default function CustomIconTab({
	draftSvgString = '',
	draftUploadSVG = null,
	onDraftChange = () => {},
	onProRequired = () => {},
}) {
	const sanitizedDraft = sanitizeRawSVGString(draftSvgString);
	const hasValidPreview = sanitizedDraft !== '';

	const withProGate = useCallback(
		(action) => {
			applyFilters(
				'blockera.controls.iconControl.uploadSVG.onClick',
				() => onProRequired(),
				action
			)();
		},
		[onProRequired]
	);

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
			withProGate(() => {
				updateDraft(rawValue, null);
			});
		},
		[withProGate, updateDraft]
	);

	const handlePaste = useCallback(
		(event) => {
			event.preventDefault();
			const pastedText = event.clipboardData.getData('text');

			withProGate(() => {
				updateDraft(pastedText, null);
			});
		},
		[withProGate, updateDraft]
	);

	const handleFilesDrop = useCallback(
		(files) => {
			if (!files?.length) {
				return;
			}

			withProGate(() => {
				const file = files[0];

				if (!file.name?.toLowerCase().endsWith('.svg')) {
					return;
				}

				const reader = new FileReader();

				reader.onload = () => {
					if (typeof reader.result === 'string') {
						updateDraft(reader.result, null);
					}
				};

				reader.readAsText(file);
			});
		},
		[withProGate, updateDraft]
	);

	const handleMediaSelect = useCallback(
		(media) => {
			withProGate(() => {
				if ('svg+xml' !== media.subtype) {
					return;
				}

				onDraftChange({
					media,
					fromMedia: true,
				});
			});
		},
		[withProGate, onDraftChange]
	);

	const handleBrowseClick = useCallback(
		(event, open) => {
			event.stopPropagation();
			withProGate(open);
		},
		[withProGate]
	);

	const uploadUrl =
		draftUploadSVG &&
		typeof draftUploadSVG === 'object' &&
		draftUploadSVG.url
			? draftUploadSVG.url
			: '';

	let previewContent = null;

	if (hasValidPreview) {
		previewContent = (
			<div
				className={controlInnerClassNames(
					'icon-picker-custom-icon-preview-svg'
				)}
				dangerouslySetInnerHTML={{
					__html: sanitizedDraft.replace(
						/\s*style\s*=\s*["'][^"']*["']/g,
						''
					),
				}}
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

				<div
					className={controlInnerClassNames(
						'icon-picker-custom-icon-dropzone'
					)}
				>
					<DropZone onFilesDrop={handleFilesDrop} />
					<textarea
						className={controlInnerClassNames(
							'icon-picker-custom-icon-textarea'
						)}
						value={draftSvgString}
						onChange={(event) => handleSvgInput(event.target.value)}
						onPaste={handlePaste}
						placeholder={SVG_PLACEHOLDER}
						spellCheck={false}
					/>
				</div>

				<div
					className={controlInnerClassNames(
						'icon-picker-custom-icon-divider'
					)}
				>
					<span>{__('or', 'blockera')}</span>
				</div>

				<MediaUploader
					allowedTypes={['image/svg+xml']}
					onSelect={handleMediaSelect}
					mode="browse"
					render={({ open }) => (
						<Button
							className={controlInnerClassNames(
								'icon-picker-custom-icon-browse-btn'
							)}
							onClick={(event) => handleBrowseClick(event, open)}
							variant="secondary"
						>
							<Icon icon="image" library="wp" iconSize={18} />
							{__('Browse WordPress Media Library', 'blockera')}
						</Button>
					)}
				/>
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
					{__('Live preview', 'blockera')}
				</div>

				<div
					className={controlInnerClassNames(
						'icon-picker-custom-icon-preview-area'
					)}
				>
					{previewContent ? (
						previewContent
					) : (
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
					)}
				</div>
			</div>
		</div>
	);
}
