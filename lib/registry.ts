/**
 * Supreme Toolkit Registry System
 * 
 * This file contains the registry schema and utilities for managing
 * Supreme Toolkit modules.
 */

// ============================================================================
// REGISTRY TYPES
// ============================================================================

export type RegistryFileType = 
  | 'registry:ui'        // UI components
  | 'registry:hook'      // React hooks
  | 'registry:action'    // Server actions
  | 'registry:api'       // API routes
  | 'registry:lib'       // Utility libraries
  | 'registry:type'      // TypeScript definitions
  | 'registry:config';   // Configuration files

export interface RegistryFile {
  name: string;
  content: string;
  type: RegistryFileType;
  target: string;
}

export interface RegistryDependency {
  name: string;
  version?: string;
}

export interface RegistryTailwindConfig {
  config?: {
    theme?: {
      extend?: Record<string, any>;
    };
  };
  plugins?: string[];
}

export interface RegistryMeta {
  description: string;
  tags: string[];
  version: string;
  author?: string;
  license?: string;
  homepage?: string;
  repository?: string;
  documentation?: string;
}

export interface RegistryModule {
  name: string;
  type: 'registry:module';
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
  tailwind?: RegistryTailwindConfig;
  cssVars?: Record<string, string>;
  meta: RegistryMeta;
  envVars?: {
    required: string[];
    optional: string[];
  };
  postInstall?: {
    instructions: string[];
    commands?: string[];
  };
}

// ============================================================================
// REGISTRY VALIDATION
// ============================================================================

export function validateRegistryModule(module: any): module is RegistryModule {
  if (!module || typeof module !== 'object') {
    return false;
  }

  // Check required fields
  const requiredFields = ['name', 'type', 'files', 'meta'];
  for (const field of requiredFields) {
    if (!(field in module)) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }

  // Validate type
  if (module.type !== 'registry:module') {
    console.error(`Invalid type: ${module.type}. Expected 'registry:module'`);
    return false;
  }

  // Validate files array
  if (!Array.isArray(module.files) || module.files.length === 0) {
    console.error('Files array is required and must not be empty');
    return false;
  }

  // Validate each file
  for (const file of module.files) {
    if (!validateRegistryFile(file)) {
      return false;
    }
  }

  // Validate meta
  if (!validateRegistryMeta(module.meta)) {
    return false;
  }

  return true;
}

export function validateRegistryFile(file: any): file is RegistryFile {
  if (!file || typeof file !== 'object') {
    return false;
  }

  const requiredFields = ['name', 'content', 'type', 'target'];
  for (const field of requiredFields) {
    if (!(field in file)) {
      console.error(`File missing required field: ${field}`);
      return false;
    }
  }

  const validTypes: RegistryFileType[] = [
    'registry:ui',
    'registry:hook',
    'registry:action',
    'registry:api',
    'registry:lib',
    'registry:type',
    'registry:config'
  ];

  if (!validTypes.includes(file.type)) {
    console.error(`Invalid file type: ${file.type}`);
    return false;
  }

  return true;
}

export function validateRegistryMeta(meta: any): meta is RegistryMeta {
  if (!meta || typeof meta !== 'object') {
    return false;
  }

  const requiredFields = ['description', 'tags', 'version'];
  for (const field of requiredFields) {
    if (!(field in meta)) {
      console.error(`Meta missing required field: ${field}`);
      return false;
    }
  }

  if (!Array.isArray(meta.tags)) {
    console.error('Meta tags must be an array');
    return false;
  }

  return true;
}

// ============================================================================
// REGISTRY UTILITIES
// ============================================================================

/**
 * Load a registry module from JSON
 */
