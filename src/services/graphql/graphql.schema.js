
const typeDefinitions = `

type User {
  _id: String # the ! means that every author object _must_ have an id
  email: String
  permissions: String
}

type AuthPayload {
  accessToken: String # JSON Web Token
  data: User
}

type Flag {
  text: String, 
  color: String 
}

type Category {
  id: String,
  ref: String,
  title: String,
  qname: String,
  typeQName: String
}

type FeeList { 
  junior: Int, 
  ersMember: Int, 
  nonErsMember: Int, 
  industry: Int 
}

type Sponsor { 
  text: String, 
  image: String 
}

type Deadlines { 
  applicationDeadline: String, 
  applicationDeadline2: String, 
  notification: String, 
  notification2: String, 
  startDate: String, 
  startDate2: String 
}

type Venue { 
  name: String, 
  url: String, 
  streetAddress: String, 
  streetAddress2: String, 
  streetAddress3: String, 
  city: String, 
  postalCode: String, 
  country: String, 
  phoneNumber: String, 
  info: String 
}

type Submission { 
  text: String, 
  deadline: String, 
  notificationOfResults: String, 
  applyButtonUrl: String 
}

type Calendar {
  year: Int,
  month: String,
  timestamp: Int
}

type Location {
  lat: String, 
  long: String 
}

type Link {
  link: String,
  text: String
}

type Article {
    title: String,
    subTitle: String,
    slug: String,
    tags: String,
    contentType: String,
    type: String,
    typeColor: String,
    flags: [Flag],
    eventLocation: String,
    leadParagraph: String,
    shortLead: String,
    body: String,
    articleOneColumn: Boolean,
    doNotDisplayCreatedOn: Boolean,
    doNotDisplayCreatedOnOnHomepage: Boolean,
    comments: String,
    image: String,
    imageDescription: String,
    itemImageAlignment: String,
    itemImageBackgroundSize: String,
    imageSize: String,
    highResImage: String,
    highResImageDescription: String,
    imageAlignment: String,
    video: String,
    author: String,
    category: Category,
    category2: [Category],
    related: String,
    deadline: String,
    earlyDeadline: String,
    extendedDeadline: String,
    openingDate: String,
    programme: String,
    programmeButtonText: String,
    programmeNotice: String,
    practicalInfo: String,
    practicalInfoButton: String,
    technicalInfo: String,
    popUp: String,
    popUpText: String,
    feeList: FeeList,
    cancellationPolicy: String,
    travelInfo: String,
    organisers: String,
    faculty: String,
    sponsors: [Sponsor],
    sponsorsAlliances: [Sponsor],
    documents: String,
    disclosure: String,
    rulesAndRegulations: String,
    deadlines: Deadlines
    venue: Venue,
    ebusVenues: [Venue],
    suggestedAccommodation: [Venue],
    registerButton: Link,
    bursaryApplication: Submission,
    mentorship: Submission,
    abstracts: Submission,
    eventDate: String,
    ebusDate: String,
    eventEndDate: String,
    eventDates: String,
    eventLocation: String,
    fullyBooked: String,
    ms:  Int,
    url: String,
    uri: String,
    availableOnHomepage: String,
    mainNews: Boolean,
    featuredCourse: Boolean,
    featuredFunding: Boolean,
    featuredCalendarItem: Boolean,
    nonErsCalendarItem: Boolean,
    ersEndorsedEvent: Boolean,
    ersDeadline: Boolean,
    fullyBooked: Boolean,
    displayOrder: Int,
    loc: Location,
    startDateTimestamp: String,
    startDate: String,
    endDate: String,
    createdOn: String,
    modifiedOn: String,
    calendar: Calendar,
    shortLead:  String,
    hasRelatedArticles: Boolean,
    hasAuthor: Boolean,
    salutation: String,
    firstName: String,
    lastName: String,
    unPublished: Boolean,
    #_system: false,
    #_qname: false,
    #_statistics: false

}

type Contact {
    ContactId: Int,
    Adonix: Int,
    Title: String,
    LastName: String,
    FirstName: String,
    MainCountryCode: String,
    MainCity: String,
    BirthDate: String,
    Gender: String,
    SmtpAddress1: String,
    SmtpAddress2: String,
    PortalUsername: String,
    MainStreet1: String,
    MainPostalCode: String,
    MainCity: String,
    MainCountryCode: String,
    MbshipStatus: String,
    AssemblyGroup1: Float,
    AssemblyGroup2: Float,
    AssemblyGroup3: Float,
    ProfessionalCategoryId: Int,
    WorkPlaceId: Int,
    InfosByEmail: Boolean,
    IsErsStaff: Boolean,
    ActiveCat: String,
    CreationDate: String,
    CreatedBy: String,
    TitledName: String,
    FullNameAndId: String
}

# the schema allows the following queries:
type RootQuery {
  user(_id: String!): User
  users: [User]
#  contacts(pattern: String!): [Contact]
#  contact(contactId: Int!): Contact
  relatives(qname: String!, full: Boolean): [Article]
  news(full: Boolean, sortDirection: Int, sorBy: String, limit: Int, skip: Int): [Article]
#  calendar(type: String, full: Boolean, limit: Int, skip: Int): Events
  courses(full: Boolean, limit: Int, skip: Int): [Article]
  respiratoryMatters(full: Boolean, limit: Int, skip: Int): [Article]
  respiratoryWorldWide(full: Boolean, limit: Int, skip: Int): [Article]
  article(slug: String!) : Article
}

# this schema allows the following mutations:
type RootMutation {
  # signUp (
  #  username: String!
  #  password: String!
  #  firstName: String
  #  lastName: String
  # ): User

  logIn (
    email: String!
    password: String!
    strategy: String!
  ): AuthPayload

  # createArticle (
  #  post: postInput
  # ): Article

}

# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: RootQuery
  mutation: RootMutation
}
`;

module.exports = [typeDefinitions];