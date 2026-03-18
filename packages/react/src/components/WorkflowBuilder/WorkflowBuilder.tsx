import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Node as ReactFlowNode, Edge, ReactFlowProvider } from '@xyflow/react';
import { injectStyles } from '../../utils/injectStyles';
import { globalStyles, componentStyles } from '../../styles/cssInJs';
import { WorkflowCanvas } from '../WorkflowCanvas/WorkflowCanvas';
import { NodePalette, NodePaletteProps } from '../NodePalette/NodePalette';
import { PropertyPanel, PropertyPanelProps } from '../PropertyPanel/PropertyPanel';
import { Toolbar, ToolbarProps, ToolbarOptions, ToolbarIcons } from '../Toolbar/Toolbar';
import { ResizablePanel } from '../ResizablePanel/ResizablePanel';
import { CustomNodeData } from '../Node/CustomNode';
import {
  useWorkflow,
  useReactFlowState,
  useWorkflowFileOperations,
  useNodePalette,
  useExecutionVisuals,
} from '../../hooks';
import {
  WorkflowBuilderClasses,
  WorkflowBuilderStyles,
  ReactFlowCustomization,
} from '../../types/styling';
import {
  Theme,
  lightTheme,
  darkTheme,
  detectSystemTheme,
  themeToCSSVariables,
} from '../../types/theme';
import { cn, mergeStyles } from '../../utils/styling';
import { Executor, NodeConstructor, Workflow } from '@crystalflow/core';
import { WorkflowData } from '@crystalflow/types';

// Inject styles at module level to ensure they're loaded before any component renders
// This prevents FOUC (Flash of Unstyled Content)
injectStyles(globalStyles, 'crystalflow-global');
injectStyles(componentStyles, 'crystalflow-components');

/**
 * WorkflowBuilder Props
 */
export interface WorkflowBuilderProps {
  /**
   * Array of node classes (decorated with @defineNode)
   */
  nodes?: NodeConstructor[];

  /**
   * Initial workflow data (WorkflowData format)
   */
  initialWorkflow?: WorkflowData;

  /**
   * Whether to show the node palette
   */
  showPalette?: boolean;

  /**
   * Whether to show the property panel
   */
  showProperties?: boolean;

  /**
   * Whether to show the toolbar
   */
  showToolbar?: boolean;

  /**
   * Whether to show the JSON editor
   */
  showJsonEditor?: boolean;

  /**
   * Theme configuration
   * Pass 'light', 'dark', or 'auto' to use built-in themes
   * Or provide a custom Theme object for full control
   * @default 'light'
   */
  theme?: Theme | 'light' | 'dark' | 'auto';

  /**
   * Editor mode: visual only, JSON only, or split view
   */
  editorMode?: 'visual' | 'json' | 'split';

  /**
   * JSON editor theme
   */
  jsonEditorTheme?: 'vs-dark' | 'vs-light' | 'hc-black';

  /**
   * Callback when workflow changes
   */
  onWorkflowChange?: (nodes: ReactFlowNode[], edges: Edge[]) => void;

  /**
   * Callback when execution completes
   */
  onExecute?: (result: unknown) => void;

  /**
   * Callback when execution fails
   */
  onError?: (error: Error) => void;

  /**
   * Custom styles
   */
  style?: React.CSSProperties;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Class name overrides for sub-components
   */
  classes?: WorkflowBuilderClasses;

  /**
   * Style overrides for sub-components
   */
  styles?: WorkflowBuilderStyles;

  /**
   * ReactFlow customization (props for ReactFlow and its sub-components)
   */
  reactFlowCustomization?: ReactFlowCustomization;

  /**
   * Node palette customization
   */
  nodePaletteProps?: Partial<Omit<NodePaletteProps, 'nodes' | 'onNodeDragStart'>>;

  /**
   * Property panel customization
   */
  propertyPanelProps?: Partial<Omit<PropertyPanelProps, 'node' | 'onUpdate' | 'onClose'>>;

  /**
   * Toolbar customization
   */
  toolbarProps?: Partial<Omit<ToolbarProps, 'onExecute' | 'onSave' | 'onLoad' | 'onClear'>>;