export async function loadRegistryModule(moduleName: string): Promise<RegistryModule | null> {
  try {
    // Check if we're in a Node.js environment (server-side or CLI)
    if (typeof window === 'undefined') {
      // Load from file system
      const fs = await import('fs/promises');
      const path = await import('path');

      const filePath = path.join(process.cwd(), 'registry', 'supremetoolkit', `${moduleName}.json`);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const registryModule = JSON.parse(fileContent);

      if (!validateRegistryModule(registryModule)) {
        console.error(`Invalid module format: ${moduleName}`);
        return null;
      }

      return registryModule;
    } else {
      // Load from URL (client-side)
      const response = await fetch(`/registry/supremetoolkit/${moduleName}.json`);
      if (!response.ok) {
        console.error(`Failed to load module: ${moduleName}`);
        return null;
      }

      const registryModule = await response.json();

      if (!validateRegistryModule(registryModule)) {
        console.error(`Invalid module format: ${moduleName}`);
        return null;
      }

      return registryModule;
    }
  } catch (error) {
    console.error(`Error loading module ${moduleName}:`, error);
    return null;
  }
}

/**
 * Get the target path for a file based on its type
 */
export function getFileTargetPath(file: RegistryFile): string {
  // If target is explicitly set, use it
  if (file.target) {
    return file.target;
  }

  // Otherwise, determine based on type and name
  const baseName = file.name.replace(/\.(tsx?|jsx?)$/, '');
  
  switch (file.type) {
    case 'registry:ui':
      return `components/ui/${file.name}`;
    case 'registry:hook':
      return `hooks/${file.name}`;
    case 'registry:action':
      return `actions/${file.name}`;
    case 'registry:api':
      return `app/api/${baseName}/route.ts`;
    case 'registry:lib':
      return `lib/${file.name}`;
    case 'registry:type':
      return `types/${file.name}`;
    case 'registry:config':
      return file.name;
    default:
      return file.name;
  }
}

/**
 * Extract dependencies from a registry module
 */
export function extractDependencies(module: RegistryModule): {
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
} {
  return {
    dependencies: module.dependencies || [],
    devDependencies: module.devDependencies || [],
    registryDependencies: module.registryDependencies || [],
  };
}

/**
 * Generate installation instructions for a module
 */
export function generateInstallInstructions(module: RegistryModule): string[] {
  const instructions: string[] = [];
  
  instructions.push(`Installing ${module.name}...`);
  
  // Dependencies
  const deps = extractDependencies(module);
  if (deps.dependencies.length > 0) {
    instructions.push(`Installing dependencies: ${deps.dependencies.join(', ')}`);
  }
  
  if (deps.devDependencies.length > 0) {
    instructions.push(`Installing dev dependencies: ${deps.devDependencies.join(', ')}`);
  }
  
  // Files
  instructions.push(`Creating ${module.files.length} files:`);
  module.files.forEach(file => {
    instructions.push(`  - ${getFileTargetPath(file)}`);
  });
  
  // Environment variables
  if (module.envVars) {
    if (module.envVars.required.length > 0) {
      instructions.push(`Required environment variables: ${module.envVars.required.join(', ')}`);
    }
    if (module.envVars.optional.length > 0) {
      instructions.push(`Optional environment variables: ${module.envVars.optional.join(', ')}`);
    }
  }
  
  // Post-install instructions
  if (module.postInstall?.instructions) {
    instructions.push('Post-installation steps:');
    module.postInstall.instructions.forEach(instruction => {
      instructions.push(`  - ${instruction}`);
    });
  }
  
  return instructions;
}

/**
 * Check if a module is compatible with the current project
 */
export function checkModuleCompatibility(module: RegistryModule): {
  compatible: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check for conflicting files
  // This would need to be implemented based on the actual file system
  
  // Check for missing registry dependencies
  if (module.registryDependencies && module.registryDependencies.length > 0) {
    // This would need to check if other registry modules are installed
  }
  
  return {
    compatible: issues.length === 0,
    issues,
  };
}

/**
 * Create a registry module template
 */
export function createModuleTemplate(name: string): RegistryModule {
  return {
    name,
    type: 'registry:module',
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    files: [],
    meta: {
      description: `${name} module for Supreme Toolkit`,
      tags: [],
      version: '1.0.0',
    },
  };
}
