/**
 * WordPress Type Definitions and Augmentations
 *
 * This file provides type definitions for WordPress packages that may not have
 * complete TypeScript support, as well as augmentations for extending existing types.
 */

import type { ComponentType, ReactNode, ReactElement } from 'react';

// ============================================================================
// @wordpress/element
// ============================================================================

declare module '@wordpress/element' {
	export const useState: typeof import('react').useState;
	export const useEffect: typeof import('react').useEffect;
	export const useCallback: typeof import('react').useCallback;
	export const useMemo: typeof import('react').useMemo;
	export const useRef: typeof import('react').useRef;
	export const useContext: typeof import('react').useContext;
	export const createContext: typeof import('react').createContext;
	export const createElement: typeof import('react').createElement;
	export const Fragment: typeof import('react').Fragment;
	export const Children: typeof import('react').Children;
	export const cloneElement: typeof import('react').cloneElement;
	export const isValidElement: typeof import('react').isValidElement;
	export const memo: typeof import('react').memo;
	export const forwardRef: typeof import('react').forwardRef;
	export const lazy: typeof import('react').lazy;
	export const Suspense: typeof import('react').Suspense;
	export const StrictMode: typeof import('react').StrictMode;
	export const createPortal: typeof import('react-dom').createPortal;
	export const createRoot: typeof import('react-dom/client').createRoot;
	export const render: (
		element: ReactNode,
		container: Element | null
	) => void;
	export const unmountComponentAtNode: (container: Element) => boolean;
	export const flushSync: typeof import('react-dom').flushSync;

	// WordPress-specific
	export function renderToString(element: ReactNode): string;
	export function createInterpolateElement(
		interpolatedString: string,
		conversionMap: Record<string, ReactElement>
	): ReactElement;
	export function RawHTML(props: { children?: string }): ReactElement;
}

// ============================================================================
// @wordpress/data
// ============================================================================

declare module '@wordpress/data' {
	export interface StoreDescriptor<Config = unknown> {
		name: string;
		instantiate: (registry: unknown) => Config;
	}

	export interface DataRegistry {
		select: <T>(storeNameOrDescriptor: string | StoreDescriptor<T>) => T;
		dispatch: <T>(storeNameOrDescriptor: string | StoreDescriptor<T>) => T;
		subscribe: (listener: () => void) => () => void;
	}

	export function useSelect<T>(
		mapSelect: (select: <S>(store: string | StoreDescriptor<S>) => S) => T,
		deps?: readonly unknown[]
	): T;

	export function useDispatch<
		T = Record<string, (...args: unknown[]) => unknown>
	>(storeNameOrDescriptor?: string | StoreDescriptor<T>): T;

	export function useRegistry(): DataRegistry;

	export function select<T>(
		storeNameOrDescriptor: string | StoreDescriptor<T>
	): T;
	export function dispatch<T>(
		storeNameOrDescriptor: string | StoreDescriptor<T>
	): T;
	export function subscribe(listener: () => void): () => void;

	export function resolveSelect<T>(
		storeNameOrDescriptor: string | StoreDescriptor<T>
	): {
		[K in keyof T]: T[K] extends (...args: infer A) => infer R
			? (...args: A) => Promise<Awaited<R>>
			: T[K];
	};

	export function createReduxStore<Config>(
		key: string,
		options: {
			reducer: (state: unknown, action: unknown) => unknown;
			actions?: Record<string, (...args: unknown[]) => unknown>;
			selectors?: Record<
				string,
				(state: unknown, ...args: unknown[]) => unknown
			>;
			resolvers?: Record<string, (...args: unknown[]) => unknown>;
			controls?: Record<string, (action: unknown) => unknown>;
		}
	): StoreDescriptor<Config>;

	export function register(store: StoreDescriptor): void;
	export function registerStore<Config>(
		reducerKey: string,
		options: {
			reducer: (state: unknown, action: unknown) => unknown;
			actions?: Record<string, (...args: unknown[]) => unknown>;
			selectors?: Record<
				string,
				(state: unknown, ...args: unknown[]) => unknown
			>;
			resolvers?: Record<string, (...args: unknown[]) => unknown>;
			controls?: Record<string, (action: unknown) => unknown>;
		}
	): StoreDescriptor<Config>;
}

// ============================================================================
// @wordpress/core-data
// ============================================================================

