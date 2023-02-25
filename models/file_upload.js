const mongoose = require('mongoose');
const detail_with_image = mongoose.Schema({
      name: {
            type: String,
      },
     user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
     },
      status: {
            type: String,
            enum: ['pending', 'reviewed'],
            default : 'pending'
      },
      file_name: {
            type: String,
      },
      avatar: {
            type: String,

      }


})
module.exports = mongoose.model('detail_with_image', detail_with_image);