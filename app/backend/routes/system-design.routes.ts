import { getSystemDesignOverview } from '../controllers/system-design.controller';

export const systemDesignRoutes = [
  {
    method: 'GET',
    path: '/api/system-design',
    handler: getSystemDesignOverview
  }
];