declare module '@wordpress/core-data' {
	import type { StoreDescriptor } from '@wordpress/data';

	export interface EntityRecord {
		id: number | string;
		[key: string]: unknown;
	}

	export interface Post extends EntityRecord {
		id: number;
		title: string | { rendered: string; raw?: string };
		status: PostStatus;
		slug: string;
		link: string;
		content?: string | { rendered: string; raw?: string };
		excerpt?: string | { rendered: string; raw?: string };
		date?: string;
		modified?: string;
		type: string;
		author?: number;
		featured_media?: number;
		template?: string;
		meta?: Record<string, unknown>;
	}

	export type PostStatus =
		| 'publish'
		| 'draft'
		| 'pending'
		| 'private'
		| 'future'
		| 'trash'
		| 'auto-draft'
		| 'inherit';

	export type PostType =
		| 'post'
		| 'page'
		| 'wp_template'
		| 'wp_template_part'
		| 'wp_navigation'
		| 'wp_block'
		| string;

	export interface User extends EntityRecord {
		id: number;
		name: string;
		slug: string;
		avatar_urls?: Record<string, string>;
		email?: string;
	}

	export interface CoreDataSelectors {
		getEntityRecord<T extends EntityRecord = Post>(
			kind: string,
			name: string,
			key: number | string,
			query?: Record<string, unknown>
		): T | undefined;

		getEntityRecords<T extends EntityRecord = Post>(
			kind: string,
			name: string,
			query?: Record<string, unknown>
		): T[] | null;

		getEditedEntityRecord<T extends EntityRecord = Post>(
			kind: string,
			name: string,
			key: number | string
		): T | undefined;

		hasEditsForEntityRecord(
			kind: string,
			name: string,
			recordId: number | string
		): boolean;

		isSavingEntityRecord(
			kind: string,
			name: string,
			recordId: number | string
		): boolean;

		isResolving(selectorName: string, args?: unknown[]): boolean;
		hasFinishedResolution(selectorName: string, args?: unknown[]): boolean;

		getCurrentUser(): User | undefined;
		getUsers(query?: Record<string, unknown>): User[] | null;
		getUser(id: number): User | undefined;

		getPostTypes(query?: Record<string, unknown>): PostTypeConfig[] | null;
		getPostType(slug: string): PostTypeConfig | undefined;

		canUser(
			action: string,
			resource: string,
			id?: number | string
		): boolean | undefined;
		canUserEditEntityRecord(
			kind: string,
			name: string,
			recordId: number | string
		): boolean | undefined;
	}

	export interface PostTypeConfig {
		slug: string;
		name: string;
		labels: {
			singular_name: string;
			name: string;
			[key: string]: string;
		};
		rest_base: string;
		viewable: boolean;
		hierarchical: boolean;
		supports: Record<string, boolean>;
	}

	export interface CoreDataActions {
		saveEntityRecord(
			kind: string,
			name: string,
			record: Partial<EntityRecord>,
			options?: { throwOnError?: boolean }
		): Promise<EntityRecord | undefined>;

		saveEditedEntityRecord(
			kind: string,
			name: string,
			recordId: number | string,
			options?: { throwOnError?: boolean }
		): Promise<EntityRecord | undefined>;

		editEntityRecord(
			kind: string,
			name: string,
			recordId: number | string,
			edits: Partial<EntityRecord>,
			options?: { undoIgnore?: boolean }
		): void;

		deleteEntityRecord(
			kind: string,
			name: string,
			recordId: number | string,
			query?: Record<string, unknown>,
			options?: { throwOnError?: boolean; __unstableFetch?: typeof fetch }
		): Promise<boolean>;

		undo(): void;
		redo(): void;
	}

	export const store: StoreDescriptor<CoreDataSelectors & CoreDataActions>;
}

// ============================================================================
// @wordpress/editor
// ============================================================================

declare module '@wordpress/editor' {
	import type { StoreDescriptor } from '@wordpress/data';
	import type { Post, PostStatus, PostType } from '@wordpress/core-data';

