import express from 'express';
import { complianceService, routeService } from './dependencies';
import { ComplianceController } from '../../adapters/inbound/http/compliance.controller';
import { createComplianceRouter } from '../../adapters/inbound/http/compliance.routes';
import { RouteController } from '../../adapters/inbound/http/route.controller';
import { createRouteRouter } from '../../adapters/inbound/http/route.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(express.json());

const complianceController = new ComplianceController(complianceService);
const routeController = new RouteController(routeService);

// --- Routers ---
const complianceRouter = createComplianceRouter(complianceController);
const routeRouter = createRouteRouter(routeController);

app.use('/compliance', complianceRouter);
app.use('/routes', routeRouter);


app.get('/', (req, res) => {
  res.status(200).send('Fuel EU Maritime API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});