  /**
   * Configure which toolbar buttons to show
   * @example { showExecute: true, showSave: true, showLoad: false, showClear: true }
   */
  toolbarOptions?: ToolbarOptions;

  /**
   * Customize or remove toolbar button icons
   * @example { execute: '▶', save: null, load: '📝' } // Custom execute, no save icon, custom load
   */
  toolbarIcons?: ToolbarIcons;

  /**
   * UI settings configuration
   * @example
   * ```tsx
   * uiSettings={{
   *   minimap: true,
   *   onMinimapChange: (show) => setMinimap(show),
   *   controls: false,
   *   onControlsChange: (show) => setControls(show),
   *   customSettings: <button>Grid</button>
   * }}
   * ```
   */
  uiSettings?: {
    /** Whether minimap is shown @default true */
    minimap?: boolean;
    /** Callback for toggling minimap visibility */
    onMinimapChange?: (show: boolean) => void;
    /** Whether flow controls are shown @default true */
    controls?: boolean;
    /** Callback for toggling flow controls visibility */
    onControlsChange?: (show: boolean) => void;
    /** Custom UI settings component for the toolbar */
    customSettings?: React.ReactNode;
  };

  /**
   * Custom node content renderer
   * Allows complete control over what's rendered inside each node
   *
   * @example
   * ```tsx
   * renderNodeContent={(data) => (
   *   <div>
   *     <h3>{data.label}</h3>
   *     {data.category === 'Math' && <span>🔢</span>}
   *   </div>
   * )}
   * ```
   */
  renderNodeContent?: (data: CustomNodeData) => React.ReactNode;

  /**
   * Custom palette item renderer
   * Allows complete control over what's rendered for each node in the palette
   *
   * @example
   * ```tsx
   * renderPaletteItem={(item) => (
   *   <div>
   *     <span>{item.category === 'Math' ? '🔢' : '📦'}</span>
   *     <strong>{item.label}</strong>
   *   </div>
   * )}
   * ```
   */
  renderPaletteItem?: (item: { type: string; label: string; category?: string }) => React.ReactNode;

  /**
   * Custom toolbar renderer
   * Allows complete control over the toolbar rendering
   * Receives toolbar actions and state as parameters
   *
   * @example
   * ```tsx
   * renderToolbar={(actions) => (
   *   <div style={{ padding: '10px' }}>
   *     <button onClick={actions.onExecute}>▶️ Run</button>
   *     <button onClick={actions.onSave}>💾 Save</button>
   *   </div>
   * )}
   * ```
   */
  renderToolbar?: (actions: {
    onExecute: () => void;
    onSave: () => void;
    onLoad: () => void;
    onClear: () => void;
    onClearExecution: () => void;
    canExecute: boolean;
  }) => React.ReactNode;
}

/**
 * Main WorkflowBuilder component
 *
 * Orchestrates the workflow editing experience by combining:
 * - React Flow canvas for visual workflow editing
 * - Node palette for drag-and-drop
 * - Property panel for node configuration
 * - Toolbar for workflow actions
 *
 * Supports extensive styling customization:
 * - className/classes for custom CSS classes
 * - style/styles for inline styles
 * - reactFlowCustomization for ReactFlow props
 * - Component-specific props (nodePaletteProps, propertyPanelProps, toolbarProps)
 *
 * @example
 * ```tsx
 * <WorkflowBuilder
 *   nodes={[AddNode, MultiplyNode]}
 *   showPalette={true}
 *   showProperties={true}
 *   classes={{
 *     root: 'my-workflow',
 *     palette: 'my-palette',
 *     canvas: 'my-canvas'
 *   }}
 *   reactFlowCustomization={{
 *     backgroundProps: { variant: 'dots', color: '#eee' },
 *     miniMapProps: { position: 'bottom-right' }
 *   }}
 *   onWorkflowChange={(nodes, edges) => console.log(nodes, edges)}
 * />
 * ```
 */
