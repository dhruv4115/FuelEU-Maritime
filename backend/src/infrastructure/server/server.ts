import express from 'express';
import { complianceService } from './dependencies';
import { ComplianceController } from '../../adapters/inbound/http/compliance.controller';
import { createComplianceRouter } from '../../adapters/inbound/http/compliance.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(express.json());

const complianceController = new ComplianceController(complianceService);

// --- Routers ---
const complianceRouter = createComplianceRouter(complianceController);
app.use('/compliance', complianceRouter);

app.get('/', (req, res) => {
  res.status(200).send('Fuel EU Maritime API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});