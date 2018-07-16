// training-data-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const trainingData = new mongooseClient.Schema({
    text: { type: String, required: true },
    originalText: { type: String, required: true },
    classifiers: [
      {
        diseases: [String],
        methods: [String],
        predictions:[
          {
            label: String,
            probability: Number,
            _id: false
          }
        ],
        version: String,
        classifiedOn: { type: Date, default: Date.now },
        _id: false
      }
    ],
    source: {
      type: String, required: true
    },
    categories: [String],
    doi: { type: String, unique: true, sparse:true },
    _doc: { type: String, unique: true, sparse:true },
    slug: { type: String, unique: true, sparse:true },
    reviewers: [
      {
        ersId: Number,
        diseases: [String],
        methods: [String],
        reviewedOn: { type: Date, default: Date.now },
        _id: false
      }
    ],
    skippedBy: [Number],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('trainingData', trainingData);
};