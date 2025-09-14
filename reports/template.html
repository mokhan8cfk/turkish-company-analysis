// Google Apps Script Integration for Turkish Company Analysis Platform
// This file contains the server-side logic for report generation

function doGet(e) {
  const action = e.parameter.action;
  const companyId = e.parameter.companyId;
  
  switch(action) {
    case 'getCompany':
      return getCompanyData(companyId);
    case 'generateReport':
      return generateCompanyReport(companyId);
    default:
      return ContentService.createTextOutput('Invalid action');
  }
}

function getCompanyData(companyId) {
  // Load company data from your database
  const companies = getCompaniesDatabase();
  const company = companies.find(c => c.id == companyId);
  
  if (!company) {
    return ContentService.createTextOutput('Company not found').setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify(company)).setMimeType(ContentService.MimeType.JSON);
}

function generateCompanyReport(companyId) {
  const company = getCompanyData(companyId);
  
  if (!company) {
    return ContentService.createTextOutput('Company not found');
  }
  
  const reportHtml = createReportHTML(company);
  return HtmlService.createHtmlOutput(reportHtml);
}

function createReportHTML(company) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Vector Assessment Report - ${company.name}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { background: linear-gradient(135deg, #1e40af, #0ea5e9); color: white; padding: 2rem; text-align: center; }
            .metric { margin: 20px 0; padding: 15px; border-left: 4px solid #1e40af; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Vector Intelligence Analysis</h1>
            <h2>${company.name}</h2>
            <p>Strategic Assessment Report</p>
        </div>
        
        <div class="metric">
            <h3>Company Overview</h3>
            <p>Industry: ${company.industry}</p>
            <p>Revenue: $${company.revenue}M USD</p>
            <p>Employees: ${company.employees?.toLocaleString()}</p>
            <p>Overall Score: ${company.overall_score}%</p>
            <p>Alpha Opportunity: ${company.alpha_opportunity}%</p>
        </div>
        
        <div class="metric">
            <h3>Vector Performance Analysis</h3>
            <p>Strategic Direction: ${company.vector_scores?.strategic || 'N/A'}/5</p>
            <p>Operational Excellence: ${company.vector_scores?.operational || 'N/A'}/5</p>
            <p>Financial Optimization: ${company.vector_scores?.financial || 'N/A'}/5</p>
            <p>Technology & Innovation: ${company.vector_scores?.technology || 'N/A'}/5</p>
            <p>Risk Management: ${company.vector_scores?.risk || 'N/A'}/5</p>
            <p>Exit Readiness: ${company.vector_scores?.exit || 'N/A'}/5</p>
        </div>
        
        <div class="metric">
            <h3>Strategic Recommendations</h3>
            <p>Based on the Vector Framework assessment, we recommend focusing on operational excellence and technology adoption to capture the identified ${company.alpha_opportunity}% alpha opportunity.</p>
        </div>
    </body>
    </html>
  `;
}
