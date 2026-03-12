import { useState, useCallback, useEffect } from 'react';
import { NodeConstructor, NodeRegistry } from '@crystalflow/core';
import type { NodeMetadata, NodeDefinition } from '@crystalflow/types';

/**
 * Hook for accessing the NodeRegistry
 *
 * Provides access to registered node types and their metadata.
 *
 * @example
 * ```tsx
 * const { registry, nodes, register } = useNodeRegistry();
 * ```
 */
export const useNodeRegistry = (nodeClasses?: NodeConstructor[]) => {
  const [registry] = useState(() => NodeRegistry.getInstance());
  const [nodes, setNodes] = useState<NodeDefinition[]>([]);

  const register = useCallback(
    (nodeClass: NodeConstructor) => {
      registry.register(nodeClass);
      // Refresh nodes list
      setNodes(registry.getAllDefinitions());
    },
    [registry]
  );

  const unregister = useCallback(
    (nodeType: string) => {
      registry.unregister(nodeType);
      // Refresh nodes list
      setNodes(registry.getAllDefinitions());
    },
    [registry]
  );

  const getNodeMetadata = useCallback(
    (nodeType: string): NodeMetadata | undefined => {
      try {
        const definition = registry.getDefinition(nodeType);
        return definition.metadata;
      } catch {
        return undefined;
      }
    },
    [registry]
  );

  const getNodeClass = useCallback(
    (nodeType: string): NodeConstructor | undefined => {
      return registry.get(nodeType);
    },
    [registry]
  );

  const hasNode = useCallback(
    (nodeType: string): boolean => {
      return registry.has(nodeType);
    },
    [registry]
  );

  // Register initial node classes
  useEffect(() => {
    if (nodeClasses && nodeClasses.length > 0) {
      nodeClasses.forEach((nodeClass) => {
        const metadata = Reflect.getMetadata('node:metadata', nodeClass);
        if (metadata && !registry.has(metadata.type)) {
          registry.register(nodeClass);
        }
      });
      setNodes(registry.getAllDefinitions());
    }
  }, [nodeClasses, registry]);

  // Initialize nodes list
  useEffect(() => {
    setNodes(registry.getAllDefinitions());
  }, [registry]);

  return {
    registry,
    nodes,
    register,
    unregister,
    getNodeMetadata,
    getNodeClass,
    hasNode,
  };
};
