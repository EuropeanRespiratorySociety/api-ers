// presentations-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const presentations = new Schema({
    id: Number,
    sessionID: Number,
    year: Number,
    k4EventNumber: Number,
    number: Number,
    name: String,
    subtitle: String,
    startDateTime: Date,
    startTime: String,
    endDateTime: Date,
    endTime: String,
    AbstractEmbargoDateTime: Date,
    AbstractEmbargoDate: String,
    speakerIDs: [String],
    speakerText: String,
    authorID: Number,
    coauthorIDs: [Number],
    authorText: String,
    AbstractId: Number,
    Content: {
      AbstractText: String,
      abstractFigure: []
    },
    EPosterUrl: String,
    speakers: [{
      guid: String,
      fullName: String,
      firstName: String,
      lastName: String,
      city: String,
      country: String,
      shortName: String,
      ersId: Number,
      isFaculty: Boolean,
      COI: {
        COI: Boolean,
        Detail: String,
        Comments: String,
        Position: String
      }
    }],
    creationDate: Date,
    lastModificationDate: Date,
  }, {
    timestamps: true
  });

  return mongooseClient.model('presentations', presentations);
};