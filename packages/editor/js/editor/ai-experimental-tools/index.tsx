/**
 * WordPress dependencies
 */
import { useCallback, useMemo, useState } from '@wordpress/element';
import {
	Fill,
	PanelBody,
	TextareaControl,
	Button as WPButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dispatch, select, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { Button, Modal, NoticeControl, Tabs } from '@blockera/controls';
import { componentInnerClassNames } from '@blockera/classnames';
import { useGlobalStylesContext } from '@blockera/global-styles-ui';
import { experimental } from '@blockera/env';

/**
 * Internal dependencies
 */
import IconAI from './icons/ai.svg';
import { buildSiteTokensJson } from './site-tokens-exporter';

type JsonLike =
	| null
	| boolean
	| number
	| string
	| JsonLike[]
	| { [key: string]: JsonLike };

type JsonBlockInput = {
	name?: string;
	blockName?: string;
	attributes?: Record<string, unknown>;
	attrs?: Record<string, unknown>;
	innerBlocks?: JsonBlockInput[];
	blocks?: JsonBlockInput[];
};

const TAB_IMPORT_JSON = 'import-json';
const TAB_SITE_TOKENS = 'site-tokens';

function isObject(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === 'object' && !Array.isArray(value);
}

function normalizeToBlockInputs(value: unknown): JsonBlockInput[] {
	if (Array.isArray(value)) {
		return value as JsonBlockInput[];
	}
	if (isObject(value)) {
		// Support { blocks: [...] } wrapper.
		if (Array.isArray((value as any).blocks)) {
			return (value as any).blocks as JsonBlockInput[];
		}
		// Support single block object.
		return [value as JsonBlockInput];
	}
	return [];
}

function createWpBlockFromJson(input: JsonBlockInput): any {
	const name = (input.name || input.blockName || '') as string;
	if (!name) {
		throw new Error('Missing block name (expected "name" or "blockName").');
	}

	const attributes = (input.attributes || input.attrs || {}) as Record<
		string,
		unknown
	>;

	const innerInputs = Array.isArray(input.innerBlocks)
		? input.innerBlocks
		: [];
	const innerBlocks = innerInputs.map((child) =>
		createWpBlockFromJson(child)
	);

	return createBlock(name, attributes, innerBlocks);
}

export default function AIExperimentalTools(): JSX.Element {
	const isEnabled = experimental().get('ai.experimentalTools');

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [tab, setTab] = useState<string>(TAB_IMPORT_JSON);

	// Import JSON tab state
	const [value, setValue] = useState<string>('');
	const [isImporting, setIsImporting] = useState<boolean>(false);

	// Site tokens tab state
	const [tokensCopied, setTokensCopied] = useState<boolean>(false);

	// Subscribe to merged global styles (theme + user) so the exported tokens
	// stay in sync as the user edits palettes / spacing / blockGap. We always
	// read the merged config via the global-styles-ui context so spacing
	// preset references in `blockGap` can be resolved against the same merged
	// preset list.
	const globalStyles = useGlobalStylesContext({ from: 'merged' });
	const merged = (globalStyles?.merged || {}) as Record<string, unknown>;
	const mergedStyles = (merged.styles || {}) as Record<string, unknown>;
	const mergedSpacingStyles = (mergedStyles.spacing || {}) as Record<
		string,
		unknown
	>;
	const blockGap = mergedSpacingStyles.blockGap;

	// Presets and layout sizes are read from the editor's merged
	// `__experimentalFeatures` because Blockera's data layer normalizes
	// against that exact path everywhere else (see packages/data/js/variables).
	const features = useSelect((selectStore) => {
		const editorSettings: any = (
			selectStore('core/block-editor') as any
		)?.getSettings?.();
		return editorSettings?.__experimentalFeatures || null;
	}, []);

	const placeholder = useMemo(
		() =>
			JSON.stringify(
				{
					name: 'core/image',
					attributes: {
						id: 40,
						sizeSlug: 'full',
						linkDestination: 'none',
						url: 'https://example.com/image.jpg',
						alt: '',
						caption: '<em>Caption</em> text',
					},
					innerBlocks: [],
				},
				null,
				2
			),
		[]
	);

	// Build the site-tokens.json string only while the modal is open + the
	// site-tokens tab is the active one — this avoids paying the JSON.stringify
	// cost on every editor data tick when the tool isn't visible.
	const siteTokensJson = useMemo(() => {
		if (!isOpen || tab !== TAB_SITE_TOKENS) {
			return '';
		}
		try {
			const layout = (features as any)?.layout || null;
			const exported = buildSiteTokensJson({
				features,
				layout,
				blockGap,
			});
			return JSON.stringify(exported, null, 2);
		} catch (e: any) {
			// Surface the error in the same notice slot as Import.
			// We intentionally don't `throw` — keep the modal usable.
			return JSON.stringify(
				{
					error:
						e?.message ||
						'Failed to build site tokens from the current site.',
				},
				null,
				2
			);
		}
	}, [isOpen, tab, features, blockGap]);

	const onImport = useCallback(() => {
		setIsImporting(true);
		setError('');

		try {
			const parsed = JSON.parse(value) as JsonLike;
			const inputs = normalizeToBlockInputs(parsed);
			if (!inputs.length) {
				throw new Error(
					'JSON must be a block object or an array of blocks.'
				);
			}

			const blocks = inputs.map((b) => createWpBlockFromJson(b));

			const blockEditorSelect = select('core/block-editor') as any;
			const existingBlocks = blockEditorSelect?.getBlocks?.() ?? [];
			const index = Array.isArray(existingBlocks)
				? existingBlocks.length
				: 0;

			(dispatch('core/block-editor') as any).insertBlocks(blocks, index);

			setValue('');
			setIsOpen(false);
		} catch (e: any) {
			setError(e?.message ? String(e.message) : 'Failed to import JSON.');
		} finally {
			setIsImporting(false);
		}
	}, [value]);

	const onCopySiteTokens = useCallback(async () => {
		setError('');
		setTokensCopied(false);
		if (!siteTokensJson) {
			setError(__('Nothing to copy yet.', 'blockera'));
			return;
		}
		try {
			if (
				typeof navigator !== 'undefined' &&
				navigator.clipboard?.writeText
			) {
				await navigator.clipboard.writeText(siteTokensJson);
				setTokensCopied(true);
				return;
			}
			throw new Error(
				__('Clipboard API is not available.', 'blockera') as string
			);
		} catch (e: any) {
			setError(
				e?.message
					? String(e.message)
					: __('Failed to copy to clipboard.', 'blockera')
			);
		}
	}, [siteTokensJson]);

	// Experimental gate: AI -> Experimental Tools.
	if (!isEnabled) {
		return <></>;
	}

	return (
		<>
			<Fill name="blockera/slots/editor-header-toolbar">
				<WPButton
					onClick={() => {
						setError('');
						setIsOpen(true);
					}}
					icon={<IconAI />}
					label={__('Blockera AI Experimental Tools', 'blockera')}
					className="blockera-ai-experimental-tools-button"
					size="compact"
				/>
			</Fill>

			{isOpen ? (
				<Modal
					className={componentInnerClassNames(
						'ai-experimental-tools-modal'
					)}
					headerIcon={<IconAI />}
					headerTitle={__(
						'Blockera AI Experimental Tools',
						'blockera'
					)}
					onRequestClose={() => setIsOpen(false)}
				>
					<Tabs
						className="blockera-ai-experimental-tools-tabs"
						design="modern"
						activeTab={tab}
						setCurrentTab={(next: string) => {
							// Reset transient notices when switching tabs so a stale
							// "Copied" / error message from the previous tab doesn't
							// leak into the new one.
							setError('');
							setTokensCopied(false);
							setTab(next);
						}}
						tabs={[
							{
								name: TAB_IMPORT_JSON,
								title: __('Import JSON → Blocks', 'blockera'),
							},
							{
								name: TAB_SITE_TOKENS,
								title: __('Site tokens JSON', 'blockera'),
							},
						]}
						getPanel={(selectedTab) => {
							if (selectedTab?.name === TAB_IMPORT_JSON) {
								return (
									<PanelBody>
										{error ? (
											<NoticeControl
												type="error"
												isDismissible
												onDismiss={() => setError('')}
											>
												{error}
											</NoticeControl>
										) : null}
										<TextareaControl
											label={__(
												'Blocks JSON',
												'blockera'
											)}
											help={__(
												'Paste a block object or an array of blocks. Supported keys: "name"/"blockName", "attributes"/"attrs", "innerBlocks".',
												'blockera'
											)}
											value={value}
											onChange={(next) => setValue(next)}
											rows={12}
											placeholder={placeholder}
										/>
										<Button
											variant="primary"
											onClick={onImport}
											isBusy={isImporting}
											disabled={
												isImporting || !value.trim()
											}
										>
											{__(
												'Import and append',
												'blockera'
											)}
										</Button>
									</PanelBody>
								);
							}

							if (selectedTab?.name === TAB_SITE_TOKENS) {
								return (
									<PanelBody>
										{error ? (
											<NoticeControl
												type="error"
												isDismissible
												onDismiss={() => setError('')}
											>
												{error}
											</NoticeControl>
										) : null}
										{tokensCopied ? (
											<NoticeControl
												type="success"
												isDismissible
												onDismiss={() =>
													setTokensCopied(false)
												}
											>
												{__(
													'Site tokens JSON copied to clipboard.',
													'blockera'
												)}
											</NoticeControl>
										) : null}
										<TextareaControl
											label={__(
												'Site tokens (site-tokens.json)',
												'blockera'
											)}
											help={__(
												'Auto-generated from the current site’s Global Styles. Includes layout.elementsGap (from styles.spacing.blockGap) and width-size (from settings.layout). Copy this JSON into the Blockera AI generator project as site-tokens.json.',
												'blockera'
											)}
											value={siteTokensJson}
											onChange={() => {
												// Read-only: ignore edits.
											}}
											rows={16}
											readOnly
										/>
										<Button
											variant="primary"
											onClick={onCopySiteTokens}
											disabled={!siteTokensJson}
										>
											{__('Copy JSON', 'blockera')}
										</Button>
									</PanelBody>
								);
							}

							return null;
						}}
					/>
				</Modal>
			) : null}
		</>
	);
}
