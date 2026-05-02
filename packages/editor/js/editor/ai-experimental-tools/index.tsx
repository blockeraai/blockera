/**
 * WordPress dependencies
 */
import {
	createInterpolateElement,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';
import {
	Fill,
	PanelBody,
	TextareaControl,
	TextControl,
	Button as WPButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dispatch, select, useSelect } from '@wordpress/data';
import { cloneBlock, createBlock, getBlockType } from '@wordpress/blocks';

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
import { buildSiteBreakpointsJson } from './site-breakpoints-exporter';
import { getAttributesWithIds } from '../../hooks/use-attributes';
import './style.scss';

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
const TAB_AI_GENERATOR = 'ai-generator';
const TAB_SELECTED_BLOCK_EXPORT = 'selected-block-export';
const TAB_SITE_TOKENS = 'site-tokens';
const TAB_SITE_BREAKPOINTS = 'site-breakpoints';

const AI_STORAGE_PREFIX = 'blockera:ai-experimental-tools:ai-generator:';
const AI_DEFAULT_PATTERN_GENERATOR_URL =
	'http://127.0.0.1:8000/ai/v1/pattern-generator';
const AI_DEFAULT_MODEL = 'anthropic/claude-opus-4-7';

/** Non-empty string / non-zero scalar — AI sometimes sends "" or whitespace-only IDs. */
function hasTruthyBlockeraId(value: unknown): boolean {
	if (value === null || value === undefined) {
		return false;
	}
	if (typeof value === 'string') {
		return value.trim() !== '';
	}
	return true;
}

/** Select first appended root so Blockera’s editor pipeline runs like a canvas click (AI + JSON import). */
function selectFirstAppendedRoots(
	insertIndex: number,
	rootBlockCount: number
): void {
	const blockEditorDispatch = dispatch('core/block-editor') as any;
	queueMicrotask(() => {
		const roots = (select('core/block-editor') as any).getBlocks?.() ?? [];
		if (!Array.isArray(roots)) {
			return;
		}
		const insertedRoots = roots.slice(
			insertIndex,
			insertIndex + rootBlockCount
		);
		const firstNew = insertedRoots[0];
		if (
			firstNew?.clientId &&
			typeof blockEditorDispatch.selectBlock === 'function'
		) {
			blockEditorDispatch.selectBlock(firstNew.clientId);
		}
	});
}

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

/**
 * BlockStyle only prints Blockera CSS when `blockeraPropsId` is truthy.
 * JSON/AI blocks often omit it or leave the default empty string; the canvas
 * normally assigns via editor flows — mirror that here before insert.
 *
 * Blockera often persists `blockeraPropsId` and `blockeraCompatId` as the **same**
 * string when both are bootstrapped together (see fixtures / use-calculate-current-attributes tests).
 * Generating two separate `getAttributesWithIds` timestamps can leave them out of sync with what
 * the extensions layer expects for fresh blocks.
 */
function ensureTruthyBlockeraPropsIds(block: any): any {
	const innerRaw = block?.innerBlocks;
	const innerList = Array.isArray(innerRaw) ? innerRaw : [];
	const mappedInner: any[] = [];
	for (let i = 0; i < innerList.length; i++) {
		mappedInner.push(ensureTruthyBlockeraPropsIds(innerList[i]));
	}

	const blockType = getBlockType(block?.name);
	const supportsPropsId = Boolean(blockType?.attributes?.blockeraPropsId);
	const supportsCompat = Boolean(blockType?.attributes?.blockeraCompatId);
	const attrs = block?.attributes || {};

	const needsPropsId =
		supportsPropsId && !hasTruthyBlockeraId(attrs.blockeraPropsId);
	const needsCompatPaired =
		supportsCompat &&
		hasTruthyBlockeraId(attrs.blockeraPropsId) &&
		!hasTruthyBlockeraId(attrs.blockeraCompatId);

	let next = block;
	const innersChanged =
		mappedInner.length !== innerList.length ||
		mappedInner.some((ib, idx) => ib !== innerList[idx]);

	if (innersChanged) {
		next = cloneBlock(block, {}, mappedInner);
	}

	if (needsPropsId) {
		const withId = getAttributesWithIds(
			{ ...next.attributes },
			'blockeraPropsId',
			false
		);
		const bootstrapId = String(withId.blockeraPropsId ?? '').trim();
		const patch: Record<string, unknown> = {
			blockeraPropsId: bootstrapId,
		};
		if (supportsCompat && !hasTruthyBlockeraId(withId.blockeraCompatId)) {
			patch.blockeraCompatId = bootstrapId;
		}
		next = cloneBlock(next, patch);
	} else if (needsCompatPaired) {
		const paired = String(attrs.blockeraPropsId ?? '').trim();
		next = cloneBlock(next, {
			blockeraCompatId: paired,
		});
	}

	return next;
}

function safeJsonBlock(input: any): JsonBlockInput | null {
	if (!input || typeof input !== 'object') {
		return null;
	}

	const name = typeof input.name === 'string' ? input.name : undefined;
	if (!name) {
		return null;
	}

	const attributes = isObject(input.attributes) ? input.attributes : {};

	const innerBlocksRaw = Array.isArray(input.innerBlocks)
		? input.innerBlocks
		: [];
	const innerBlocks: JsonBlockInput[] = [];
	for (let i = 0; i < innerBlocksRaw.length; i++) {
		const child = safeJsonBlock(innerBlocksRaw[i]);
		if (child) {
			innerBlocks.push(child);
		}
	}

	return {
		name,
		attributes,
		innerBlocks,
	};
}

function safeGetLocalStorage(): Storage | null {
	try {
		if (typeof window === 'undefined') {
			return null;
		}
		return window.localStorage || null;
	} catch {
		return null;
	}
}

export default function AIExperimentalTools(): JSX.Element {
	const isEnabled = experimental().get('ai.experimentalTools');

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [tab, setTab] = useState<string>(TAB_AI_GENERATOR);

	// Import JSON tab state
	const [value, setValue] = useState<string>('');
	const [isImporting, setIsImporting] = useState<boolean>(false);

	// AI Generator tab state
	const [aiIntent, setAiIntent] = useState<string>('');
	const [aiSiteContext, setAiSiteContext] = useState<string>('');
	const [aiPatternGeneratorUrl, setAiPatternGeneratorUrl] = useState<string>(
		AI_DEFAULT_PATTERN_GENERATOR_URL
	);
	const [aiModel, setAiModel] = useState<string>(AI_DEFAULT_MODEL);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const [aiNotice, setAiNotice] = useState<string>('');
	const [aiError, setAiError] = useState<string>('');

	// Site tokens tab state
	const [tokensCopied, setTokensCopied] = useState<boolean>(false);
	const [breakpointsCopied, setBreakpointsCopied] = useState<boolean>(false);
	const [selectedBlockCopied, setSelectedBlockCopied] =
		useState<boolean>(false);

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
	const breakpoints = useSelect((selectStore) => {
		const editorStore: any = selectStore('blockera/editor');
		return editorStore?.getBreakpoints?.() || null;
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

	const siteBreakpointsJson = useMemo(() => {
		if (!isOpen || tab !== TAB_SITE_BREAKPOINTS) {
			return '';
		}
		try {
			const exported = buildSiteBreakpointsJson(
				breakpoints as Record<string, any> | null
			);
			return JSON.stringify(exported, null, 2);
		} catch (e: any) {
			return JSON.stringify(
				{
					error:
						e?.message ||
						'Failed to build site breakpoints from the current site.',
				},
				null,
				2
			);
		}
	}, [isOpen, tab, breakpoints]);

	const selectedBlockJson = useMemo(() => {
		if (!isOpen || tab !== TAB_SELECTED_BLOCK_EXPORT) {
			return '';
		}

		const blockEditorSelect = select('core/block-editor') as any;
		const selectedClientId =
			(blockEditorSelect?.getSelectedBlockClientId?.() as
				| string
				| undefined) || '';
		if (!selectedClientId) {
			return '';
		}

		const selectedBlock = blockEditorSelect?.getBlock?.(selectedClientId);
		const safe = safeJsonBlock(selectedBlock);
		if (!safe) {
			return JSON.stringify(
				{
					error: __('Selected block cannot be exported.', 'blockera'),
				},
				null,
				2
			);
		}

		return JSON.stringify(safe, null, 2);
	}, [isOpen, tab]);

	const isAiUpdateMode = useMemo(() => {
		return aiIntent.includes('@block');
	}, [aiIntent]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const storage = safeGetLocalStorage();
		if (!storage) {
			return;
		}

		const storedIntent = storage.getItem(AI_STORAGE_PREFIX + 'intent');
		if (typeof storedIntent === 'string' && storedIntent !== '') {
			setAiIntent(storedIntent);
		}

		const storedContext = storage.getItem(
			AI_STORAGE_PREFIX + 'site_context'
		);
		if (typeof storedContext === 'string' && storedContext !== '') {
			setAiSiteContext(storedContext);
		}

		const storedUrl = storage.getItem(AI_STORAGE_PREFIX + 'url');
		if (typeof storedUrl === 'string' && storedUrl !== '') {
			setAiPatternGeneratorUrl(storedUrl);
		}

		const storedModel = storage.getItem(AI_STORAGE_PREFIX + 'model');
		if (typeof storedModel === 'string' && storedModel !== '') {
			setAiModel(storedModel);
		}
		// Only hydrate when the modal opens.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	const persistAiField = useCallback((key: string, nextValue: string) => {
		const storage = safeGetLocalStorage();
		if (!storage) {
			return;
		}
		try {
			storage.setItem(AI_STORAGE_PREFIX + key, nextValue);
		} catch {
			// Ignore storage quota / privacy errors.
		}
	}, []);

	const onGenerateByAi = useCallback(async () => {
		setAiError('');
		setAiNotice('');

		const intent = aiIntent.trim();
		if (!intent) {
			setAiError(__('User Intent is required.', 'blockera'));
			return;
		}

		const siteContext = aiSiteContext.trim();
		if (!siteContext) {
			setAiError(__('Site Context is required.', 'blockera'));
			return;
		}

		const url = aiPatternGeneratorUrl.trim();
		if (!url) {
			setAiError(__('Pattern generator URL is required.', 'blockera'));
			return;
		}

		const model = aiModel.trim();

		const payload = (() => {
			let existingDesignBlocks: any[] | null = null;

			if (intent.includes('@block')) {
				const blockEditorSelect = select('core/block-editor') as any;
				const selectedClientId =
					(blockEditorSelect?.getSelectedBlockClientId?.() as
						| string
						| undefined) || null;
				if (!selectedClientId) {
					setAiError(
						__(
							'Select a block first, then use @block to update it.',
							'blockera'
						)
					);
					return null;
				}
				const selectedBlock =
					blockEditorSelect?.getBlock?.(selectedClientId);
				const safe = safeJsonBlock(selectedBlock);
				if (!safe) {
					setAiError(
						__(
							'Selected block cannot be exported for AI update.',
							'blockera'
						)
					);
					return null;
				}
				existingDesignBlocks = [safe];
			}

			// Build tokens + breakpoints from the same sources as the exporter tabs,
			// but only at click-time (avoid work while idle).
			let built: { tokens: unknown; breakpoints: unknown };
			try {
				const layout = (features as any)?.layout || null;
				built = {
					tokens: buildSiteTokensJson({ features, layout, blockGap }),
					breakpoints: buildSiteBreakpointsJson(
						breakpoints as Record<string, any> | null
					),
				};
			} catch (e: any) {
				setAiError(
					e?.message
						? String(e.message)
						: __(
								'Failed to build tokens/breakpoints from the current site.',
								'blockera'
							)
				);
				return null;
			}

			const out: Record<string, unknown> = {
				intent,
				site_context: siteContext,
				model: model || AI_DEFAULT_MODEL,
				tokens: built.tokens,
				breakpoints: built.breakpoints,
			};
			if (existingDesignBlocks) {
				out.existing_design_blocks = existingDesignBlocks;
			}
			return out;
		})();
		if (!payload) {
			return;
		}

		setIsGenerating(true);
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const json = (await res.json()) as any;
			if (!res.ok || !json || json.success !== true) {
				const message =
					json?.error?.message ||
					json?.message ||
					__('AI request failed.', 'blockera');
				throw new Error(String(message));
			}

			const inputs = normalizeToBlockInputs(json?.data?.blocks);
			if (!inputs.length) {
				throw new Error(
					__(
						'AI response did not include any blocks.',
						'blockera'
					) as string
				);
			}

			const blocks = inputs.map((b) =>
				ensureTruthyBlockeraPropsIds(createWpBlockFromJson(b))
			);

			if (selectedClientId) {
				(dispatch('core/block-editor') as any).replaceBlocks(
					[selectedClientId],
					blocks
				);
				setAiNotice(
					__(
						'Selected block was updated with the AI-generated pattern.',
						'blockera'
					)
				);
				return;
			}

			const blockEditorSelect = select('core/block-editor') as any;
			const existingBlocks = blockEditorSelect?.getBlocks?.() ?? [];
			const index = Array.isArray(existingBlocks)
				? existingBlocks.length
				: 0;
			const blockEditorDispatch = dispatch('core/block-editor') as any;
			blockEditorDispatch.insertBlocks(blocks, index);
			selectFirstAppendedRoots(index, blocks.length);
			setAiNotice(
				__(
					'AI-generated pattern was appended to the end of the document.',
					'blockera'
				)
			);
		} catch (e: any) {
			setAiError(
				e?.message
					? String(e.message)
					: __('AI request failed.', 'blockera')
			);
		} finally {
			setIsGenerating(false);
		}
	}, [
		aiIntent,
		aiSiteContext,
		aiPatternGeneratorUrl,
		aiModel,
		features,
		blockGap,
		breakpoints,
	]);

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

			const blocks = inputs
				.map((b) => createWpBlockFromJson(b))
				.map((blk) => ensureTruthyBlockeraPropsIds(blk));

			const blockEditorSelect = select('core/block-editor') as any;
			const existingBlocks = blockEditorSelect?.getBlocks?.() ?? [];
			const index = Array.isArray(existingBlocks)
				? existingBlocks.length
				: 0;

			(dispatch('core/block-editor') as any).insertBlocks(blocks, index);
			selectFirstAppendedRoots(index, blocks.length);

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

	const onCopySiteBreakpoints = useCallback(async () => {
		setError('');
		setBreakpointsCopied(false);
		if (!siteBreakpointsJson) {
			setError(__('Nothing to copy yet.', 'blockera'));
			return;
		}
		try {
			if (
				typeof navigator !== 'undefined' &&
				navigator.clipboard?.writeText
			) {
				await navigator.clipboard.writeText(siteBreakpointsJson);
				setBreakpointsCopied(true);
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
	}, [siteBreakpointsJson]);

	const onCopySelectedBlock = useCallback(async () => {
		setError('');
		setSelectedBlockCopied(false);
		if (!selectedBlockJson) {
			setError(__('Select a block first.', 'blockera'));
			return;
		}
		try {
			if (
				typeof navigator !== 'undefined' &&
				navigator.clipboard?.writeText
			) {
				await navigator.clipboard.writeText(selectedBlockJson);
				setSelectedBlockCopied(true);
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
	}, [selectedBlockJson]);

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
							setAiError('');
							setAiNotice('');
							setTokensCopied(false);
							setBreakpointsCopied(false);
							setSelectedBlockCopied(false);
							setTab(next);
						}}
						tabs={[
							{
								name: TAB_AI_GENERATOR,
								title: __('AI Generator', 'blockera'),
							},
							{
								name: TAB_SELECTED_BLOCK_EXPORT,
								title: __('Export Block', 'blockera'),
							},
							{
								name: TAB_IMPORT_JSON,
								title: __('Import JSON', 'blockera'),
							},
							{
								name: TAB_SITE_TOKENS,
								title: __('Tokens', 'blockera'),
							},
							{
								name: TAB_SITE_BREAKPOINTS,
								title: __('Breakpoints', 'blockera'),
							},
						]}
						getPanel={(selectedTab) => {
							if (selectedTab?.name === TAB_AI_GENERATOR) {
								return (
									<PanelBody>
										<TextareaControl
											label={__(
												'User Intent',
												'blockera'
											)}
											help={createInterpolateElement(
												__(
													'Describe what you want to generate. Use <code>@block</code> to update the selected block instead of appending.',
													'blockera'
												),
												{ code: <code /> }
											)}
											value={aiIntent}
											onChange={(next) => {
												setAiIntent(next);
												persistAiField('intent', next);
											}}
											rows={6}
											required
										/>

										<TextareaControl
											label={__(
												'Site Context',
												'blockera'
											)}
											help={__(
												'Provide site information that helps the AI match your design system and content tone.',
												'blockera'
											)}
											value={aiSiteContext}
											onChange={(next) => {
												setAiSiteContext(next);
												persistAiField(
													'site_context',
													next
												);
											}}
											rows={8}
											required
										/>

										<TextControl
											label={__(
												'Pattern generator url',
												'blockera'
											)}
											value={aiPatternGeneratorUrl}
											onChange={(next) => {
												setAiPatternGeneratorUrl(next);
												persistAiField('url', next);
											}}
										/>

										<TextControl
											label={__('Model', 'blockera')}
											value={aiModel}
											onChange={(next) => {
												setAiModel(next);
												persistAiField('model', next);
											}}
										/>

										<Button
											variant="primary"
											onClick={onGenerateByAi}
											isBusy={isGenerating}
											disabled={
												isGenerating ||
												!aiIntent.trim() ||
												!aiSiteContext.trim() ||
												!aiPatternGeneratorUrl.trim()
											}
										>
											{isAiUpdateMode
												? __('Update by AI', 'blockera')
												: __(
														'Generate by AI',
														'blockera'
													)}
										</Button>

										{aiError ? (
											<NoticeControl
												type="error"
												isDismissible
												onDismiss={() => setAiError('')}
											>
												{aiError}
											</NoticeControl>
										) : null}
										{aiNotice ? (
											<NoticeControl
												type="success"
												isDismissible
												onDismiss={() =>
													setAiNotice('')
												}
											>
												{aiNotice}
											</NoticeControl>
										) : null}
									</PanelBody>
								);
							}

							if (
								selectedTab?.name === TAB_SELECTED_BLOCK_EXPORT
							) {
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
												'Selected block JSON',
												'blockera'
											)}
											help={__(
												'Exports the currently selected block (including innerBlocks) in a safe JSON format.',
												'blockera'
											)}
											value={selectedBlockJson}
											onChange={() => {
												// Read-only: ignore edits.
											}}
											rows={16}
											readOnly
											placeholder={__(
												'Select a block to export its JSON.',
												'blockera'
											)}
										/>
										<Button
											variant="primary"
											onClick={onCopySelectedBlock}
											disabled={!selectedBlockJson}
										>
											{__('Copy JSON', 'blockera')}
										</Button>
										{selectedBlockCopied ? (
											<NoticeControl
												type="success"
												isDismissible
												onDismiss={() =>
													setSelectedBlockCopied(
														false
													)
												}
											>
												{__(
													'Selected block JSON copied to clipboard.',
													'blockera'
												)}
											</NoticeControl>
										) : null}
									</PanelBody>
								);
							}

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
									</PanelBody>
								);
							}

							if (selectedTab?.name === TAB_SITE_BREAKPOINTS) {
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
												'Breakpoints (breakpoints.json)',
												'blockera'
											)}
											help={__(
												'Auto-generated from the current active Blockera breakpoints. Copy this JSON into the Blockera AI generator project as breakpoints.json.',
												'blockera'
											)}
											value={siteBreakpointsJson}
											onChange={() => {
												// Read-only: ignore edits.
											}}
											rows={16}
											readOnly
										/>
										<Button
											variant="primary"
											onClick={onCopySiteBreakpoints}
											disabled={!siteBreakpointsJson}
										>
											{__('Copy JSON', 'blockera')}
										</Button>
										{breakpointsCopied ? (
											<NoticeControl
												type="success"
												isDismissible
												onDismiss={() =>
													setBreakpointsCopied(false)
												}
											>
												{__(
													'Breakpoints JSON copied to clipboard.',
													'blockera'
												)}
											</NoticeControl>
										) : null}
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
