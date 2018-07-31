// abstracts-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const abstracts = new Schema({
    id: Number,
    presentationID: Number,
    year: Number,
    k4EventNumber: Number,
    AbstractEmbargoDateTime: Date,
    AbstractEmbargoDate: String,
    authorIDs: [Number],
    authorText: String,
    abstractTitle: String,
    abstractText: String,
    abstractTextOriginal: String,
    abstractFigure: [],
    EPosterUrl: String,
    authors: [{
      id: Number,
      fullName: String,
      firstName: String,
      lastName: String,
      city: String,
      country: String,
      shortName: String
    }],
    creationDate: Date,
    lastModificationDate: Date,
  }, {
    timestamps: true
  });

  return mongooseClient.model('abstracts', abstracts);
};