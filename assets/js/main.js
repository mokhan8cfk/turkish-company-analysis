// Turkish Company Analysis Platform - Main JavaScript
// Professional business intelligence platform for Vector Framework assessments

// Configuration
const CONFIG = {
    GOOGLE_APPS_SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE', // Will be updated after Google Apps Script deployment
    API_ENDPOINTS: {
        COMPANIES: '/api/companies.json',
        GENERATE_REPORT: '/generate-report'
    }
};

// Global state
let companiesData = [];
let filteredCompanies = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    showLoading('Loading comprehensive database...');
    
    try {
        await loadCompaniesData();
        renderDashboard();
        renderCompaniesTable();
        initializeFilters();
        hideLoading();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to load company database. Please refresh the page.');
    }
}

// Load companies data
async function loadCompaniesData() {
    try {
        const response = await fetch('api/companies.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        companiesData = await response.json();
        filteredCompanies = [...companiesData];
        console.log(`Loaded ${companiesData.length} companies`);
    } catch (error) {
        console.error('Error loading companies data:', error);
        // Fallback to sample data for demonstration
        companiesData = generateSampleData();
        filteredCompanies = [...companiesData];
    }
}

// Render dashboard metrics
function renderDashboard() {
    const totalCompanies = companiesData.length;
    const totalRevenue = companiesData.reduce((sum, company) => sum + (company.revenue || 0), 0);
    const avgAlpha = companiesData.reduce((sum, company) => sum + (company.alphaOpportunity || 0), 0) / totalCompanies;
    const highPriority = companiesData.filter(company => company.priority === 'High').length;

    document.getElementById('total-companies').textContent = totalCompanies.toLocaleString();
    document.getElementById('total-revenue').textContent = `$${(totalRevenue / 1000).toFixed(1)}B`;
    document.getElementById('avg-alpha').textContent = `${avgAlpha.toFixed(1)}%`;
    document.getElementById('high-priority').textContent = highPriority.toLocaleString();
}

// Render companies table
function renderCompaniesTable() {
    const tableBody = document.getElementById('companies-table-body');
    
    if (!tableBody) {
        console.error('Companies table body not found');
        return;
    }

    tableBody.innerHTML = '';

    filteredCompanies.forEach(company => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="font-weight: 600;">${company.name}</div>
                <div style="font-size: 0.9rem; color: #64748b;">${company.industry}</div>
            </td>
            <td>$${company.revenue?.toLocaleString() || 'N/A'}M</td>
            <td>${company.employees?.toLocaleString() || 'N/A'}</td>
            <td>${company.overallScore || 'N/A'}%</td>
            <td>${company.alphaOpportunity || 'N/A'}%</td>
            <td>
                <span class="priority-badge priority-${company.priority?.toLowerCase() || 'low'}">
                    ${company.priority || 'Low'}
                </span>
            </td>
            <td>
                <button class="action-btn btn-primary" onclick="generateReport('${company.id}')">
                    Report
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `${filteredCompanies.length} of ${companiesData.length} companies`;
    }
}

// Initialize filters
function initializeFilters() {
    const industryFilter = document.getElementById('industry-filter');
    const priorityFilter = document.getElementById('priority-filter');
    const searchInput = document.getElementById('search-input');

    // Populate industry filter
    if (industryFilter) {
        const industries = [...new Set(companiesData.map(company => company.industry))].sort();
        industries.forEach(industry => {
            const option = document.createElement('option');
            option.value = industry;
            option.textContent = industry;
            industryFilter.appendChild(option);
        });

        industryFilter.addEventListener('change', applyFilters);
    }

    // Priority filter
    if (priorityFilter) {
        priorityFilter.addEventListener('change', applyFilters);
    }

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

// Apply filters
function applyFilters() {
    const industryFilter = document.getElementById('industry-filter')?.value || '';
    const priorityFilter = document.getElementById('priority-filter')?.value || '';
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';

    filteredCompanies = companiesData.filter(company => {
        const matchesIndustry = !industryFilter || company.industry === industryFilter;
        const matchesPriority = !priorityFilter || company.priority === priorityFilter;
        const matchesSearch = !searchTerm || 
            company.name.toLowerCase().includes(searchTerm) ||
            company.industry.toLowerCase().includes(searchTerm);

        return matchesIndustry && matchesPriority && matchesSearch;
    });

    renderCompaniesTable();
}

// Generate company report
async function generateReport(companyId) {
    const company = companiesData.find(c => c.id === companyId);
    
    if (!company) {
        showError('Company not found');
        return;
    }

    showLoading(`Generating report for ${company.name}...`);

    try {
        // Create report URL
        const reportUrl = `reports/report.html?company=${encodeURIComponent(companyId)}`;
        
        // Open report in new window
        window.open(reportUrl, '_blank');
        
        hideLoading();
    } catch (error) {
        console.error('Error generating report:', error);
        showError('Failed to generate report. Please try again.');
    }
}

// Export functions
function exportDatabase() {
    const csv = convertToCSV(companiesData);
    downloadCSV(csv, 'turkish-companies-database.csv');
}

function generateExecutiveReport() {
    showLoading('Generating executive report...');
    
    // Create executive summary
    const executiveData = {
        totalCompanies: companiesData.length,
        totalRevenue: companiesData.reduce((sum, c) => sum + (c.revenue || 0), 0),
        avgAlpha: companiesData.reduce((sum, c) => sum + (c.alphaOpportunity || 0), 0) / companiesData.length,
        topOpportunities: companiesData
            .sort((a, b) => (b.alphaOpportunity || 0) - (a.alphaOpportunity || 0))
            .slice(0, 10)
    };

    // Generate and download executive report
    const reportContent = generateExecutiveReportHTML(executiveData);
    downloadHTML(reportContent, 'turkish-market-executive-report.html');
    
    hideLoading();
}

function createOutreachCampaign() {
    const highPriorityCompanies = companiesData.filter(c => c.priority === 'High');
    
    if (highPriorityCompanies.length === 0) {
        showError('No high priority companies found for outreach campaign.');
        return;
    }

    showLoading('Creating outreach campaign...');
    
    // Generate campaign data
    const campaignData = highPriorityCompanies.map(company => ({
        name: company.name,
        industry: company.industry,
        revenue: company.revenue,
        alphaOpportunity: company.alphaOpportunity,
        emailTemplate: generateOutreachEmail(company)
    }));

    const csv = convertToCSV(campaignData);
    downloadCSV(csv, 'outreach-campaign.csv');
    
    hideLoading();
}

// Utility functions
function convertToCSV(data) {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(','))
    ].join('\n');
    
    return csvContent;
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function downloadHTML(html, filename) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function generateOutreachEmail(company) {
    return `Subject: Strategic Assessment Opportunity - ${company.name}

Dear ${company.name} Leadership Team,

Our analysis of Turkish companies has identified ${company.name} as having significant value creation potential of ${company.alphaOpportunity}% through strategic operational improvements.

Based on our Vector Framework assessment methodology, we've identified specific opportunities in your ${company.industry} operations that could enhance performance and profitability.

We would welcome the opportunity to discuss these findings and explore how our proven methodology could benefit ${company.name}.

Best regards,
Vector Intelligence Platform`;
}

function generateExecutiveReportHTML(data) {
    return `<!DOCTYPE html>
<html>
<head>
    <title>Turkish Market Executive Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .metric { margin: 20px 0; }
        .companies-list { margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Turkish Market Executive Report</h1>
        <p>Vector Framework Business Assessment Platform</p>
    </div>
    
    <div class="metric">
        <h3>Market Overview</h3>
        <p>Total Companies Analyzed: ${data.totalCompanies}</p>
        <p>Combined Revenue: $${(data.totalRevenue / 1000).toFixed(1)}B USD</p>
        <p>Average Alpha Opportunity: ${data.avgAlpha.toFixed(1)}%</p>
    </div>
    
    <div class="companies-list">
        <h3>Top 10 Value Creation Opportunities</h3>
        ${data.topOpportunities.map((company, index) => `
            <p>${index + 1}. ${company.name} - ${company.alphaOpportunity}% Alpha Opportunity</p>
        `).join('')}
    </div>
</body>
</html>`;
}

function generateSampleData() {
    // Fallback sample data if API fails
    return [
        {
            id: 'arcelik',
            name: 'Arçelik A.Ş.',
            industry: 'Consumer Electronics',
            revenue: 4200,
            employees: 28000,
            overallScore: 72,
            alphaOpportunity: 28,
            priority: 'High'
        },
        // Add more sample companies as needed
    ];
}

function showLoading(message) {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        loadingDiv.textContent = message;
        loadingDiv.style.display = 'block';
    }
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        loadingDiv.style.display = 'none';
    }
}

function showError(message) {
    alert(message); // Simple error handling - can be enhanced with better UI
    hideLoading();
}
