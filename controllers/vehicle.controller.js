const {supabase} = require('../config/supabase.config');
const {sendResponse, sendErrorResponse} = require('response.js');
const{isEmpty, isNumber}=require('validate.js');

const addVehicle=async(req,res)=>{
    try{
        const {Owner_id, model, rate_per_km}=req.body;
        const passengerData=req.body.PassengerData;
        if(isEmpty(Owner_id) || isEmpty(model) || isEmpty(rate_per_km) || isEmpty(passengerData)){
            return sendErrorResponse(res, 400, 'All fields are required');
        }
        if(!isNumber(rate_per_km)){
            return sendErrorResponse(res, 400, 'Rate per km must be a number');
        }
        const ownerCheck=await supabase.from('owners').select('id,role').eq('id', Owner_id).single();
        
        if(ownerCheck.error || !ownerCheck.data){
            return sendErrorResponse(res, 404, 'Owner not found');
        }
const insertObj={
    Owner_id: Owner_id,
    model: model,
    rate_per_km: rate_per_km,
    passengerData: passengerData,
    isAvailable:true
};
const created=await supabase.from('vehicles').insert([insertObj]).select("*").single();
if(created.error || !created.data){
    return sendErrorResponse(res, 500, 'Failed to add vehicle');
}
return sendResponse(res, 201, 'Vehicle added successfully', created.data);
    }catch(error){
        return sendErrorResponse(res, 500, 'Internal server error');
    }   
};
const assignDriver=async(req,res)=>{
    try{
        const {vehicle_id, driver_id}=req.body; 
        if(isEmpty(vehicle_id) || isEmpty(driver_id)){
            return sendErrorResponse(res, 400, 'Vehicle ID and Driver ID are required');
        }   
        const driverCheck=await supabase.from('users').select('id,role').eq('id', driver_id).single();
        if(driverCheck.error ){
            return sendErrorResponse(res, 400, 'Driver not found');
        }   
        if(driverCheck.data.role !== 'driver'){
            return sendErrorResponse(res, 403, 'User is not a driver');
        }
        const updated=await supabase.from('vehicles').update({driver_id: driver_id}).eq('id', vehicle_id).select("*").single();
        if(updated.error || !updated.data){
            return sendErrorResponse(res, 500, 'Failed to assign driver to vehicle', updated.data);
        }
        catch(error){
            return sendErrorResponse(res, 500, 'Internal server error');
        }
    };
    const getVehicles=async(req,res)=>{
        try{
            const vehicleId=req.params.id;
            const result=await supabase.from('vehicles').select('*').eq('id', vehicleId).single();
            if(result.error || !result.data){
                return sendErrorResponse(res, 404, 'Vehicle not found');
            }
            return sendResponse(res, 200, 'Vehicle retrieved successfully', result.data);
        }
        catch(error){
            return sendErrorResponse(res, 500, 'Internal server error');
        }
    };
module.exports={addVehicle, assignDriver, getVehicles};