	export interface EditorSelectors {
		getCurrentPostId(): number | undefined;
		getCurrentPostType(): PostType | undefined;
		getCurrentPost(): Post | undefined;
		getEditedPostAttribute<K extends keyof Post>(
			attributeName: K
		): Post[K] | undefined;
		getCurrentPostAttribute<K extends keyof Post>(
			attributeName: K
		): Post[K] | undefined;
		isEditedPostDirty(): boolean;
		isEditedPostNew(): boolean;
		isEditedPostSaveable(): boolean;
		isEditedPostPublishable(): boolean;
		isCurrentPostPublished(): boolean;
		isCurrentPostScheduled(): boolean;
		isEditedPostEmpty(): boolean;
		getEditedPostContent(): string;
		getEditedPostVisibility(): 'public' | 'private' | 'password';
		getPermalink(): string | undefined;
		getPermalinkParts():
			| { prefix: string; postName: string; suffix: string }
			| undefined;
		isPostSavingLocked(): boolean;
		isPostAutosavingLocked(): boolean;
		isPostLockTakeover(): boolean;
		getPostLock(): PostLock | undefined;
		getActivePostLock(): string | undefined;
		isPreviewingPost(): boolean;
		getEditorBlocks(): Block[];
		getEditorSettings(): EditorSettings;
	}

	export interface PostLock {
		isLocked: boolean;
		activePostLock?: string;
		user?: {
			id: number;
			name: string;
			avatar: string;
		};
	}

	export interface Block {
		clientId: string;
		name: string;
		attributes: Record<string, unknown>;
		innerBlocks: Block[];
	}

	export interface EditorSettings {
		[key: string]: unknown;
	}

	export interface EditorActions {
		editPost(edits: Partial<Post>): void;
		savePost(options?: { isAutosave?: boolean }): Promise<void>;
		autosave(options?: { local?: boolean }): Promise<void>;
		trashPost(): Promise<void>;
		refreshPost(): Promise<void>;
		lockPostSaving(lockName: string): void;
		unlockPostSaving(lockName: string): void;
		lockPostAutosaving(lockName: string): void;
		unlockPostAutosaving(lockName: string): void;
		resetEditorBlocks(blocks: Block[]): void;
		updateEditorSettings(settings: Partial<EditorSettings>): void;
	}

	export const store: StoreDescriptor<EditorSelectors & EditorActions>;

	// Components
	export const DocumentSettingPanel: ComponentType<{
		name?: string;
		title?: string;
		className?: string;
		icon?: ReactNode;
		children?: ReactNode;
	}>;

	export const PluginDocumentSettingPanel: ComponentType<{
		name?: string;
		title?: string;
		className?: string;
		icon?: ReactNode;
		children?: ReactNode;
	}>;

	export const PostPreviewButton: ComponentType<{
		className?: string;
		textContent?: string;
		role?: string;
	}>;
}

// ============================================================================
// @wordpress/commands
// ============================================================================

declare module '@wordpress/commands' {
	import type { StoreDescriptor } from '@wordpress/data';
	import type { ReactNode, ComponentType } from 'react';

	export interface Command {
		name: string;
		label: string;
		searchLabel?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon?: any;
		callback: (context: CommandContext) => void | Promise<void>;
	}

	export interface CommandContext {
		close: () => void;
	}

	export interface CommandLoaderOptions {
		name: string;
		hook: () => {
			commands: Command[];
			isLoading: boolean;
		};
	}

	export interface CommandsSelectors {
		getCommands(): Command[];
		isOpen(): boolean;
	}

	export interface CommandsActions {
		open(): void;
		close(): void;
		registerCommand(command: Command): void;
		registerCommandLoader(options: CommandLoaderOptions): void;
		unregisterCommand(name: string): void;
	}

	export const store: StoreDescriptor<CommandsSelectors & CommandsActions>;

	export function useCommand(command: Command): void;
	export function useCommandLoader(options: CommandLoaderOptions): void;

	export const CommandMenu: ComponentType<{
		children?: ReactNode;
	}>;
}

// ============================================================================
// @wordpress/plugins
// ============================================================================

declare module '@wordpress/plugins' {
	import type { ComponentType, ReactNode } from 'react';

	export interface PluginSettings {
		name: string;
		render: ComponentType;
		icon?: ReactNode;
		scope?: string;
	}

	export function registerPlugin(
		name: string,
		settings: Omit<PluginSettings, 'name'>
	): void;
	export function unregisterPlugin(name: string): void;
	export function getPlugin(name: string): PluginSettings | undefined;
	export function getPlugins(scope?: string): PluginSettings[];

