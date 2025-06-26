#!/usr/bin/env node

/**
 * Admin Analytics Diagnostic Script
 * Comprehensive error checking for admin dashboard components
 */

const fs = require('fs');
const path = require('path');

class AdminDiagnostics {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('id-ID');
    const colors = {
      error: '\x1b[31m',
      warning: '\x1b[33m',
      success: '\x1b[32m',
      info: '\x1b[36m',
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async checkFormatFunctions() {
    this.log('🔍 Checking format functions for null/undefined handling...', 'info');
    
    const analyticsPath = path.join(process.cwd(), 'src/components/admin/AnalyticsDashboard.tsx');
    
    if (!fs.existsSync(analyticsPath)) {
      this.errors.push('AnalyticsDashboard.tsx not found');
      return;
    }

    const content = fs.readFileSync(analyticsPath, 'utf8');
    
    // Check formatNumber function
    const formatNumberMatch = content.match(/const formatNumber = \(([^)]+)\) => \{([^}]+)\}/s);
    if (formatNumberMatch) {
      const params = formatNumberMatch[1];
      const body = formatNumberMatch[2];
      
      if (params.includes('undefined') && params.includes('null')) {
        this.passed.push('formatNumber function handles undefined/null parameters');
      } else {
        this.warnings.push('formatNumber function may not handle undefined/null parameters properly');
      }
      
      if (body.includes('isNaN') && body.includes('undefined') && body.includes('null')) {
        this.passed.push('formatNumber function has comprehensive null checks');
      } else {
        this.warnings.push('formatNumber function may need better null checks');
      }
    } else {
      this.errors.push('formatNumber function not found or malformed');
    }

