export type PortalMode = 'immersive' | 'interpret';

export interface PortalModeSpec {
  showSidePanel: boolean;
  showAnnotations: boolean;
  showRagChat: boolean;
  showSaveButton: boolean;
  showStyleVariants: boolean;
  showRelatedHotspots: boolean;
  showAiInterpretation: boolean;
  videoLayout: 'fullscreen' | 'split';
  portalContainerClass: string;
  videoAreaClass: string;
}

export const PORTAL_MODE_SPEC: Record<PortalMode, PortalModeSpec> = {
  immersive: {
    showSidePanel: false,
    showAnnotations: false,
    showRagChat: false,
    showSaveButton: false,
    showStyleVariants: false,
    showRelatedHotspots: false,
    showAiInterpretation: false,
    videoLayout: 'fullscreen',
    portalContainerClass: 'fixed inset-0 z-[100] flex flex-col bg-black animate-in fade-in duration-500',
    videoAreaClass: 'flex-1 relative flex items-center justify-center overflow-hidden bg-[#050505]',
  },
  interpret: {
    showSidePanel: true,
    showAnnotations: true,
    showRagChat: true,
    showSaveButton: true,
    showStyleVariants: true,
    showRelatedHotspots: true,
    showAiInterpretation: true,
    videoLayout: 'split',
    portalContainerClass:
      'fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-700',
    videoAreaClass: 'flex-[1.4] bg-black relative flex items-center justify-center overflow-hidden',
  },
};

export function getPortalModeSpec(mode: PortalMode): PortalModeSpec {
  return PORTAL_MODE_SPEC[mode];
}

export function shouldShowExploreChrome(
  hasPortal: boolean,
  portalMode: PortalMode
): boolean {
  return !hasPortal || portalMode === 'interpret';
}

/** 画卷页始终可唤起导览；门户打开时仅解读模式显示（沉浸观影不显示） */
export function shouldShowRagChat(
  currentView: string,
  hasPortal: boolean,
  portalMode: PortalMode
): boolean {
  if (currentView !== 'explore') return false;
  if (!hasPortal) return true;
  return portalMode === 'interpret';
}