	export const PluginArea: ComponentType<{
		scope?: string;
	}>;
}

// ============================================================================
// @wordpress/components
// ============================================================================

declare module '@wordpress/components' {
	import type {
		ComponentType,
		ReactNode,
		CSSProperties,
		MouseEvent,
		KeyboardEvent,
		FocusEvent,
		ChangeEvent,
		FormEvent,
		RefObject,
	} from 'react';

	// Button
	export interface ButtonProps {
		children?: ReactNode;
		className?: string;
		disabled?: boolean;
		href?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon?: any;
		iconPosition?: 'left' | 'right';
		iconSize?: number;
		isBusy?: boolean;
		isDestructive?: boolean;
		isPressed?: boolean;
		isSmall?: boolean;
		label?: string;
		shortcut?: string;
		showTooltip?: boolean;
		size?: 'default' | 'compact' | 'small';
		target?: string;
		text?: string;
		variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
		onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
		onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
		onFocus?: (event: FocusEvent<HTMLButtonElement>) => void;
		onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
		style?: CSSProperties;
		type?: 'button' | 'submit' | 'reset';
		ref?: RefObject<HTMLButtonElement>;
		'aria-label'?: string;
		'aria-pressed'?: boolean;
		'aria-expanded'?: boolean;
		'aria-haspopup'?:
			| boolean
			| 'dialog'
			| 'menu'
			| 'listbox'
			| 'tree'
			| 'grid';
		[key: string]: unknown;
	}

	export const Button: ComponentType<ButtonProps>;

	// Icon
	export interface IconProps {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: any;
		size?: number;
		className?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		style?: any;
	}

	export const Icon: ComponentType<IconProps>;

	// Tooltip
	export interface TooltipProps {
		children: ReactNode;
		text?: string;
		position?:
			| 'top'
			| 'top left'
			| 'top right'
			| 'top center'
			| 'bottom'
			| 'bottom left'
			| 'bottom right'
			| 'bottom center'
			| 'middle left'
			| 'middle right';
		shortcut?: string;
		delay?: number;
	}

	export const Tooltip: ComponentType<TooltipProps>;

	// Modal
	export interface ModalProps {
		children?: ReactNode;
		className?: string;
		contentLabel?: string;
		focusOnMount?: boolean | 'firstElement' | 'firstContentElement';
		isDismissible?: boolean;
		isFullScreen?: boolean;
		onRequestClose: () => void;
		overlayClassName?: string;
		shouldCloseOnClickOutside?: boolean;
		shouldCloseOnEsc?: boolean;
		size?: 'small' | 'medium' | 'large' | 'fill';
		style?: CSSProperties;
		title?: string;
		icon?: ReactNode;
		headerActions?: ReactNode;
		__experimentalHideHeader?: boolean;
	}

	export const Modal: ComponentType<ModalProps>;

	// DropdownMenu
	export interface DropdownMenuProps {
		children?: (props: { onClose: () => void }) => ReactNode;
		className?: string;
		controls?: Array<{
			icon?: ReactNode;
			onClick?: () => void;
			role?: string;
			title: string;
			isDisabled?: boolean;
		}>;
		icon?: ReactNode;
		label: string;
		menuProps?: Record<string, unknown>;
		popoverProps?: Partial<PopoverProps>;
		toggleProps?: Partial<ButtonProps>;
	}

	export const DropdownMenu: ComponentType<DropdownMenuProps>;

	// MenuGroup
	export interface MenuGroupProps {
		children?: ReactNode;
		className?: string;
		label?: string;
	}

	export const MenuGroup: ComponentType<MenuGroupProps>;

	// MenuItem
	export interface MenuItemProps {
		children?: ReactNode;
		className?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon?: any;
		iconPosition?: 'left' | 'right';
		info?: string;
		isDestructive?: boolean;
		isSelected?: boolean;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onClick?: (event?: any) => void;
		role?: string;
		shortcut?: string;
		tabIndex?: number;
		suffix?: ReactNode;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		style?: any;
		disabled?: boolean;
		suffix?: ReactNode;
		disabled?: boolean;
	}

	export const MenuItem: ComponentType<MenuItemProps>;

	// MenuItemsChoice
	export interface MenuItemsChoiceProps {
		choices: Array<{
			value: string;
			label: string;
			info?: string;
			disabled?: boolean;
		}>;
		onSelect?: (value: string) => void;
		value?: string;
	}

