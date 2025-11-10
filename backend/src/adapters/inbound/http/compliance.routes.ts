import { Router } from 'express';
import { ComplianceController } from './compliance.controller';

export const createComplianceRouter = (controller: ComplianceController): Router => {
  const router = Router();

  // GET /compliance/cb?shipId&year
  router.get('/cb', controller.getCB.bind(controller));

  // GET /compliance/adjusted-cb?shipId&year
  // router.get('/adjusted-cb', controller.getAdjustedCB.bind(controller));

  return router;
};