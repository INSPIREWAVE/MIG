import { moduleCatalog } from '../models/module-catalog';

export const getSystemDesignOverview = () => ({
  generatedAt: new Date().toISOString(),
  modules: moduleCatalog
});