	export const MenuItemsChoice: ComponentType<MenuItemsChoiceProps>;

	// Popover
	export interface PopoverProps {
		children?: ReactNode;
		className?: string;
		anchor?: Element | { getBoundingClientRect: () => DOMRect } | null;
		anchorRef?: RefObject<Element> | Element | null;
		anchorRect?: DOMRect | null;
		animate?: boolean;
		expandOnMobile?: boolean;
		flip?: boolean;
		focusOnMount?: boolean | 'firstElement' | 'container';
		getAnchorRect?: (fallbackAnchorRect: DOMRect) => DOMRect;
		headerTitle?: string;
		inline?: boolean;
		isAlternate?: boolean;
		noArrow?: boolean;
		offset?: number;
		onClose?: () => void;
		onFocusOutside?: (event: FocusEvent) => void;
		placement?:
			| 'top'
			| 'top-start'
			| 'top-end'
			| 'right'
			| 'right-start'
			| 'right-end'
			| 'bottom'
			| 'bottom-start'
			| 'bottom-end'
			| 'left'
			| 'left-start'
			| 'left-end';
		position?: string;
		resize?: boolean;
		shift?: boolean;
		variant?: 'toolbar' | 'unstyled';
	}

	export const Popover: ComponentType<PopoverProps>;

	// TextControl
	export interface TextControlProps {
		className?: string;
		disabled?: boolean;
		help?: ReactNode;
		hideLabelFromVision?: boolean;
		label?: ReactNode;
		onChange: (value: string) => void;
		placeholder?: string;
		type?:
			| 'text'
			| 'email'
			| 'number'
			| 'password'
			| 'tel'
			| 'url'
			| 'search';
		value: string;
		autoComplete?: string;
		autoFocus?: boolean;
		id?: string;
		name?: string;
		readOnly?: boolean;
		required?: boolean;
	}

	export const TextControl: ComponentType<TextControlProps>;

	// Spinner
	export interface SpinnerProps {
		className?: string;
	}

	export const Spinner: ComponentType<SpinnerProps>;

	// ProgressBar
	export interface ProgressBarProps {
		/** Current progress value (0-100). If omitted, shows indeterminate animation. */
		value?: number;
		className?: string;
	}

	export const ProgressBar: ComponentType<ProgressBarProps>;

	// Flex
	export interface FlexProps {
		align?: CSSProperties['alignItems'];
		as?: keyof JSX.IntrinsicElements | ComponentType;
		children?: ReactNode;
		className?: string;
		direction?:
			| CSSProperties['flexDirection']
			| CSSProperties['flexDirection'][];
		expanded?: boolean;
		gap?: number | string;
		justify?: CSSProperties['justifyContent'];
		wrap?: boolean;
	}

	export const Flex: ComponentType<FlexProps>;

	// FlexItem
	export interface FlexItemProps {
		as?: keyof JSX.IntrinsicElements | ComponentType;
		children?: ReactNode;
		className?: string;
		display?: CSSProperties['display'];
		isBlock?: boolean;
	}

	export const FlexItem: ComponentType<FlexItemProps>;

	// FlexBlock
	export interface FlexBlockProps extends FlexItemProps {}

	export const FlexBlock: ComponentType<FlexBlockProps>;

	// CheckboxControl
	export interface CheckboxControlProps {
		checked?: boolean;
		className?: string;
		disabled?: boolean;
		help?: ReactNode;
		indeterminate?: boolean;
		label?: ReactNode;
		onChange: (value: boolean) => void;
	}

	export const CheckboxControl: ComponentType<CheckboxControlProps>;

	// __experimentalConfirmDialog
	export interface ConfirmDialogProps {
		children?: ReactNode;
		cancelButtonText?: string;
		confirmButtonText?: string;
		isOpen?: boolean;
		onCancel?: () => void;
		onConfirm?: () => void;
	}

	export const __experimentalConfirmDialog: ComponentType<ConfirmDialogProps>;

	// More components can be added as needed
}

// ============================================================================
// @wordpress/icons
// ============================================================================

declare module '@wordpress/icons' {
	import type { ComponentType, SVGProps } from 'react';

	export type IconType = ComponentType<SVGProps<SVGSVGElement>> | JSX.Element;

