#!/usr/bin/env python3
import requests
import sys
import os
from datetime import datetime

class KNImportExportAPITester:
    def __init__(self):
        # Since this is running in container, use the external URL for testing
        # The backend runs on port 8001 internally but is mapped externally
        self.base_url = "http://localhost:8001/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else type(response_data)}")
                    return success, response_data
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error response: {error_data}")
                except:
                    print(f"   Raw response: {response.text}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'url': url,
                    'method': method
                })
                return False, {}

        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection Error: Cannot reach {url}")
            print("   Server may not be running or accessible")
            self.failed_tests.append({
                'name': name,
                'error': 'Connection Error',
                'url': url,
                'method': method
            })
            return False, {}
        except requests.exceptions.Timeout:
            print(f"❌ Failed - Timeout: Request took too long")
            self.failed_tests.append({
                'name': name,
                'error': 'Timeout',
                'url': url,
                'method': method
            })
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e),
                'url': url,
                'method': method
            })
            return False, {}

    def test_health_check(self):
        """Test API health check"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "/health",
            200
        )
        return success and response.get('ok') == True

    def test_inventory_endpoint(self):
        """Test inventory endpoint"""
        success, response = self.run_test(
            "Inventory Endpoint",
            "GET",
            "/inventory",
            200
        )
        if success and 'items' in response:
            print(f"   Found {len(response['items'])} inventory items")
            return True
        return False

    def test_media_endpoint(self):
        """Test media endpoint"""
        success, response = self.run_test(
            "Media Endpoint",
            "GET",
            "/media",
            200
        )
        if success and 'assets' in response:
            print(f"   Found {len(response['assets'])} media assets")
            return True
        return False

    def test_hero_images_endpoint(self):
        """Test hero images endpoint"""
        success, response = self.run_test(
            "Hero Images Endpoint",
            "GET",
            "/hero-images",
            200
        )
        if success and 'images' in response:
            print(f"   Found {len(response['images'])} hero images")
            return True
        return False

    def test_gallery_endpoint(self):
        """Test gallery endpoint"""
        success, response = self.run_test(
            "Gallery Endpoint",
            "GET",
            "/gallery",
            200
        )
        if success and 'assets' in response:
            print(f"   Found {len(response['assets'])} gallery assets")
            return True
        return False

    def test_gallery_with_tags(self):
        """Test gallery endpoint with tags parameter"""
        success, response = self.run_test(
            "Gallery with Tags",
            "GET",
            "/gallery?tags=fresh_closeup,quality",
            200
        )
        if success and 'assets' in response:
            print(f"   Found {len(response['assets'])} filtered gallery assets")
            return True
        return False

    def test_request_creation(self):
        """Test creating a request"""
        test_payload = {
            "request_type": "reserve",
            "business_name": "Test Business",
            "contact_name": "Test Contact",
            "phone_whatsapp": "1234567890",
            "email": "test@example.com",
            "parish": "Test Parish",
            "business_type": "restaurant",
            "urgency": "not_urgent",
            "substitutions_allowed": True,
            "notes": "Test request from API testing",
            "items": [
                {
                    "custom_item_name": "Test Mangoes",
                    "quantity": 10,
                    "unit_label": "boxes"
                }
            ]
        }
        
        success, response = self.run_test(
            "Create Request",
            "POST",
            "/requests",
            201,
            data=test_payload
        )
        if success and 'reference_id' in response:
            print(f"   Created request with reference: {response['reference_id']}")
            return True
        return False

def main():
    print("🚀 Starting K&N Import Export API Tests")
    print("=" * 50)
    
    tester = KNImportExportAPITester()
    
    # Test all public endpoints
    results = {
        'health': tester.test_health_check(),
        'inventory': tester.test_inventory_endpoint(),
        'media': tester.test_media_endpoint(),
        'hero_images': tester.test_hero_images_endpoint(),
        'gallery': tester.test_gallery_endpoint(),
        'gallery_tags': tester.test_gallery_with_tags(),
        'create_request': tester.test_request_creation()
    }
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    print(f"Total tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Tests failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    # Show individual results
    print("\n📋 Individual Results:")
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"  {test_name}: {status}")
    
    # Show failed tests details
    if tester.failed_tests:
        print("\n🔍 Failed Tests Details:")
        for failed in tester.failed_tests:
            print(f"  - {failed['name']}")
            if 'expected' in failed and 'actual' in failed:
                print(f"    Expected: {failed['expected']}, Got: {failed['actual']}")
            if 'error' in failed:
                print(f"    Error: {failed['error']}")
            print(f"    URL: {failed['url']}")
    
    # Return 0 for success, 1 for failure
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())