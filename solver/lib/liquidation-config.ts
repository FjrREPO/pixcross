import { LiquidationConfig } from './liquidation-processor';

export function loadLiquidationConfig(): LiquidationConfig[] {
  // Load configuration from environment variables
  const defaultConfig: LiquidationConfig[] = [];

  // Check if auto-discovery is enabled
  const autoDiscoveryEnabled = (process.env.AUTO_POOL_DISCOVERY || 'true').toLowerCase() === 'true';
  
  if (autoDiscoveryEnabled) {
    console.log('Auto pool discovery is enabled. Pools will be discovered automatically using listPool function.');
    // Return empty config - pools will be discovered automatically
    return defaultConfig;
  }

  // Parse liquidation pools from environment variable
  // Expected format: LIQUIDATION_POOLS=pool1,pool2,pool3
  const poolsEnv = process.env.LIQUIDATION_POOLS;
  if (!poolsEnv) {
    console.log('No liquidation pools configured. Set LIQUIDATION_POOLS environment variable or enable AUTO_POOL_DISCOVERY.');
    return defaultConfig;
  }

  const poolIds = poolsEnv.split(',').map(id => id.trim()).filter(id => id.length > 0);
  
  for (const poolId of poolIds) {
    const config: LiquidationConfig = {
      poolId,
      maxTokensToCheck: parseInt(process.env[`LIQUIDATION_MAX_TOKENS_${poolId.toUpperCase()}`] || process.env.LIQUIDATION_MAX_TOKENS || '10'),
      checkInterval: parseInt(process.env[`LIQUIDATION_CHECK_INTERVAL_${poolId.toUpperCase()}`] || process.env.LIQUIDATION_CHECK_INTERVAL || '300000'), // 5 minutes default
      enabled: (process.env[`LIQUIDATION_ENABLED_${poolId.toUpperCase()}`] || process.env.LIQUIDATION_ENABLED || 'true').toLowerCase() === 'true',
    };
    
    defaultConfig.push(config);
  }

  return defaultConfig;
}

export function validateLiquidationConfig(config: LiquidationConfig[]): string[] {
  const errors: string[] = [];

  for (const poolConfig of config) {
    if (!poolConfig.poolId || poolConfig.poolId.trim().length === 0) {
      errors.push('Pool ID cannot be empty');
    }

    if (poolConfig.maxTokensToCheck <= 0) {
      errors.push(`Max tokens to check must be positive for pool ${poolConfig.poolId}`);
    }
    
    if (poolConfig.maxTokensToCheck > 100) {
      errors.push(`Max tokens to check should not exceed 100 for pool ${poolConfig.poolId} (recommended: 10-25)`);
    }

    if (poolConfig.checkInterval < 60000) { // Minimum 1 minute
      errors.push(`Check interval must be at least 60 seconds for pool ${poolConfig.poolId}`);
    }
  }

  return errors;
}

export function getDefaultLiquidationConfig(): LiquidationConfig[] {
  return [
    {
      poolId: 'default-pool',
      maxTokensToCheck: 100,
      checkInterval: 60000, // 1 minute
      enabled: false, // Disabled by default for safety
    }
  ];
}