	// Common icons used in the project
	export const close: IconType;
	export const closeSmall: IconType;
	export const plus: IconType;
	export const moreVertical: IconType;
	export const moreHorizontal: IconType;
	export const check: IconType;
	export const pin: IconType;
	export const unpin: IconType;
	export const drafts: IconType;
	export const pending: IconType;
	export const notAllowed: IconType;
	export const trash: IconType;
	export const scheduled: IconType;
	export const layout: IconType;
	export const symbol: IconType;
	export const navigation: IconType;
	export const search: IconType;
	export const home: IconType;
	export const notFound: IconType;
	export const lock: IconType;
	export const external: IconType;
	export const link: IconType;
	export const copy: IconType;
	export const edit: IconType;
	export const chevronDown: IconType;
	export const chevronUp: IconType;
	export const chevronLeft: IconType;
	export const chevronRight: IconType;
	export const arrowLeft: IconType;
	export const arrowRight: IconType;
	export const arrowUp: IconType;
	export const arrowDown: IconType;
	export const settings: IconType;
	export const cog: IconType;
	export const help: IconType;
	export const info: IconType;
	export const warning: IconType;
	export const error: IconType;
	export const page: IconType;
	export const post: IconType;
	export const category: IconType;
	export const tag: IconType;
	export const file: IconType;
	export const media: IconType;
	export const image: IconType;
	export const video: IconType;
	export const audio: IconType;
	export const code: IconType;
	export const brush: IconType;
	export const desktop: IconType;
	export const mobile: IconType;
	export const tablet: IconType;
	export const undo: IconType;
	export const redo: IconType;
	export const backup: IconType;
	export const cloud: IconType;
	export const cloudUpload: IconType;
	export const download: IconType;
	export const upload: IconType;
	export const refresh: IconType;
	export const rotateRight: IconType;
	export const update: IconType;
	export const seen: IconType;
	export const unseen: IconType;
	export const star: IconType;
	export const starEmpty: IconType;
	export const starFilled: IconType;
	export const starHalf: IconType;
	export const menu: IconType;
	export const grid: IconType;
	export const list: IconType;
	export const blockDefault: IconType;
	export const archive: IconType;
	export const globe: IconType;
	export const plugins: IconType;
	export const tool: IconType;
	export const wordpress: IconType;
	export const wordpress2: IconType;

	// Add more icons as needed
	export const Icon: ComponentType<{
		icon: IconType;
		size?: number;
	}>;
}

// ============================================================================
// @wordpress/url
// ============================================================================

declare module '@wordpress/url' {
	export function addQueryArgs(
		url: string,
		args?: Record<string, unknown>
	): string;
	export function getQueryArg(url: string, arg: string): string | undefined;
	export function getQueryArgs(url: string): Record<string, string>;
	export function hasQueryArg(url: string, arg: string): boolean;
	export function removeQueryArgs(url: string, ...args: string[]): string;
	export function getPath(url: string): string | undefined;
	export function getProtocol(url: string): string | undefined;
	export function getAuthority(url: string): string | undefined;
	export function getFragment(url: string): string | undefined;
	export function getQueryString(url: string): string | undefined;
	export function isURL(url: string): boolean;
	export function isValidPath(path: string): boolean;
	export function isValidQueryString(queryString: string): boolean;
	export function isValidFragment(fragment: string): boolean;
	export function isValidProtocol(protocol: string): boolean;
	export function isValidAuthority(authority: string): boolean;
	export function getFilename(url: string): string | undefined;
	export function normalizePath(path: string): string;
	export function prependHTTP(url: string): string;
	export function prependHTTPS(url: string): string;
	export function safeDecodeURI(uri: string): string;
	export function safeDecodeURIComponent(uriComponent: string): string;
	export function filterURLForDisplay(
		url: string,
		maxLength?: number
	): string;
	export function cleanForSlug(input: string): string;
	export function buildQueryString(data: Record<string, unknown>): string;
}

// ============================================================================
// @wordpress/i18n
// ============================================================================

