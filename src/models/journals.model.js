// journals-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const journals = new Schema({
    pubmed_id: { 
      type: Number, 
      unique: true, 
      sparse: true  
    },
    doi: { 
      type: String, 
      unique: true, 
      sparse: true 
    },
    volume: { type: Number },
    issue: { type: Number },
    title: { type: String },
    abstract: { type: String },
    authors: [{ type: String }],
    pdf: { type: String },
    subjects: [
      {  
        text: { type: String }, 
        url: { type: String }, 
        path: { type: String }
      }
    ],
    page_url: { type: String },
    canonical: { type: String, unique: true, sparse: true },
    journal_url: { type: String },
    article_full_url: { type: String },
    article_full_text_url: { type: String },
    article_pdf_url: { type: String },
    authors_emails: [{ type: String }],
    authors_institutions: [{
      raw: { type: String },
      country: { type: String }, 
      city: { type: String },
      address: { type: String },
      head: { type: String }
    }],
    publicatin_date: { type: Date },
    article_type: { type: String },
    publisher: { type: String },
    pisa: { type: String },
    keywords: [{ type: String }],
    short_abstract: { type: String },
    full_available_text: { type: String },
    references: [{ 
      title: { type: String },
      publication: { type: String },
      publication_location: { type: String },
      citation_source: { type: String },
      journal: { type: String },
      year: { type: Number },
      volume: { type: Number },
      page: { type: String },
      first_page: { type: Number },
      last_page: { type: Number },
      doi: { type: String },
      pubmed_id: { type: Number },
      links: { type: String },
    }],
    related_articles: [{ type: String }],
    access: { type: String },
  }, {
    timestamps: true
  });

  return mongooseClient.model('journals', journals);
};
