const {supabase} = require('../config/supabase.config');
const {sendResponse, sendErrorResponse} = require('../response.js');

const getAnalytics = async (req, res) => {
    try {
        const customersResult = await supabase.from('users').select('id', {count: 'exact', head: true}).eq('role', 'customer');
        const ownersResult = await supabase.from('users').select('id', {count: 'exact', head: true}).eq('role', 'owner');
        const driversResult = await supabase.from('users').select('id', {count: 'exact', head: true}).eq('role', 'driver');
        const vehiclesResult = await supabase.from('vehicles').select('id', {count: 'exact', head: true});
        const tripsResult = await supabase.from('trips').select('id', {count: 'exact', head: true});
        
        const analytics = {
            totalCustomers: customersResult.count || 0,
            totalOwners: ownersResult.count || 0,
            totalDrivers: driversResult.count || 0,
            totalVehicles: vehiclesResult.count || 0,
            totalTrips: tripsResult.count || 0
        };
        
        return sendResponse(res, 200, 'Analytics retrieved successfully', analytics);
    } catch(error) {
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};

module.exports = {getAnalytics};