declare module '@wordpress/i18n' {
	export function __(text: string, domain?: string): string;
	export function _x(text: string, context: string, domain?: string): string;
	export function _n(
		single: string,
		plural: string,
		number: number,
		domain?: string
	): string;
	export function _nx(
		single: string,
		plural: string,
		number: number,
		context: string,
		domain?: string
	): string;
	export function sprintf(
		format: string,
		...args: (string | number)[]
	): string;
	export function setLocaleData(
		data: Record<string, unknown>,
		domain?: string
	): void;
	export function getLocaleData(domain?: string): Record<string, unknown>;
	export function subscribe(callback: () => void): () => void;
	export function hasTranslation(
		single: string,
		context?: string,
		domain?: string
	): boolean;
	export function resetLocaleData(
		data?: Record<string, unknown>,
		domain?: string
	): void;
	export function isRTL(): boolean;
}

// ============================================================================
// @wordpress/api-fetch
// ============================================================================

declare module '@wordpress/api-fetch' {
	export interface ApiFetchOptions extends RequestInit {
		path?: string;
		url?: string;
		parse?: boolean;
		data?: unknown;
	}

	export interface ApiFetchMiddleware {
		(
			options: ApiFetchOptions,
			next: (options: ApiFetchOptions) => Promise<unknown>
		): Promise<unknown>;
	}

	function apiFetch<T = unknown>(options: ApiFetchOptions): Promise<T>;

	namespace apiFetch {
		function use(middleware: ApiFetchMiddleware): void;
		function setFetchHandler(
			handler: (options: ApiFetchOptions) => Promise<unknown>
		): void;
		function createNonceMiddleware(nonce: string): ApiFetchMiddleware;
		function createPreloadingMiddleware(
			preloadedData: Record<string, unknown>
		): ApiFetchMiddleware;
		function createRootURLMiddleware(rootURL: string): ApiFetchMiddleware;
		const fetchAllMiddleware: ApiFetchMiddleware;
		const mediaUploadMiddleware: ApiFetchMiddleware;
	}

	export default apiFetch;
}

// ============================================================================
// @wordpress/block-editor
// ============================================================================

declare module '@wordpress/block-editor' {
	import type { ComponentType, ReactNode } from 'react';
	import type { StoreDescriptor } from '@wordpress/data';
	import type { Block } from '@wordpress/editor';

	export interface BlockEditorSelectors {
		getBlocks(): Block[];
		getBlock(clientId: string): Block | null;
		getBlockName(clientId: string): string | undefined;
		getBlockAttributes(
			clientId: string
		): Record<string, unknown> | undefined;
		getSelectedBlock(): Block | null;
		getSelectedBlockClientId(): string | null;
		getBlockRootClientId(clientId: string): string | null;
		getBlockParents(clientId: string, ascending?: boolean): string[];
		getBlockIndex(clientId: string): number;
		getBlockCount(rootClientId?: string | null): number;
		getBlockOrder(rootClientId?: string | null): string[];
		getBlockInsertionPoint(): {
			rootClientId: string | undefined;
			index: number;
		};
		isBlockSelected(clientId: string): boolean;
		hasSelectedBlock(): boolean;
		hasSelectedInnerBlock(clientId: string, deep?: boolean): boolean;
		isBlockValid(clientId: string): boolean;
		getBlockMode(clientId: string): 'visual' | 'html';
		isTyping(): boolean;
		isDraggingBlocks(): boolean;
		getDraggedBlockClientIds(): string[];
		isBlockBeingDragged(clientId: string): boolean;
		isAncestorBeingDragged(clientId: string): boolean;
		getSettings(): Record<string, unknown>;
	}

	export interface BlockEditorActions {
		insertBlock(
			block: Block,
			index?: number,
			rootClientId?: string,
			updateSelection?: boolean
		): void;
		insertBlocks(
			blocks: Block[],
			index?: number,
			rootClientId?: string,
			updateSelection?: boolean
		): void;
		updateBlock(clientId: string, updates: Partial<Block>): void;
		updateBlockAttributes(
			clientId: string,
			attributes: Record<string, unknown>
		): void;
		moveBlockToPosition(
			clientId: string,
			fromRootClientId: string,
			toRootClientId: string,
			index: number
		): void;
		moveBlocksUp(clientIds: string | string[], rootClientId?: string): void;
		moveBlocksDown(
			clientIds: string | string[],
			rootClientId?: string
		): void;
		removeBlock(clientId: string, selectPrevious?: boolean): void;
		removeBlocks(clientIds: string[], selectPrevious?: boolean): void;
		replaceBlock(clientId: string, block: Block | Block[]): void;
		replaceBlocks(clientIds: string[], blocks: Block | Block[]): void;
		selectBlock(clientId: string, initialPosition?: number): void;
		clearSelectedBlock(): void;
		multiSelect(start: string, end: string): void;
		resetSelection(): void;
		toggleSelection(isSelectionEnabled?: boolean): void;
		toggleBlockMode(clientId: string): void;
		startTyping(): void;
		stopTyping(): void;
		startDraggingBlocks(clientIds: string[]): void;
		stopDraggingBlocks(): void;
		updateSettings(settings: Record<string, unknown>): void;
	}

