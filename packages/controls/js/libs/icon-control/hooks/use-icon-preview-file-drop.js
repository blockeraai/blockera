// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	isCustomIconUploadLocked,
	readSvgFromDroppedFiles,
	sanitizeRawSVGString,
} from '../utils';

type CommitSvgAction = {
	type: 'UPDATE_SVG',
	svgString: string,
	uploadSVG: string,
};

type UseIconPreviewFileDropOptions = {
	onCommitSvg: (action: CommitSvgAction) => void,
};

type UseIconPreviewFileDropReturn = {
	handlePreviewFilesDrop: (files: FileList | File[]) => void,
	isCompanionInstallOpen: boolean,
	closeCompanionInstallPrompt: () => void,
};

/**
 * Shared drop-to-upload handler for icon previews (sidebar control + core/icon canvas).
 */
export function useIconPreviewFileDrop({
	onCommitSvg,
}: UseIconPreviewFileDropOptions): UseIconPreviewFileDropReturn {
	const { createNotice } = dispatch('core/notices');
	const [isCompanionInstallOpen, setIsCompanionInstallOpen] = useState(false);

	const handlePreviewFilesDrop = useCallback(
		(files) => {
			if (!files?.length) {
				return;
			}

			if (isCustomIconUploadLocked()) {
				setIsCompanionInstallOpen(true);
				return;
			}

			readSvgFromDroppedFiles(files, (rawSvg) => {
				const svgString = sanitizeRawSVGString(rawSvg);

				if (!svgString) {
					createNotice(
						'error',
						__('Please upload a valid SVG file!', 'blockera'),
						{
							isDismissible: true,
						}
					);
					return;
				}

				onCommitSvg({
					type: 'UPDATE_SVG',
					svgString,
					uploadSVG: '',
				});
			});
		},
		[onCommitSvg, createNotice]
	);

	const closeCompanionInstallPrompt = useCallback(() => {
		setIsCompanionInstallOpen(false);
	}, []);

	return {
		handlePreviewFilesDrop,
		isCompanionInstallOpen,
		closeCompanionInstallPrompt,
	};
}
