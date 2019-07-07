var mongoose    =   require('mongoose');
var Schema      =   mongoose.Schema;
var bcrypt 			=	require('bcrypt-nodejs');
var titlize 		=	require('mongoose-title-case');

var UserSchema = new Schema({
    name:{ type: String , required : true},
    email: { type: String, required: true , unique: true},
    password:{ type: String , required : true},
    mobile:{ type: String , requied:true , unique: true},
	teachers: { type: Array , default: []},
	isPhotoUploaded : { type: Boolean , default : false},
	profileImage : { type: String , default: "assets/images/userProfileImages/default.jpg" }

});

UserSchema.plugin(titlize,{
	paths:['name']
});

UserSchema.pre('save',function(next){
	var user=this;
	bcrypt.hash(user.password,null,null,function(err,hash){
		if(err) return next(err);
		user.password=hash;
		next();

	});
});

UserSchema.methods.comparePassword=function(password){
	return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User',UserSchema);