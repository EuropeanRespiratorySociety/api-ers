// preferences-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const preferences = new mongooseClient.Schema({
    layout: { type: String, required: false },
    spotmeId: { 
      type: String, 
      unique: true, 
      sparse: true
    },
    ersId: { 
      type: Number, 
      required: false,
      unique: true, 
      sparse: true
    },
    interests: {
      type: [String],
      required: false
    },
    notifications: {
      type: [String],
      required: false
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('preferences', preferences);
};
