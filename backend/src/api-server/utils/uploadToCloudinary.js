const streamifier = require("streamifier");

const {cloudinary} = require("./cloudinary");

function uploadToCloudinary(buffer, folder = 'incident_photos'){
    return new Promise((resolve, object) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
            },
            (error,result) => {
                if(result){
                    resolve(result);
                }else{
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    })
}

module.exports = {uploadToCloudinary};