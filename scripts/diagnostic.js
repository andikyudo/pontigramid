#!/usr/bin/env node

/**
 * Script Diagnostik PontigramID Next.js Application
 * Menganalisis error logs, webpack issues, dan API endpoints
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class PontigramDiagnostic {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.apiErrors = [];
    this.webpackIssues = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async checkServerLogs() {
    this.log('🔍 Memeriksa server logs untuk runtime errors...', 'info');
    
    return new Promise((resolve) => {
      exec('ps aux | grep "next dev"', (error, stdout) => {
        if (stdout.includes('next dev')) {
          this.log('✅ Development server sedang berjalan', 'success');
        } else {
          this.log('❌ Development server tidak berjalan', 'error');
          this.errors.push('Development server tidak aktif');
        }
        resolve();
      });
    });
  }

  async checkWebpackCompilation() {
    this.log('🔍 Memeriksa webpack compilation issues...', 'info');
    
    // Check for common webpack issues
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    
    if (fs.existsSync(nextConfigPath)) {
      this.log('✅ next.config.js ditemukan', 'success');
      
      try {
        const configContent = fs.readFileSync(nextConfigPath, 'utf8');
        if (configContent.includes('swcMinify')) {
          this.warnings.push('next.config.js menggunakan deprecated swcMinify option');
        }
        if (configContent.includes('webpack:')) {
          this.log('✅ Custom webpack configuration ditemukan', 'success');
        }
      } catch (err) {
        this.errors.push(`Error membaca next.config.js: ${err.message}`);
      }
    } else {
      this.warnings.push('next.config.js tidak ditemukan - menggunakan default configuration');
    }
  }

  async testAPIEndpoints() {
    this.log('🔍 Testing API endpoints...', 'info');
    
    const endpoints = [
      { url: 'http://localhost:3000/api/news', name: 'News API' },
      { url: 'http://localhost:3000/api/categories', name: 'Categories API' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        if (response.ok) {
          this.log(`✅ ${endpoint.name} responding (${response.status})`, 'success');
        } else {
          this.log(`❌ ${endpoint.name} error (${response.status})`, 'error');
          this.apiErrors.push(`${endpoint.name}: HTTP ${response.status}`);
        }
      } catch (error) {
        this.log(`❌ ${endpoint.name} tidak dapat diakses: ${error.message}`, 'error');
        this.apiErrors.push(`${endpoint.name}: ${error.message}`);
      }
    }
  }

  async checkCriticalFiles() {
    this.log('🔍 Memeriksa file-file kritis...', 'info');
    
    const criticalFiles = [
      'src/app/admin/dashboard/dashboard.tsx',
      'src/app/admin/page.tsx',
      'src/components/admin/AdminLayout.tsx',
      'src/app/api/news/route.ts',
      'src/app/api/categories/route.ts'
    ];

    for (const file of criticalFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        this.log(`✅ ${file} ditemukan`, 'success');
        
        // Check for common issues
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for 'use client' directive in client components
          if (file.includes('dashboard.tsx') || file.includes('page.tsx')) {
            if (!content.includes("'use client'") && !content.includes('"use client"')) {
              this.warnings.push(`${file}: Missing 'use client' directive`);
            }
          }
          
          // Check for any type issues
          if (content.includes(': any')) {
            this.warnings.push(`${file}: Contains 'any' types`);
          }
          
          // Check for unescaped quotes in JSX
          if (content.match(/"[^"]*"[^"]*"/g)) {
            this.warnings.push(`${file}: Possible unescaped quotes in JSX`);
          }
          
        } catch (err) {
          this.errors.push(`Error reading ${file}: ${err.message}`);
        }
      } else {
        this.errors.push(`File tidak ditemukan: ${file}`);
      }
    }
  }

  async runESLintAnalysis() {
    this.log('🔍 Menjalankan ESLint analysis...', 'info');
    
    return new Promise((resolve) => {
      exec('npm run lint', (error, stdout, stderr) => {
        if (error) {
          this.log('❌ ESLint menemukan issues', 'warning');
          
          // Parse ESLint output
          const lines = stdout.split('\n');
          let errorCount = 0;
          let warningCount = 0;
          
          lines.forEach(line => {
            if (line.includes('Error:')) {
              errorCount++;
            } else if (line.includes('Warning:')) {
              warningCount++;
            }
          });
          
          this.log(`📊 ESLint Results: ${errorCount} errors, ${warningCount} warnings`, 'info');
          
          // Focus on our recently modified files
          const dashboardIssues = lines.filter(line => 
            line.includes('src/app/admin/dashboard/dashboard.tsx')
          );
          
          const adminPageIssues = lines.filter(line => 
            line.includes('src/app/admin/page.tsx')
          );
          
          if (dashboardIssues.length === 0) {
            this.log('✅ Dashboard component: No ESLint issues', 'success');
          } else {
            this.log(`❌ Dashboard component: ${dashboardIssues.length} issues`, 'error');
          }
          
          if (adminPageIssues.length === 0) {
            this.log('✅ Admin page component: No ESLint issues', 'success');
          } else {
            this.log(`❌ Admin page component: ${adminPageIssues.length} issues`, 'error');
          }
          
        } else {
          this.log('✅ ESLint: No issues found', 'success');
        }
        
        resolve({ stdout, stderr, error });
      });
    });
  }

  async testDashboardFunctionality() {
    this.log('🔍 Testing dashboard functionality...', 'info');
    
    const testUrls = [
      'http://localhost:3000/admin/dashboard',
      'http://localhost:3000/admin/news/create'
    ];

    for (const url of testUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          this.log(`✅ ${url} accessible (${response.status})`, 'success');
        } else {
          this.log(`❌ ${url} error (${response.status})`, 'error');
          this.errors.push(`Dashboard URL error: ${response.status}`);
        }
      } catch (error) {
        this.log(`❌ ${url} tidak dapat diakses: ${error.message}`, 'error');
        this.errors.push(`Dashboard access error: ${error.message}`);
      }
    }
  }

  generateSummaryReport() {
    this.log('\n📋 LAPORAN DIAGNOSTIK PONTIGRAMID', 'info');
    this.log('='.repeat(50), 'info');
    
    // Summary statistics
    this.log(`\n📊 RINGKASAN:`, 'info');
    this.log(`   • Total Errors: ${this.errors.length}`, this.errors.length > 0 ? 'error' : 'success');
    this.log(`   • Total Warnings: ${this.warnings.length}`, this.warnings.length > 0 ? 'warning' : 'success');
    this.log(`   • API Errors: ${this.apiErrors.length}`, this.apiErrors.length > 0 ? 'error' : 'success');
    
    // Critical errors
    if (this.errors.length > 0) {
      this.log(`\n🚨 CRITICAL ERRORS:`, 'error');
      this.errors.forEach((error, index) => {
        this.log(`   ${index + 1}. ${error}`, 'error');
      });
    }
    
    // Warnings
    if (this.warnings.length > 0) {
      this.log(`\n⚠️  WARNINGS:`, 'warning');
      this.warnings.forEach((warning, index) => {
        this.log(`   ${index + 1}. ${warning}`, 'warning');
      });
    }
    
    // API issues
    if (this.apiErrors.length > 0) {
      this.log(`\n🔌 API ISSUES:`, 'error');
      this.apiErrors.forEach((apiError, index) => {
        this.log(`   ${index + 1}. ${apiError}`, 'error');
      });
    }
    
    // Recommendations
    this.log(`\n💡 REKOMENDASI:`, 'info');
    
    if (this.errors.length === 0 && this.apiErrors.length === 0) {
      this.log(`   ✅ Aplikasi dalam kondisi baik!`, 'success');
      this.log(`   ✅ Semua komponen kritis berfungsi normal`, 'success');
      this.log(`   ✅ API endpoints responding correctly`, 'success');
    } else {
      this.log(`   🔧 Prioritas tinggi: Fix critical errors terlebih dahulu`, 'warning');
      this.log(`   🔧 Pastikan development server berjalan`, 'warning');
      this.log(`   🔧 Test API endpoints secara manual jika diperlukan`, 'warning');
    }
    
    if (this.warnings.length > 0) {
      this.log(`   📝 Pertimbangkan untuk fix warnings untuk code quality`, 'info');
    }
    
    this.log('\n' + '='.repeat(50), 'info');
  }

  async run() {
    this.log('🚀 Memulai diagnostik PontigramID Next.js Application...', 'info');
    
    try {
      await this.checkServerLogs();
      await this.checkWebpackCompilation();
      await this.checkCriticalFiles();
      await this.testAPIEndpoints();
      await this.runESLintAnalysis();
      await this.testDashboardFunctionality();
      
      this.generateSummaryReport();
      
    } catch (error) {
      this.log(`❌ Error during diagnostic: ${error.message}`, 'error');
    }
  }
}

// Run diagnostic if called directly
if (require.main === module) {
  const diagnostic = new PontigramDiagnostic();
  diagnostic.run();
}

module.exports = PontigramDiagnostic;
