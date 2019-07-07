var express     =   require('express');
var router      =   express.Router();
var User        =   require('../models/usersSchema');
var jwt 	    =   require('jsonwebtoken');
var multer      =   require('multer');
var secret      =   "RockabyebabyRockabye";





router.post('/upload',function(req,res){
    var uploadedFilename = '';
 
    var storage= multer.diskStorage({
    
        destination: function (req, file, cb) {
          cb(null, 'public/assets/images/userProfileImages');
        },
        filename : function(req,file,cb){
            var filetype = '';
            if(file.mimetype === 'image/gif') {
              filetype = 'gif';
            }
            if(file.mimetype === 'image/png') {
              filetype = 'png';
            }
            if(file.mimetype === 'image/jpeg') {
              filetype = 'jpg';
            }
            uploadedFilename = 'assets/images/userProfileImages/'+ file.originalname;
            cb(null, file.originalname);
    }
        
    });
    
     

    var upload = multer({ storage: storage }).single('imguploader');


    upload(req,res,function(err){
        var token = req.body.token;
        console.log(token);
        if(err){

            res.json({
                success : false,
                data : err
            });

        }else{

            jwt.verify(token,secret,function(err,decoded){
                if(err){
                    res.json({
                        success : false,
                        message : 'Error in uploading'
                    })
                }   
                else{
                    var userDetails = decoded;
                    User.update(
                        {email : userDetails.email},
                    {$set:{'profileImage':uploadedFilename}},
                    {upsert : true}).exec(function(err){
                        if(err){
                            res.json({
                                success : false,
                                message : 'Error while uploading',
                                data : err
                            });
                        }else{
                            res.json({
                                success : true,
                                message : 'Profile Photo uploaded succesfully'
                            })
                        }
                    })
                    
                }
            });
            
        }
    });
});



router.post('/register',function(req,res){
    var user = new User();
    if(req.body.name=='' || req.body.email=='' || req.body.password=='' || req.body.mobile=='' || req.body.name==null || req.body.email==null || req.body.password==null || req.body.mobile==null){
        res.json({ 
            success : false,
            message: 'Ensure all fields are filled'
        });
    }
    else{
        user.name=req.body.name;
        user.email=req.body.email;
        user.password=req.body.password;
        user.mobile=req.body.mobile;
        user.save(function(err){
            if(err){
                res.json({
                    success : false,
                    message : err
                });
            }
            else{
                res.json({
                    success : true,
                    message : 'Account is succesfully created!' 
                });
                
            }
        })
    }
})
router.post('/authenticate',function(req,res){
    
    User.findOne({ email  : req.body.email }).select('name email password mobile isPhotoUploaded profileImage').exec(function(err,user){
        if(err){
            res.json({
                success : false,
                message : "Uh-oh, Some error!" 
            })
        }
        else if(!user){
            res.json({
                success : false,
                message : "No user found!"
            })
        }
        else if(user){

            if(req.body.password!=null){
                var valid =user.comparePassword(req.body.password);
                if(valid){
                    var token=jwt.sign({name: user.name , email: user.email , mobile: user.mobile , password: user.password },secret,{expiresIn:'240000h'});
                    res.json({
                        success : true,
                        message: "User found!",
                        data : user,
                        token : token
                    })
                }
                else{
                    res.json({
                        success : true,
                        message : "Please enter the correct password!"
                    })
                }
            }
            else{
                res.json({
                    success : true,
                    message : "Please provide the password!"
                })
            }
            
        }
    })
})

/*router.use(function(req,res,next){
    var token=req.body.token || req.body.query || req.headers['x-access-token'];

    if(token){
        jwt.verify(token,secret,function(err,decoded){
            if(err){
                res.json({success: false , message: 'Invalid token'});
            }
            else{
                req.decoded=decoded;
                next();
            }
        });
    }else{
        res.json({success:false,message:'Please provide a token'});
    }
});
*/


router.post('/me',function(req,res){
    var token = req.body.token;
    if(token){
        jwt.verify(token,secret,function(err,decoded){
            if(err){
                res.json({success: false , message: 'Invalid token'});
            }
            else{
                var userDetails = decoded;
                User.findOne({ email  : userDetails.email }).select('name email password mobile isPhotoUploaded profileImage').exec(function(err,user){
                    if(user){
                        res.json({
                            success : true,
                            data : user
                        })
                    }
                });
                
            }
        });
    }else{
        res.json({success:false,message:'Please provide a token'});
    }
});

module.exports = router;