export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  nodes = [],
  initialWorkflow,
  showPalette = true,
  showProperties = true,
  showToolbar = true,
  theme = 'light',
  onWorkflowChange,
  style,
  className,
  classes,
  styles,
  reactFlowCustomization,
  nodePaletteProps,
  propertyPanelProps,
  toolbarProps,
  toolbarOptions,
  toolbarIcons,
  uiSettings,
  renderNodeContent,
  renderPaletteItem,
  renderToolbar,
}) => {
  // Resolve theme
  const resolvedTheme: Theme =
    typeof theme === 'string'
      ? theme === 'auto'
        ? detectSystemTheme() === 'dark'
          ? darkTheme
          : lightTheme
        : theme === 'dark'
          ? darkTheme
          : lightTheme
      : theme;

  // State for React Flow instance
  const [screenToFlowPosition, setScreenToFlowPosition] = useState<
    ((pos: { x: number; y: number }) => { x: number; y: number }) | undefined
  >(undefined);

  // State for UI settings (internal state as fallback)
  const [internalShowMinimap, setInternalShowMinimap] = useState(true);
  const [internalShowFlowControls, setInternalShowFlowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Use controlled props if provided, otherwise use internal state
  const showMinimap = uiSettings?.minimap ?? internalShowMinimap;
  const showFlowControls = uiSettings?.controls ?? internalShowFlowControls;

  // Create wrapper handlers that accept boolean values
  const handleToggleMinimap = useCallback(
    (show: boolean) => {
      if (uiSettings?.onMinimapChange) {
        uiSettings.onMinimapChange(show);
      } else {
        setInternalShowMinimap(show);
      }
    },
    [uiSettings]
  );

  const handleToggleFlowControls = useCallback(
    (show: boolean) => {
      if (uiSettings?.onControlsChange) {
        uiSettings.onControlsChange(show);
      } else {
        setInternalShowFlowControls(show);
      }
    },
    [uiSettings]
  );

  const customUISettings = uiSettings?.customSettings;

  // Fullscreen toggle handler
  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // State management hooks
  const workflowState = useWorkflow();
  const { workflow } = workflowState;

  // Force re-render when workflow connections change
  const [workflowVersion, setWorkflowVersion] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize workflow
  useEffect(() => {
    if (!isInitialized) {
      if (!workflow) {
        workflowState.createWorkflow();
      }
      setIsInitialized(true);
    }
  }, [workflow, workflowState, isInitialized]);

  const reactFlowState = useReactFlowState(workflow, workflowVersion);
  const { saveWorkflow, loadWorkflow, loadFromData } = useWorkflowFileOperations();
  const nodePalette = useNodePalette(nodes, screenToFlowPosition);

  // Load initial workflow data (similar to file loading)
  useEffect(() => {
    if (initialWorkflow && isInitialized && reactFlowState.nodes.length === 0 && workflow) {
      try {
        // Create workflow from JSON data (includes all connections)
        const loadedWorkflow = Workflow.fromJSON(initialWorkflow);

        // Replace the workflow in context with the loaded one
        workflowState.setWorkflow(loadedWorkflow);

        // Convert workflow to React Flow format
        const result = loadFromData(initialWorkflow);
        if (result.success && result.nodes) {
          // Inject renderNodeContent into all loaded nodes
          const nodesWithRenderer = renderNodeContent
            ? result.nodes.map((node) => ({
                ...node,
                data: { ...node.data, renderNodeContent },
              }))
            : result.nodes;

          reactFlowState.loadWorkflow(nodesWithRenderer);
          // Force re-render to sync edges from workflow connections
          setWorkflowVersion((v) => v + 1);
        }
      } catch (error) {
        console.error('Failed to load initial workflow:', error);
      }
    }
  }, [
    initialWorkflow,
    isInitialized,
    loadFromData,
    reactFlowState,
    workflow,
    workflowState,
    renderNodeContent,
  ]);

  // Execution visual state hook
  const [executor] = useState(() => new Executor());
  const executionVisuals = useExecutionVisuals(
    executor,
    reactFlowState.nodes,
    workflow?.connections || new Map(),
    {
      autoReset: false, // Keep execution path visible (don't auto-clear)
      autoResetDelay: 3000,
      // Visual pacing delays (moved from core Executor to keep engine overhead-free)
      nodeTransitionDelay: 120, // ms to show 'queued' state before 'running'
      connectionActiveDuration: 100, // minimum ms to show an active edge
    },
    workflowVersion // Pass version to trigger connection map rebuild
  );

  // Callback to capture React Flow instance
  const handleReactFlowInit = useCallback(
    (instance: {
      screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number };
    }) => {
      setScreenToFlowPosition(() => instance.screenToFlowPosition);
    },
    [] // Empty deps - only create once
  );

  // Handle connection creation (syncs with workflow)
  const handleConnect = useCallback(
    (connection: {
      source: string | null;
      sourceHandle: string | null;
      target: string | null;
      targetHandle: string | null;
    }) => {
      if (
        workflow &&
        connection.source &&
        connection.target &&
        connection.sourceHandle &&
        connection.targetHandle
      ) {
        workflowState.connect(
          connection.source,
          connection.sourceHandle,
          connection.target,
          connection.targetHandle
        );
        // Force re-render to sync edges
        setWorkflowVersion((v) => v + 1);
      }
    },
    [workflow, workflowState]
  );

  // Note: renderNodeContent is injected into nodes when they're created
  // via the nodePalette.onDrop handler, not here to avoid infinite loops

  // Handle toolbar actions
  const handleSave = useCallback(() => {
    const result = saveWorkflow(reactFlowState.nodes, reactFlowState.edges);
    if (!result.success) {
      console.error('Save failed:', result.error);
    }
  }, [reactFlowState.nodes, reactFlowState.edges, saveWorkflow]);

  const handleLoad = useCallback(async () => {
    const result = await loadWorkflow();
    if (result.success) {
      reactFlowState.loadWorkflow(result.nodes!);
    } else {
      console.error('Load failed:', result.error);
    }
  }, [loadWorkflow, reactFlowState]);

  const handleExecute = useCallback(async () => {
    if (!workflow) {
      console.error('No workflow to execute');
      return;
    }

    try {
      // Clear previous execution visual state
      executionVisuals.reset();

      // Sync node property values from React Flow to workflow before execution
      reactFlowState.nodes.forEach((rfNode) => {
        const workflowNode = workflow.getNode(rfNode.id);
        if (workflowNode && rfNode.data.properties) {
          // Update property values from React Flow node data
          Object.keys(rfNode.data.properties).forEach((propKey) => {
            if (rfNode.data[propKey] !== undefined) {
              workflowNode[propKey] = rfNode.data[propKey];
            }
          });
        }
      });

      // Execute the existing workflow instance with the executor
      await executor.execute(workflow, {
        timeout: 30000,
      });
    } catch (error) {
      console.error('Execution failed:', error);
    }
  }, [workflow, executor, reactFlowState.nodes, executionVisuals]);

  const handleClearExecution = useCallback(() => {
    executionVisuals.reset();
  }, [executionVisuals]);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      const addNodeWithRenderContent = (node: ReactFlowNode) => {
        if (renderNodeContent) {
          node.data = { ...node.data, renderNodeContent };
        }

        // Add to React Flow
        reactFlowState.addNode(node);

        // Also add to workflow if we have both workflow and nodeClass
        if (workflow && node.data.nodeClass) {
          try {
            // Create workflow node instance
            const NodeClass = node.data.nodeClass as NodeConstructor;
            const workflowNode = new NodeClass(node.id);

            // Copy position
            workflowNode.position = node.position;

            // Add to workflow's internal nodes map
            workflow.addNodeInstance(workflowNode);
          } catch (error) {
            console.error('Failed to add node to workflow:', error);
          }
        }
      };
      nodePalette.onDrop(event, reactFlowState.generateNodeId, addNodeWithRenderContent);
    },
    [nodePalette, reactFlowState, renderNodeContent, workflow]
  );

  // Notify parent of changes
  useEffect(() => {
    onWorkflowChange?.(reactFlowState.nodes, reactFlowState.edges);
  }, [reactFlowState.nodes, reactFlowState.edges, onWorkflowChange]);

  // Default toolbar renderer
  const defaultRenderToolbar = (actions: {
    onExecute: () => void;
    onSave: () => void;
    onLoad: () => void;
    onClear: () => void;
    onClearExecution: () => void;
    canExecute: boolean;
  }) => (
    <Toolbar
      onClear={actions.onClear}
      onClearExecution={actions.onClearExecution}
      onSave={actions.onSave}
      onLoad={actions.onLoad}
      onExecute={actions.onExecute}
      canExecute={actions.canExecute}
      showMinimap={showMinimap}
      onToggleMinimap={handleToggleMinimap}
      showFlowControls={showFlowControls}
      onToggleFlowControls={handleToggleFlowControls}
      isFullscreen={isFullscreen}
      onToggleFullscreen={handleToggleFullscreen}
      customUISettings={customUISettings}
      options={toolbarOptions}
      icons={toolbarIcons}
      className={classes?.toolbar}
      style={styles?.toolbar}
      {...toolbarProps}
    />
  );

  const defaultRootStyle: React.CSSProperties = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...(isFullscreen && {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }),
      ...themeToCSSVariables(resolvedTheme),
    }),
    [resolvedTheme, isFullscreen]
  );

  const mainContentStyle = useMemo(
    () => ({ flex: 1, display: 'flex', overflow: 'hidden' as const }),
    []
  );

  const handlePropertyPanelClose = useCallback(() => {
    reactFlowState.onPaneClick();
  }, [reactFlowState]);

  const handlePropertyPanelUpdate = useCallback(
    (updates: Record<string, unknown>) => {
      if (reactFlowState.selectedNode) {
        reactFlowState.updateNode(reactFlowState.selectedNode.id, updates);
      }
    },
    [reactFlowState]
  );

  return (
    <ReactFlowProvider>
      <div
        className={cn(className, classes?.root, `crystalflow-theme-${resolvedTheme.mode}`)}
        style={mergeStyles(defaultRootStyle, styles?.root, style)}
        data-theme={resolvedTheme.mode}
      >
        {/* Toolbar */}
        {showToolbar &&
          (renderToolbar || defaultRenderToolbar)({
            onExecute: handleExecute,
            onSave: handleSave,
            onLoad: handleLoad,
            onClear: reactFlowState.clearWorkflow,
            onClearExecution: handleClearExecution,
            canExecute: reactFlowState.nodes.length > 0,
          })}

        {/* Main content area */}
        <div style={mainContentStyle}>
          {/* Node Palette */}
          {showPalette && (
            <ResizablePanel
              minWidth={200}
              maxWidth={400}
              defaultWidth={280}
              storageKey="crystalflow-node-palette-width"
              resizeHandle="right"
            >
              <NodePalette
                nodes={nodePalette.paletteItems}
                onNodeDragStart={nodePalette.onNodeDragStart}
                className={classes?.palette}
                style={styles?.palette}
                renderPaletteItem={renderPaletteItem}
                {...nodePaletteProps}
              />
            </ResizablePanel>
          )}

          {/* React Flow Canvas */}
          <WorkflowCanvas
            nodes={reactFlowState.nodes}
            edges={reactFlowState.edges}
            onNodesChange={reactFlowState.onNodesChange}
            onEdgesChange={reactFlowState.onEdgesChange}
            onConnect={handleConnect}
            onNodeClick={reactFlowState.onNodeClick}
            onPaneClick={reactFlowState.onPaneClick}
            onDrop={handleDrop}
            onDragOver={nodePalette.onDragOver}
            onReactFlowInit={handleReactFlowInit}
            className={`${classes?.canvas || ''} crystalflow-theme-${resolvedTheme.mode}`}
            onClearExecution={handleClearExecution}
            executionState={executionVisuals}
            style={styles?.canvas}
            colorMode={resolvedTheme.mode === 'dark' ? 'dark' : 'light'}
            reactFlowCustomization={{
              ...reactFlowCustomization,
              showMiniMap: showMinimap,
              showControls: showFlowControls,
              miniMapProps: reactFlowCustomization?.miniMapProps,
              controlsProps: reactFlowCustomization?.controlsProps,
            }}
          />

          {/* Property Panel */}
          {showProperties && reactFlowState.selectedNode && (
            <ResizablePanel
              minWidth={250}
              maxWidth={600}
              defaultWidth={350}
              storageKey="crystalflow-property-panel-width"
              resizeHandle="left"
            >
              <PropertyPanel
                node={reactFlowState.selectedNode}
                onClose={handlePropertyPanelClose}
                onUpdate={handlePropertyPanelUpdate}
                className={classes?.properties}
                style={styles?.properties}
                {...propertyPanelProps}
              />
            </ResizablePanel>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
};
