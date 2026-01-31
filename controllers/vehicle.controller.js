const {supabase} = require('../config/supabase.config');
const {sendResponse, sendErrorResponse} = require('../response.js');
const {isEmpty, isNumber} = require('../validate.js');

const addVehicle = async (req, res) => {
    try {
        const {owner_id, name, registration_number, allowed_passengers, rate_per_km} = req.body;
        
        if(isEmpty(owner_id) || isEmpty(name) || isEmpty(registration_number) || isEmpty(allowed_passengers) || isEmpty(rate_per_km)) {
            return sendErrorResponse(res, 400, 'All fields are required');
        }
        
        if(!isNumber(allowed_passengers) || !isNumber(rate_per_km)) {
            return sendErrorResponse(res, 400, 'Allowed passengers and rate per km must be numbers');
        }
        
        const ownerCheck = await supabase.from('users').select('id, role').eq('id', owner_id).single();
        
        if(ownerCheck.error || !ownerCheck.data) {
            return sendErrorResponse(res, 404, 'Owner not found');
        }
        
        if(ownerCheck.data.role !== 'owner') {
            return sendErrorResponse(res, 403, 'User is not an owner');
        }
        
        const vehicleObj = {
            owner_id: owner_id,
            name: name,
            registration_number: registration_number,
            allowed_passengers: parseInt(allowed_passengers),
            rate_per_km: parseFloat(rate_per_km),
            isAvailable: true,
            created_at: new Date().toISOString()
        };
        
        const created = await supabase.from('vehicles').insert([vehicleObj]).select('*').single();
        
        if(created.error || !created.data) {
            return sendErrorResponse(res, 500, 'Failed to add vehicle');
        }
        
        return sendResponse(res, 201, 'Vehicle added successfully', created.data);
    } catch(error) {
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};

const assignDriver = async (req, res) => {
    try {
        const {vehicleId} = req.params;
        const {driver_id} = req.body;
        
        if(isEmpty(vehicleId) || isEmpty(driver_id)) {
            return sendErrorResponse(res, 400, 'Vehicle ID and Driver ID are required');
        }
        
        const driverCheck = await supabase.from('users').select('id, role').eq('id', driver_id).single();
        
        if(driverCheck.error || !driverCheck.data) {
            return sendErrorResponse(res, 404, 'Driver not found');
        }
        
        if(driverCheck.data.role !== 'driver') {
            return sendErrorResponse(res, 403, 'User is not a driver');
        }
        
        const updated = await supabase.from('vehicles').update({driver_id: driver_id}).eq('id', vehicleId).select('*').single();
        
        if(updated.error || !updated.data) {
            return sendErrorResponse(res, 500, 'Failed to assign driver to vehicle');
        }
        
        return sendResponse(res, 200, 'Driver assigned successfully', updated.data);
    } catch(error) {
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};

const getVehicle = async (req, res) => {
    try {
        const {vehicleId} = req.params;
        
        if(isEmpty(vehicleId)) {
            return sendErrorResponse(res, 400, 'Vehicle ID is required');
        }
        
        const result = await supabase.from('vehicles').select('*').eq('id', vehicleId).single();
        
        if(result.error || !result.data) {
            return sendErrorResponse(res, 404, 'Vehicle not found');
        }
        
        return sendResponse(res, 200, 'Vehicle retrieved successfully', result.data);
    } catch(error) {
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};

module.exports = {addVehicle, assignDriver, getVehicle};