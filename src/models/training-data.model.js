// training-data-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const trainingData = new mongooseClient.Schema({
    text: { type: String, required: true },
    classifiers: [
      {
        diseases: [String],
        methods: [String],
        version: String
      }
    ],
    source: {
      type: String, required: true
    },
    doi: String,
    _doc: String,
    reviewers: [
      {
        ersId: Number,
        disease: [String],
        methods: [String]
      }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('trainingData', trainingData);
};
