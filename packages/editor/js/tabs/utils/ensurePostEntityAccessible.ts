/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Resolve the post entity in core-data and return whether it is available for editing.
 *
 * Used before tab switches so we do not navigate when the REST record is missing or
 * the request failed (deleted post, insufficient capabilities, private content, etc.).
 * Matches the editor’s own gate: {@see @wordpress/editor/src/components/editor/index.js}.
 *
 * @param postType Post type name.
 * @param postId   Post ID (or template string id for applicable types).
 *
 * Note: This uses core-data’s resolver; if the record was already resolved and later
 * removed elsewhere (e.g. REST delete outside core-data), the cache may still return
 * the old record until something invalidates that resolution.
 */
export async function ensurePostEntityAccessible(
	postType: string,
	postId: string | number
): Promise<boolean> {
	try {
		const resolved = resolveSelect(coreStore) as {
			getEntityRecord: (
				kind: string,
				name: string,
				id: string | number
			) => Promise<unknown>;
		};
		const record = await resolved.getEntityRecord(
			'postType',
			postType,
			postId
		);
		return (
			record !== null &&
			record !== undefined &&
			typeof record === 'object'
		);
	} catch {
		return false;
	}
}
