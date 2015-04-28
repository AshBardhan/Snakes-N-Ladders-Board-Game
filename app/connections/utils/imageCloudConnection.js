module.exports = function (cloudinary) {
	cloudinary.config({
		cloud_name: 'dude-love',
		api_key: '377159495627157',
		api_secret: 'cmlIwyq0TaYQsTN0GNPHKvNxNuw'
	});

	/*cloudinary.uploader.upload("./public/images/avatars/avatar-1.png", function(result) {
	 console.log(result)
	 },{use_filename:true,unique_filename:false,folder:'avatars'});
	 */

	/*var acx = cloudinary.image("avatars/avatar-1.png", { alt: "Sample Image" })
	 console.log(acx);*/

//  cloudinary.api.resources(function(result)  { console.log(result) })

	/*cloudinary.api.resources(function(result){console.log(result)},
	 { type: 'upload', prefix: 'avatars/' });
	 */
};