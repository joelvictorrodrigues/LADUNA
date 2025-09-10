#!/usr/bin/env python3
"""
Backend API Testing for LADUNA Studio Contact Form
Tests the contact form email functionality and database storage
"""

import requests
import json
import os
import sys
from datetime import datetime
import time

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("ERROR: Could not get REACT_APP_BACKEND_URL from frontend/.env")
    sys.exit(1)

API_BASE_URL = f"{BACKEND_URL}/api"
print(f"Testing backend at: {API_BASE_URL}")

class ContactFormTester:
    def __init__(self):
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'details': details,
            'timestamp': datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        print(f"   {message}")
        if details:
            print(f"   Details: {details}")
        print()
        
        if not success:
            self.failed_tests.append(result)
    
    def test_api_health(self):
        """Test if the API is accessible"""
        try:
            response = requests.get(f"{API_BASE_URL}/", timeout=10)
            if response.status_code == 200:
                self.log_test("API Health Check", True, "Backend API is accessible")
                return True
            else:
                self.log_test("API Health Check", False, f"API returned status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("API Health Check", False, f"Failed to connect to API: {str(e)}")
            return False
    
    def test_contact_form_valid_data(self):
        """Test contact form with valid data"""
        test_data = {
            "name": "Maria Silva",
            "email": "maria.silva@exemplo.com",
            "phone": "+55 11 99999-9999",
            "company": "Empresa Exemplo Ltda",
            "service": "Desenvolvimento Web",
            "message": "Olá, gostaria de solicitar um orçamento para desenvolvimento de um site institucional para minha empresa. Preciso de algo moderno e responsivo."
        }
        
        try:
            response = requests.post(
                f"{API_BASE_URL}/contact",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=30  # Increased timeout for email sending
            )
            
            if response.status_code == 200:
                response_data = response.json()
                if response_data.get('success') and 'sucesso' in response_data.get('message', '').lower():
                    self.log_test(
                        "Contact Form - Valid Data", 
                        True, 
                        "Contact form submitted successfully with valid data",
                        f"Response: {response_data}"
                    )
                    return True
                else:
                    self.log_test(
                        "Contact Form - Valid Data", 
                        False, 
                        "Unexpected response format",
                        f"Response: {response_data}"
                    )
                    return False
            else:
                self.log_test(
                    "Contact Form - Valid Data", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except requests.exceptions.Timeout:
            self.log_test(
                "Contact Form - Valid Data", 
                False, 
                "Request timed out - email sending may be slow or failing"
            )
            return False
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Contact Form - Valid Data", 
                False, 
                f"Request failed: {str(e)}"
            )
            return False
    
    def test_contact_form_missing_required_fields(self):
        """Test contact form with missing required fields"""
        test_cases = [
            {"email": "test@test.com", "phone": "123", "message": "test"},  # Missing name
            {"name": "Test", "phone": "123", "message": "test"},  # Missing email
            {"name": "Test", "email": "test@test.com", "message": "test"},  # Missing phone
            {"name": "Test", "email": "test@test.com", "phone": "123"},  # Missing message
        ]
        
        all_passed = True
        for i, test_data in enumerate(test_cases):
            try:
                response = requests.post(
                    f"{API_BASE_URL}/contact",
                    json=test_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                # Should return 422 for validation errors
                if response.status_code == 422:
                    self.log_test(
                        f"Contact Form - Missing Field Test {i+1}", 
                        True, 
                        "Correctly rejected request with missing required field"
                    )
                else:
                    self.log_test(
                        f"Contact Form - Missing Field Test {i+1}", 
                        False, 
                        f"Expected 422 validation error, got {response.status_code}"
                    )
                    all_passed = False
                    
            except requests.exceptions.RequestException as e:
                self.log_test(
                    f"Contact Form - Missing Field Test {i+1}", 
                    False, 
                    f"Request failed: {str(e)}"
                )
                all_passed = False
        
        return all_passed
    
    def test_contact_form_invalid_email(self):
        """Test contact form with invalid email format"""
        test_data = {
            "name": "Test User",
            "email": "invalid-email-format",
            "phone": "123456789",
            "message": "Test message"
        }
        
        try:
            response = requests.post(
                f"{API_BASE_URL}/contact",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            # Should return 422 for validation errors
            if response.status_code == 422:
                self.log_test(
                    "Contact Form - Invalid Email", 
                    True, 
                    "Correctly rejected request with invalid email format"
                )
                return True
            else:
                self.log_test(
                    "Contact Form - Invalid Email", 
                    False, 
                    f"Expected 422 validation error, got {response.status_code}: {response.text}"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Contact Form - Invalid Email", 
                False, 
                f"Request failed: {str(e)}"
            )
            return False
    
    def test_email_sending_functionality(self):
        """Test that emails are actually being sent (by checking for SMTP errors)"""
        test_data = {
            "name": "João Santos",
            "email": "joao.santos@teste.com",
            "phone": "+55 21 98888-7777",
            "company": "Santos & Associados",
            "service": "Consultoria Digital",
            "message": "Teste de envio de email através do formulário de contato. Esta é uma mensagem de teste para verificar se o sistema SMTP está funcionando corretamente."
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{API_BASE_URL}/contact",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=45  # Longer timeout for email sending
            )
            end_time = time.time()
            
            if response.status_code == 200:
                response_data = response.json()
                if response_data.get('success'):
                    self.log_test(
                        "Email Sending Functionality", 
                        True, 
                        f"Email sent successfully (took {end_time - start_time:.2f}s)",
                        f"Response: {response_data}"
                    )
                    return True
                else:
                    self.log_test(
                        "Email Sending Functionality", 
                        False, 
                        "Response indicates email sending failed",
                        f"Response: {response_data}"
                    )
                    return False
            else:
                error_detail = response.text
                if "Failed to send email" in error_detail:
                    self.log_test(
                        "Email Sending Functionality", 
                        False, 
                        "SMTP email sending failed",
                        f"Error: {error_detail}"
                    )
                else:
                    self.log_test(
                        "Email Sending Functionality", 
                        False, 
                        f"HTTP {response.status_code}: {error_detail}"
                    )
                return False
                
        except requests.exceptions.Timeout:
            self.log_test(
                "Email Sending Functionality", 
                False, 
                "Request timed out - SMTP connection may be failing"
            )
            return False
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Email Sending Functionality", 
                False, 
                f"Request failed: {str(e)}"
            )
            return False
    
    def test_database_storage(self):
        """Test that contact form data is stored in database by submitting and checking response"""
        test_data = {
            "name": "Ana Costa",
            "email": "ana.costa@exemplo.com", 
            "phone": "+55 11 97777-6666",
            "company": "Costa Design Studio",
            "service": "Branding",
            "message": "Preciso de ajuda com a identidade visual da minha empresa. Gostaria de criar um logo moderno e materiais de marketing."
        }
        
        try:
            response = requests.post(
                f"{API_BASE_URL}/contact",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                response_data = response.json()
                if response_data.get('success'):
                    self.log_test(
                        "Database Storage", 
                        True, 
                        "Contact form data processed successfully (indicates database storage worked)",
                        f"Response: {response_data}"
                    )
                    return True
                else:
                    self.log_test(
                        "Database Storage", 
                        False, 
                        "Contact form processing failed",
                        f"Response: {response_data}"
                    )
                    return False
            else:
                self.log_test(
                    "Database Storage", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Database Storage", 
                False, 
                f"Request failed: {str(e)}"
            )
            return False
    
    def run_all_tests(self):
        """Run all contact form tests"""
        print("=" * 60)
        print("LADUNA STUDIO - BACKEND CONTACT FORM TESTING")
        print("=" * 60)
        print(f"Testing backend at: {API_BASE_URL}")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # Test API health first
        if not self.test_api_health():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Run all tests
        tests = [
            self.test_contact_form_valid_data,
            self.test_email_sending_functionality,
            self.test_database_storage,
            self.test_contact_form_missing_required_fields,
            self.test_contact_form_invalid_email,
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                self.log_test(
                    test.__name__, 
                    False, 
                    f"Test crashed with exception: {str(e)}"
                )
        
        # Print summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r['success']])
        failed_tests = len(self.failed_tests)
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print()
        
        if self.failed_tests:
            print("FAILED TESTS:")
            for test in self.failed_tests:
                print(f"❌ {test['test']}: {test['message']}")
                if test['details']:
                    print(f"   Details: {test['details']}")
            print()
        
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        print(f"Success Rate: {success_rate:.1f}%")
        
        if failed_tests == 0:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {failed_tests} test(s) failed")
            return False

def main():
    """Main test execution"""
    tester = ContactFormTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()