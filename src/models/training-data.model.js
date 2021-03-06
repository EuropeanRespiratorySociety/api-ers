// training-data-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const trainingData = new mongooseClient.Schema({
    text: { type: String, required: true },
    originalText: { type: String, required: true },
    title: { type: String, required: true },
    classifiers: [
      {
        diseases: [String],
        methods: [String],
        predictions: [
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
    categories: [
      {
        id: String,
        title: String
      }
    ],
    doi: { type: String, unique: true, sparse: true },
    _doc: { type: String, unique: true, sparse: true },
    _journal: { type: String },
    slug: { type: String },
    contentReviewers: [
      {
        ersId: Number,
        diseases: [String],
        methods: [String],
        reviewingType: String,
        reviewedOn: { type: Date, default: Date.now },
        _id: false
      }
    ],
    titleReviewers: [
      {
        ersId: Number,
        diseases: [String],
        methods: [String],
        reviewingType: String,
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
