const {supabase} = require('../config/supabase.config');
const {sendResponse, sendErrorResponse} = require('../response.js');
const {isEmpty, isNumber} = require('../validate.js');

const createTrip = async (req, res) => {
    try {
        const {customer_id, vehicle_id, start_date, location, distance_km, passengers} = req.body;
        
        if(isEmpty(customer_id) || isEmpty(vehicle_id) || isEmpty(start_date) || isEmpty(location) || isEmpty(distance_km) || isEmpty(passengers)) {
            return sendErrorResponse(res, 400, 'All fields are required');
        }
        
        if(!isNumber(distance_km) || !isNumber(passengers)) {
            return sendErrorResponse(res, 400, 'Distance and passengers must be numbers');
        }
        
        const vehicleCheck = await supabase.from('vehicles').select('id, allowed_passengers, isAvailable, rate_per_km').eq('id', vehicle_id).single();
        
        if(vehicleCheck.error || !vehicleCheck.data) {
            return sendErrorResponse(res, 404, 'Vehicle not found');
        }
        
        if(!vehicleCheck.data.isAvailable) {
            return sendErrorResponse(res, 400, 'Vehicle is not available');
        }
        
        if(parseInt(passengers) > vehicleCheck.data.allowed_passengers) {
            return sendErrorResponse(res, 400, 'Passengers exceed vehicle capacity');
        }
        
        const tripObj = {
            customer_id: customer_id,
            vehicle_id: vehicle_id,
            start_date: start_date,
            location: location,
            distance_km: parseFloat(distance_km),
            passengers: parseInt(passengers),
            tripCost: 0,
            isCompleted: false,
            created_at: new Date().toISOString()
        };
        
        const created = await supabase.from('trips').insert([tripObj]).select('*').single();
        
        if(created.error || !created.data) {
            return sendErrorResponse(res, 500, 'Failed to create trip');
        }
        
        await supabase.from('vehicles').update({isAvailable: false}).eq('id', vehicle_id);
        
        return sendResponse(res, 201, 'Trip created successfully', created.data);
    } catch(error) {
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};

const updateTrip = async (req, res) => {
    try {
        const {tripId} = req.params;
        const {start_date, location, distance_km, passengers} = req.body;
        
        if(isEmpty(tripId)) {
            return sendErrorResponse(res, 400, 'Trip ID is required');
        }
        
        const tripCheck = await supabase.from('trips').select('id, vehicle_id, isCompleted').eq('id', tripId).single();
        
        if(tripCheck.error || !tripCheck.data) {
            return sendErrorResponse(res, 404, 'Trip not found');
        }
        
        if(tripCheck.data.isCompleted) {
            return sendErrorResponse(res, 400, 'Cannot update completed trip');
        }
        
        const updateObj = {};
        if(start_date) updateObj.start_date = start_date;
        if(location) updateObj.location = location;
        if(distance_km) {
            if(!isNumber(distance_km)) {
                return sendErrorResponse(res, 400, 'Distance must be a number');
            }
            updateObj.distance_km = parseFloat(distance_km);
        }
        if(passengers) {
            if(!isNumber(passengers)) {
                return sendErrorResponse(res, 400, 'Passengers must be a number');
            }
            const vehicleCheck = await supabase.from('vehicles').select('allowed_passengers').eq('id', tripCheck.data.vehicle_id).single();
            if(parseInt(passengers) > vehicleCheck.data.allowed_passengers) {
                return sendErrorResponse(res, 400, 'Passengers exceed vehicle capacity');
            }
            updateObj.passengers = parseInt(passengers);
        }
        
        const updated = await supabase.from('trips').update(updateObj).eq('id', tripId).select('*').single();
        
        if(updated.error || !updated.data) {
            return sendErrorResponse(res, 500, 'Failed to update trip');
        }
        
        return sendResponse(res, 200, 'Trip updated successfully', updated.data);
    } catch(error) {
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};

const getTrip = async (req, res) => {
    try {
        const {tripId} = req.params;
        
        if(isEmpty(tripId)) {
            return sendErrorResponse(res, 400, 'Trip ID is required');
        }
        
        const result = await supabase.from('trips').select('*').eq('id', tripId).single();
        
        if(result.error || !result.data) {
            return sendErrorResponse(res, 404, 'Trip not found');
        }
        
        return sendResponse(res, 200, 'Trip retrieved successfully', result.data);
    } catch(error) {
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};

const deleteTrip = async (req, res) => {
    try {
        const {tripId} = req.params;
        
        if(isEmpty(tripId)) {
            return sendErrorResponse(res, 400, 'Trip ID is required');
        }
        
        const tripCheck = await supabase.from('trips').select('id, vehicle_id, isCompleted').eq('id', tripId).single();
        
        if(tripCheck.error || !tripCheck.data) {
            return sendErrorResponse(res, 404, 'Trip not found');
        }
        
        const deleted = await supabase.from('trips').delete().eq('id', tripId);
        
        if(deleted.error) {
            return sendErrorResponse(res, 500, 'Failed to delete trip');
        }
        
        if(!tripCheck.data.isCompleted) {
            await supabase.from('vehicles').update({isAvailable: true}).eq('id', tripCheck.data.vehicle_id);
        }
        
        return sendResponse(res, 200, 'Trip deleted successfully', {id: tripId});
    } catch(error) {
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};

const endTrip = async (req, res) => {
    try {
        const {tripId} = req.params;
        
        if(isEmpty(tripId)) {
            return sendErrorResponse(res, 400, 'Trip ID is required');
        }
        
        const tripCheck = await supabase.from('trips').select('id, vehicle_id, distance_km, isCompleted').eq('id', tripId).single();
        
        if(tripCheck.error || !tripCheck.data) {
            return sendErrorResponse(res, 404, 'Trip not found');
        }
        
        if(tripCheck.data.isCompleted) {
            return sendErrorResponse(res, 400, 'Trip already completed');
        }
        
        const vehicleCheck = await supabase.from('vehicles').select('rate_per_km').eq('id', tripCheck.data.vehicle_id).single();
        
        if(vehicleCheck.error || !vehicleCheck.data) {
            return sendErrorResponse(res, 404, 'Vehicle not found');
        }
        
        const tripCost = tripCheck.data.distance_km * vehicleCheck.data.rate_per_km;
        
        const updated = await supabase.from('trips').update({
            isCompleted: true,
            tripCost: tripCost,
            end_date: new Date().toISOString()
        }).eq('id', tripId).select('*').single();
        
        if(updated.error || !updated.data) {
            return sendErrorResponse(res, 500, 'Failed to end trip');
        }
        
        await supabase.from('vehicles').update({isAvailable: true}).eq('id', tripCheck.data.vehicle_id);
        
        return sendResponse(res, 200, 'Trip ended successfully', updated.data);
    } catch(error) {
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};

module.exports = {createTrip, updateTrip, getTrip, deleteTrip, endTrip};