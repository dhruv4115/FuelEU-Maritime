import { Router } from 'express';
import { RouteController } from './route.controller';

export const createRouteRouter = (controller: RouteController): Router => {
  const router = Router();

  router.get('/', controller.getAll.bind(controller));

  router.get('/comparison', controller.getComparison.bind(controller));

  router.post('/:id/baseline', controller.setBaseline.bind(controller));

  return router;
};