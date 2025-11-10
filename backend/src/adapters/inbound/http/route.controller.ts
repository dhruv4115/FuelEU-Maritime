import { Request, Response } from 'express';
import { RouteService } from '../../../core/application/route.service';

export class RouteController {
  constructor(private routeService: RouteService) {}

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const routes = await this.routeService.getAllRoutes();
      res.status(200).json(routes);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public setBaseline = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const routeId = parseInt(id);

      if (isNaN(routeId)) {
        res.status(400).json({ error: 'Invalid route ID' });
        return;
      }

      const updatedRoute = await this.routeService.setBaseline(routeId);
      res.status(200).json(updatedRoute);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public getComparison = async (req: Request, res: Response): Promise<void> => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : 2025;

      if (isNaN(year)) {
        res.status(400).json({ error: 'Invalid year query parameter' });
        return;
      }
      
      const comparisonData = await this.routeService.getComparison(year);
      res.status(200).json(comparisonData);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}