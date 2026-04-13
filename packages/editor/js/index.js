export * from './store';
export * from './hooks';
export * from './components';
export * from './extensions';
export { Observer } from './observer';
export {
	isBaseBreakpoint,
	getBaseBreakpoint,
	BreakpointsSettings,
	setupCanvasSettings,
	registerBlockeraEditorInternalPlugins,
	unstableBootstrapServerSideBreakpointDefinitions,
} from './editor';

// Command Bar (export-only, no auto-registration)
export * from './command-bar';
export { bootstrapCommandBar } from './command-bar';

// Editor (auto-registers plugins when imported)
export * from './editor';
export { bootstrapEditor } from './editor';

// Preview Mode (auto-registers plugin when imported)
export * from './preview-mode';
export { bootstrapPreviewMode } from './preview-mode';

// Scrollbar (auto-registers plugin when imported, also exports utilities)
export * from './scrollbar';
export { bootstrapScrollbar } from './scrollbar';

// Shortcuts (auto-registers plugin when imported)
export * from './shortcuts';
export { bootstrapShortcuts } from './shortcuts';

// Slots (auto-registers plugin when imported, also exports components)
export * from './slots';
export { bootstrapSlots } from './slots';

// Tabs (auto-registers plugin when imported)
export * from './tabs';
export { bootstrapTabs } from './tabs';

// Utils (export-only, no auto-registration)
export * from './utils';

// Zoom (auto-registers plugin when imported)
export * from './zoom';
export { bootstrapZoom } from './zoom';
