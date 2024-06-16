const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  // title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  fileUrl: { type: String, required: true },
  educator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Educator',
    required: true
  },
  uploader: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Educator', 
    required: true
   }
});

module.exports = mongoose.model('Resource', ResourceSchema);
