const express=require('express');
const User = require('../models/User')
const router = express.Router(); 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'Divyanshuisagoodb$oy';

//ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser',[
    body('name','Enter a Valid name').isLength({ min: 3 }),
    body('email','Enter valid email').isEmail(),
    body('password','Must be 5 characters').isLength({ min: 5 }),
],
async (req,res)=>{
    let success=false;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    
    // check whether the user with this email exists already
    try {
        
        let user =await User.findOne({email: req.body.email})
        if(user)
        {
            return res.status(400).json({success,error:"Sorry a user with this email already exists"})
        }
        const salt =await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password,salt);
        
        // Creating a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });
        
        const data={
            user:{
                id: user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        success=true
        res.json({success,authToken});
        
    } 
    catch (error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error ')        
    }
})

//ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login',[
    body('email','Enter valid email').isEmail(),
    body('password','Password cannot be blanked').exists(),
],
async (req,res)=>{
    let success=false;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const {email,password} = req.body;
    try 
    {
        let user =await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({success,error:"Please try to login with correct Credentials"})
        }    
        const passwordCompare =await bcrypt.compare(password,user.password);
        if(!passwordCompare)
        {
            return res.status(400).json({success,error:"Please try to login with correct Credentials"})
        }
        
        const data={
            user:{
                id: user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authToken});
    } 
    catch (error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error ')        
    }
    
})

//ROUTE 3: Get logged in user details using: POST "/api/auth/getuser". login required
router.post('/getuser',fetchuser,async (req,res)=>
{
    try 
    {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user)
    } 
    catch (error) 
    {
        console.error(error.message)
        res.status(500).send('Internal Server Error ')        
    }
})
module.exports = router