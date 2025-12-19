// Test script to validate core functionality
console.log('Starting functionality tests...');

// Test 1: Check if all required DOM elements exist
function testDOMElements() {
    const requiredElements = [
        'seePhotosBtn',
        'toggleArchitectureBtn', 
        'architectureDiagram',
        'loadingState',
        'errorState',
        'photoGrid',
        'retryBtn',
        'photoDetailModal'
    ];
    
    let passed = 0;
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✓ Element ${id} found`);
            passed++;
        } else {
            console.error(`✗ Element ${id} missing`);
        }
    });
    
    console.log(`DOM Elements Test: ${passed}/${requiredElements.length} passed`);
    return passed === requiredElements.length;
}

// Test 2: Check if CSS Grid is properly implemented
function testCSSGrid() {
    const photoGrid = document.getElementById('photoGrid');
    if (!photoGrid) return false;
    
    const computedStyle = window.getComputedStyle(photoGrid);
    const display = computedStyle.display;
    const gridTemplateColumns = computedStyle.gridTemplateColumns;
    
    console.log(`CSS Grid display: ${display}`);
    console.log(`Grid template columns: ${gridTemplateColumns}`);
    
    const isGrid = display === 'grid';
    const hasResponsiveColumns = gridTemplateColumns.includes('minmax');
    
    console.log(`CSS Grid Test: ${isGrid && hasResponsiveColumns ? 'PASSED' : 'FAILED'}`);
    return isGrid && hasResponsiveColumns;
}

// Test 3: Check if JavaScript classes and functions are defined
function testJavaScriptAPI() {
    const requiredClasses = ['Photo', 'AWSApiService', 'APIError'];
    const requiredFunctions = ['handleSeePhotos', 'toggleArchitecture', 'renderPhotos'];
    
    let passed = 0;
    let total = requiredClasses.length + requiredFunctions.length;
    
    requiredClasses.forEach(className => {
        if (typeof window[className] === 'function') {
            console.log(`✓ Class ${className} defined`);
            passed++;
        } else {
            console.error(`✗ Class ${className} missing`);
        }
    });
    
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✓ Function ${funcName} defined`);
            passed++;
        } else {
            console.error(`✗ Function ${funcName} missing`);
        }
    });
    
    console.log(`JavaScript API Test: ${passed}/${total} passed`);
    return passed === total;
}

// Test 4: Test responsive behavior simulation
function testResponsiveBehavior() {
    const photoGrid = document.getElementById('photoGrid');
    if (!photoGrid) return false;
    
    // Test different viewport widths
    const testWidths = [320, 768, 1024, 1200];
    let passed = 0;
    
    testWidths.forEach(width => {
        // Simulate viewport change
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: width
        });
        
        // Trigger resize event
        window.dispatchEvent(new Event('resize'));
        
        // Check if grid adapts (this is a basic check)
        const computedStyle = window.getComputedStyle(photoGrid);
        if (computedStyle.display === 'grid') {
            console.log(`✓ Responsive test at ${width}px: Grid maintained`);
            passed++;
        }
    });
    
    console.log(`Responsive Behavior Test: ${passed}/${testWidths.length} passed`);
    return passed === testWidths.length;
}

// Test 5: Test accessibility features
function testAccessibility() {
    const accessibilityFeatures = [
        { selector: '[aria-label]', name: 'ARIA labels' },
        { selector: '[role]', name: 'ARIA roles' },
        { selector: '[aria-live]', name: 'Live regions' },
        { selector: '.sr-only', name: 'Screen reader content' }
    ];
    
    let passed = 0;
    
    accessibilityFeatures.forEach(feature => {
        const elements = document.querySelectorAll(feature.selector);
        if (elements.length > 0) {
            console.log(`✓ ${feature.name}: ${elements.length} elements found`);
            passed++;
        } else {
            console.error(`✗ ${feature.name}: No elements found`);
        }
    });
    
    console.log(`Accessibility Test: ${passed}/${accessibilityFeatures.length} passed`);
    return passed === accessibilityFeatures.length;
}

// Run all tests
function runAllTests() {
    console.log('='.repeat(50));
    console.log('FAMILY PHOTO GALLERY - FUNCTIONALITY TESTS');
    console.log('='.repeat(50));
    
    const results = {
        domElements: testDOMElements(),
        cssGrid: testCSSGrid(),
        javascriptAPI: testJavaScriptAPI(),
        responsive: testResponsiveBehavior(),
        accessibility: testAccessibility()
    };
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;
    
    console.log('='.repeat(50));
    console.log(`OVERALL RESULTS: ${passedTests}/${totalTests} tests passed`);
    console.log('='.repeat(50));
    
    if (passedTests === totalTests) {
        console.log('🎉 ALL TESTS PASSED! The application is ready for production.');
    } else {
        console.log('⚠️ Some tests failed. Please review the issues above.');
    }
    
    return results;
}

// Export for use in HTML file
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests };
} else {
    window.testFunctionality = runAllTests;
}