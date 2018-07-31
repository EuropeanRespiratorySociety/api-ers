// sessions-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const sessions = new Schema({
    id: Number,
    year: Number,
    k4EventNumber: Number,
    number: Number,
    name: String,
    subtitle: String,
    startDateTime: Date,
    startTime: String,
    endDateTime: Date,
    endTime: String,
    aims: String,
    audience: String,
    price: String,
    roomID: Number,
    chairText: String,
    chairIDs: [String],
    participantIDs: [String],
    nationalSociety: String,
    organizer: String,
    institutionIDs: Array,
    typeID: Number,
    targetaudienceIDs: [Number],
    tagIDs: [Number],
    trackIDs: [Number],
    methodIDs: [Number],
    assemblyIDs: [Number],
    assemblygroupIDs: [Number],
    creationDate: Date,
    lastModificationDate: Date,
    votingURL: String,
    type: {
      id: Number,
      name: String
    },
    private: Boolean,
    participants: [
      {
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
      }
    ],
    chairs: [{
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
    room: [{
      id: Number,
      name: String
    }],
    tags: [{
      id: Number,
      name: String
    }],
    tracks: [{
      id: Number,
      name: String
    }],
    methods: [{
      id: Number,
      name: String
    }],
    assemblies: [{
      id: Number,
      name: String
    }],
    groups: [{
      id: Number,
      name: String,
      assemblyID: Number,
      assembly: {
        id: Number,
        name: String
      }
    }],
    institutions: Array,
    targets: [{
      id: Number,
      name: String
    }]
  }, {
    timestamps: true
  });

  return mongooseClient.model('sessions', sessions);
};
