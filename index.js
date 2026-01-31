const express = require('express');
require('dotenv').config();
const loggerMiddleware = require('./middleware/logger.middleware');
const notFound = require('./middleware/notfound.middleware').default;

const userRoutes = require('./routes/user.routes');
const tripRoutes = require('./routes/trip.routes');
const vehicleRoutes = require('./routes/vehicles.rouutes');
const analytRoutes = require('./routes/analyt.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);

app.use('/users', userRoutes);
app.use('/trips', tripRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/analytics', analytRoutes);

app.use(notFound);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});