	export const store: StoreDescriptor<
		BlockEditorSelectors & BlockEditorActions
	>;

	// Components
	export const BlockControls: ComponentType<{
		children?: ReactNode;
		group?: string;
	}>;

	export const InspectorControls: ComponentType<{
		children?: ReactNode;
		group?: string;
	}>;

	export const RichText: ComponentType<{
		tagName?: keyof JSX.IntrinsicElements;
		value: string;
		onChange: (value: string) => void;
		placeholder?: string;
		multiline?: boolean | string;
		allowedFormats?: string[];
		withoutInteractiveFormatting?: boolean;
		className?: string;
		style?: Record<string, unknown>;
		identifier?: string;
		preserveWhiteSpace?: boolean;
		__unstableDisableFormats?: boolean;
		[key: string]: unknown;
	}>;

	export const MediaUpload: ComponentType<{
		onSelect: (media: unknown) => void;
		allowedTypes?: string[];
		value?: number;
		render: (props: { open: () => void }) => ReactNode;
		multiple?: boolean;
		gallery?: boolean;
		title?: string;
		addToGallery?: boolean;
	}>;

	export const MediaUploadCheck: ComponentType<{
		children?: ReactNode;
		fallback?: ReactNode;
	}>;

	export const useBlockProps: (
		props?: Record<string, unknown>
	) => Record<string, unknown>;
	export const useInnerBlocksProps: (
		props?: Record<string, unknown>,
		options?: Record<string, unknown>
	) => Record<string, unknown>;
}

// ============================================================================
// @wordpress/interface
// ============================================================================

declare module '@wordpress/interface' {
	import type { StoreDescriptor } from '@wordpress/data';

	export interface InterfaceSelectors {
		getActiveComplementaryArea(scope: string): string | null | undefined;
		isComplementaryAreaLoading(scope: string): boolean;
		isItemPinned(scope: string, itemName: string): boolean;
	}

	export interface InterfaceActions {
		enableComplementaryArea(scope: string, areaName: string): void;
		disableComplementaryArea(scope: string): void;
		pinItem(scope: string, itemName: string): void;
		unpinItem(scope: string, itemName: string): void;
	}

	export const store: StoreDescriptor<InterfaceSelectors & InterfaceActions>;
}

// ============================================================================
// Global WordPress types
// ============================================================================

declare global {
	interface Window {
		wp: {
			data: typeof import('@wordpress/data');
			element: typeof import('@wordpress/element');
			components: typeof import('@wordpress/components');
			coreData: typeof import('@wordpress/core-data');
			editor: typeof import('@wordpress/editor');
			blockEditor: typeof import('@wordpress/block-editor');
			commands: typeof import('@wordpress/commands');
			plugins: typeof import('@wordpress/plugins');
			url: typeof import('@wordpress/url');
			i18n: typeof import('@wordpress/i18n');
			apiFetch: typeof import('@wordpress/api-fetch');
			[key: string]: unknown;
		};
		wpApiSettings?: {
			root: string;
			nonce: string;
			versionString: string;
		};
		blockeraTabsSettings?: {
			ajaxUrl: string;
			nonce: string;
			userId: number;
			[key: string]: unknown;
		};
		blockeraTabsLock?: {
			ajaxUrl: string;
			checkNonce: string;
			takeoverNonce: string;
		};
		blockeraTabsBulkEditIds?: string;
		blockeraTabsBulkEditPostType?: string;
	}
}

// ============================================================================
// CSS Raw Import Support
// ============================================================================

declare module '*.css?raw' {
	const content: string;
	export default content;
}

// Also support without query parameter for compatibility
declare module '*.css' {
	const content: string;
	export default content;
}

export {};
