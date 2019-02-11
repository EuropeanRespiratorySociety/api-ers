// const chai = require('chai');
// const TurndownService = require('turndown');
// const expect = chai.expect;



// describe('\'markdown\' helper', () => {
//   it('Test convert rich text to markdown', () => {
//     var turndownService = new TurndownService();
//     const jsonInput = {
//       test1: '<p>• Shortness of breath + cough + fever<br />\n<strong>One day prior: </strong><br />\n• Haemoptysis, fever, pleuritic chest pain<br />\n• Shortness of breath, no response to inhalers</p>\n',
//       test2: '<p>1-&nbsp;Petrarca L, Midulla F, Openshaw PJ. Vaccination policies in Europe:&nbsp;<a href="https://onlinelibrary.wiley.com/doi/full/10.1002/eji.201870015" target="_blank" data-mce-href="https://onlinelibrary.wiley.com/doi/full/10.1002/eji.201870015">Common goals, diverse approaches and public doubts</a>. Eur J Immunol 2018; 48: 10-12</p><p>2- Fraser CS, Jha A, Openshaw PJ.&nbsp;<a href="https://www.ncbi.nlm.nih.gov/pubmed/28159157" target="_blank" data-mce-href="https://www.ncbi.nlm.nih.gov/pubmed/28159157">Vaccines in the Prevention of Viral Pneumonia</a>. Clin Chest Med 2017; 38: 155-169.<br><br>3- Schwarze J, Openshaw P, Jha A, Del Giacco SR, Firinu D, Tsilochristou O, Roberts G, Selby A, Akdis C, Agache I, Custovic A, Heffler E, Pinna G, Khaitov M, Nikonova A, Papadopoulos N, Akhlaq A, Nurmatov U, Renz H, Sheikh A, Skevaki C<a href="https://onlinelibrary.wiley.com/doi/full/10.1111/all.13333" target="_blank" data-mce-href="https://onlinelibrary.wiley.com/doi/full/10.1111/all.13333">. Influenza burden, prevention, and treatment in asthma-A scoping review by the EAACI Influenza in asthma task force</a>.Allergy. 2018 Jun;73(6):1151-1181.&nbsp;</p><p>4-&nbsp;Drijkoningen JJ, Rohde GG.&nbsp;<a href="https://www.clinicalmicrobiologyandinfection.com/article/S1198-743X(14)60175-0/fulltext" data-mce-href="https://www.clinicalmicrobiologyandinfection.com/article/S1198-743X(14)60175-0/fulltext">Pneumococcal infection in adults: burden of disease</a>. Clin Microbiol Infect. 2014 May;20 Suppl 5:45-5.<a href="https://www.das.uk.com/guidelines/das_intubation_guidelines" target="_blank" data-mce-href="https://www.das.uk.com/guidelines/das_intubation_guidelines"></a></p><p>5- Openshaw P, Gernot G.U. Rohde.&nbsp;<a href="https://respipedia.ers-education.org/article/article/?idTopic=219" target="_blank" data-mce-href="https://respipedia.ers-education.org/article/article/?idTopic=219">Pneumococcal and influenza vaccination. Respipedia</a>, the respiratory wiki. 24.04.2018 09:57. Accessed: 17.10.2018 12:22.</p><p>6-&nbsp;Bellinghausen C, Rohde GGU, Savelkoul PHM, Wouters EFM, Stassen FRM.&nbsp;<a href="http://jgv.microbiologyresearch.org/content/journal/jgv/10.1099/jgv.0.000627#tab2" target="_blank" data-mce-href="http://jgv.microbiologyresearch.org/content/journal/jgv/10.1099/jgv.0.000627#tab2">Viral-bacterial interactions in the respiratory tract</a>. J Gen Virol. 2016 Dec;97(12):3089-3102.&nbsp;</p>'
//     };
//     const jsonOutputTest1 = turndownService.turndown(jsonInput.test1);
//     const jsonOutputTest2 = turndownService.turndown(jsonInput.test2);

//     console.log(jsonOutputTest1);
//     console.log(jsonOutputTest2);
//   });
// });
