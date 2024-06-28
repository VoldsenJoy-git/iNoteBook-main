const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Joydeep@cse';
const fetchuser = (req,res,next) =>   // it calls next after the fetchuser function (auth.js line 103 )
{
    //Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if(!token)
    {
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
    try
    {
        const data  = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    }
    catch(error)
    {
        res.status(401).send({error:"Please authenticate using a validd token"});
    }
}
module.exports = fetchuser;