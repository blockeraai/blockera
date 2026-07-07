/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Document kinds used for unavailable-tab copy and card labels.
 */
export type UnavailableDocumentKind =
	'page' | 'post' | 'template' | 'pattern' | 'tab';

/**
 * Map entity post type to a coarse kind for messaging and card sublabels.
 */
export function getUnavailableDocumentKind(
	postType: string
): UnavailableDocumentKind {
	switch (postType) {
		case 'page':
			return 'page';
		case 'post':
			return 'post';
		case 'wp_template':
		case 'wp_template_part':
			return 'template';
		case 'wp_block':
			return 'pattern';
		default:
			return 'tab';
	}
}

/**
 * Modal header title (short): "This {type} has been deleted".
 */
export function getUnavailableModalHeaderTitle(
	kind: UnavailableDocumentKind
): string {
	switch (kind) {
		case 'page':
			return __('This page has been deleted', 'blockera');
		case 'post':
			return __('This post has been deleted', 'blockera');
		case 'template':
			return __('This template has been deleted', 'blockera');
		case 'pattern':
			return __('This pattern has been deleted', 'blockera');
		case 'tab':
			return __('This tab has been deleted', 'blockera');
	}
}

/**
 * Lead paragraph for the unavailable-document modal (matches design per kind).
 */
export function getUnavailableLeadMessage(
	kind: UnavailableDocumentKind
): string {
	switch (kind) {
		case 'page':
			return __(
				'This page has been deleted while you had this tab open. It can no longer be edited or recovered.',
				'blockera'
			);
		case 'post':
			return __(
				'This post has been deleted while you had this tab open. It can no longer be edited or recovered.',
				'blockera'
			);
		case 'template':
			return __(
				'This template has been deleted while you had this tab open. It can no longer be edited or recovered.',
				'blockera'
			);
		case 'pattern':
			return __(
				'This pattern has been deleted while you had this tab open. It can no longer be edited or recovered.',
				'blockera'
			);
		case 'tab':
			return __(
				'This tab has been deleted while you had this tab open. It can no longer be edited or recovered.',
				'blockera'
			);
	}
}

/**
 * Short type line under the document title in the preview card.
 */
export function getUnavailableCardTypeLabel(
	kind: UnavailableDocumentKind
): string {
	switch (kind) {
		case 'page':
			return __('Page', 'blockera');
		case 'post':
			return __('Post', 'blockera');
		case 'template':
			return __('Template', 'blockera');
		case 'pattern':
			return __('Pattern', 'blockera');
		case 'tab':
			return __('Tab', 'blockera');
	}
}