    // Check formatDuration function
    const formatDurationMatch = content.match(/const formatDuration = \(([^)]+)\) => \{([^}]+)\}/s);
    if (formatDurationMatch) {
      const params = formatDurationMatch[1];
      const body = formatDurationMatch[2];
      
      if (params.includes('undefined') && params.includes('null')) {
        this.passed.push('formatDuration function handles undefined/null parameters');
      } else {
        this.warnings.push('formatDuration function may not handle undefined/null parameters properly');
      }
    } else {
      this.errors.push('formatDuration function not found or malformed');
    }

    // Check for unsafe .toFixed() calls
    const unsafeToFixedMatches = content.match(/(?<!safeToFixed\()[^.]+\.toFixed\(/g);
    if (unsafeToFixedMatches && unsafeToFixedMatches.length > 0) {
      this.warnings.push(`Found ${unsafeToFixedMatches.length} potentially unsafe .toFixed() calls`);
    } else {
      this.passed.push('No unsafe .toFixed() calls found');
    }
  }

  async checkAPIEndpoints() {
    this.log('🔍 Checking API endpoints for proper error handling...', 'info');
    
    const apiPath = path.join(process.cwd(), 'src/app/api/admin/analytics/dashboard/route.ts');
    
    if (!fs.existsSync(apiPath)) {
      this.errors.push('Analytics dashboard API route not found');
      return;
    }

    const content = fs.readFileSync(apiPath, 'utf8');
    
    // Check for proper default values
    if (content.includes('overallStats[0] || {') && content.includes('totalViews: 0')) {
      this.passed.push('API provides proper default values for overallStats');
    } else {
      this.warnings.push('API may not provide proper default values for overallStats');
    }

    // Check for error handling
    if (content.includes('try {') && content.includes('catch (error)')) {
      this.passed.push('API has try-catch error handling');
    } else {
      this.errors.push('API missing proper error handling');
    }

    // Check for authentication
    if (content.includes('verifyAuth')) {
      this.passed.push('API has authentication verification');
    } else {
      this.warnings.push('API may be missing authentication verification');
    }
  }

  async checkComponentImports() {
    this.log('🔍 Checking component imports and dependencies...', 'info');
    
    const analyticsPagePath = path.join(process.cwd(), 'src/app/admin/analytics/page.tsx');
    
    if (!fs.existsSync(analyticsPagePath)) {
      this.errors.push('Analytics page not found');
      return;
    }

    const content = fs.readFileSync(analyticsPagePath, 'utf8');
    
    // Check for required imports
    const requiredImports = [
      'AnalyticsDashboard',
      'GeographicAnalytics'
    ];

    requiredImports.forEach(importName => {
      if (content.includes(importName)) {
        this.passed.push(`${importName} component properly imported`);
      } else {
        this.errors.push(`${importName} component not imported`);
      }
    });

    // Check for duplicate layout wrappers
    const adminLayoutCount = (content.match(/AdminLayout/g) || []).length;
    const adminAuthCount = (content.match(/AdminAuth/g) || []).length;
    
    if (adminLayoutCount === 0 && adminAuthCount === 0) {
      this.passed.push('No duplicate layout wrappers found in analytics page');
    } else {
      this.warnings.push(`Found ${adminLayoutCount} AdminLayout and ${adminAuthCount} AdminAuth references - check for duplicates`);
    }
  }

  async checkLayoutStructure() {
    this.log('🔍 Checking admin layout structure...', 'info');
    
    const layoutPath = path.join(process.cwd(), 'src/app/admin/layout.tsx');
    
    if (!fs.existsSync(layoutPath)) {
      this.errors.push('Admin layout wrapper not found');
      return;
    }

    const content = fs.readFileSync(layoutPath, 'utf8');
    
    // Check for proper authentication flow
    if (content.includes('AdminAuth') && content.includes('AdminLayout')) {
      this.passed.push('Admin layout has proper authentication and layout components');
    } else {
      this.errors.push('Admin layout missing proper authentication or layout components');
    }

    // Check for loading states
    if (content.includes('isLoading') && content.includes('Loading admin panel')) {
      this.passed.push('Admin layout has proper loading states');
    } else {
      this.warnings.push('Admin layout may be missing loading states');
    }
  }

  async runDiagnostics() {
    this.log('🚀 Starting Admin Analytics Diagnostics...', 'info');
    this.log('=' * 50, 'info');

    await this.checkFormatFunctions();
    await this.checkAPIEndpoints();
    await this.checkComponentImports();
    await this.checkLayoutStructure();

    this.log('=' * 50, 'info');
    this.log('📊 DIAGNOSTIC RESULTS', 'info');
    this.log('=' * 50, 'info');

    if (this.errors.length > 0) {
      this.log(`❌ ERRORS (${this.errors.length}):`, 'error');
      this.errors.forEach(error => this.log(`  • ${error}`, 'error'));
      this.log('', 'info');
    }

    if (this.warnings.length > 0) {
      this.log(`⚠️  WARNINGS (${this.warnings.length}):`, 'warning');
      this.warnings.forEach(warning => this.log(`  • ${warning}`, 'warning'));
      this.log('', 'info');
    }

    if (this.passed.length > 0) {
      this.log(`✅ PASSED (${this.passed.length}):`, 'success');
      this.passed.forEach(pass => this.log(`  • ${pass}`, 'success'));
      this.log('', 'info');
    }

    const totalChecks = this.errors.length + this.warnings.length + this.passed.length;
    const successRate = ((this.passed.length / totalChecks) * 100).toFixed(1);
    
    this.log(`📈 SUCCESS RATE: ${successRate}% (${this.passed.length}/${totalChecks})`, 
             this.errors.length === 0 ? 'success' : 'warning');

    if (this.errors.length === 0) {
      this.log('🎉 All critical checks passed! Admin analytics should work properly.', 'success');
      return true;
    } else {
      this.log('🔧 Please fix the errors above before proceeding.', 'error');
      return false;
    }
  }
}

// Run diagnostics if called directly
if (require.main === module) {
  const diagnostics = new AdminDiagnostics();
  diagnostics.runDiagnostics().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = AdminDiagnostics;
