import { Request, Response } from 'express';
import { ComplianceService } from '../../../core/application/compliance.service';

export class ComplianceController {
  constructor(private complianceService: ComplianceService) {}

  public getCB = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        res.status(400).json({ error: 'Missing required query parameters: shipId and year' });
        return;
      }

      const shipIdNum = parseInt(shipId as string);
      const yearNum = parseInt(year as string);

      if (isNaN(shipIdNum) || isNaN(yearNum)) {
        res.status(400).json({ error: 'shipId and year must be valid numbers' });
        return;
      }

      const complianceRecord = await this.complianceService.computeAndStoreCB(
        shipIdNum,
        yearNum
      );

      res.status(200).json(complianceRecord);

    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
  
}