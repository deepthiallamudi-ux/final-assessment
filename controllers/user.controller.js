const {supabase} = require('../config/supabase.config');
const {sendResponse, sendErrorResponse} = require('../response.js');
const {isEmpty} = require('../validate.js');

const signup = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        
        if(isEmpty(name) || isEmpty(email) || isEmpty(password) || isEmpty(role)) {
            return sendErrorResponse(res, 400, 'All fields are required');
        }
        
        const validRoles = ['customer', 'owner', 'driver'];
        if(!validRoles.includes(role)) {
            return sendErrorResponse(res, 400, 'Invalid role. Must be customer, owner, or driver');
        }
        
        const emailCheck = await supabase.from('users').select('email').eq('email', email).single();
        
        if(emailCheck.data) {
            return sendErrorResponse(res, 400, 'Email already exists');
        }
        
        const userObj = {
            name: name,
            email: email,
            password: password,
            role: role,
            created_at: new Date().toISOString()
        };
        
        const created = await supabase.from('users').insert([userObj]).select('*').single();
        
        if(created.error || !created.data) {
            return sendErrorResponse(res, 500, 'Failed to create user');
        }
        
        return sendResponse(res, 201, 'User created successfully', created.data);
    } catch(error) {
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};

module.exports = {signup};
