#!/usr/bin/env python3
import requests
import sys

def test_specific_endpoint():
    """Test the hero images endpoint specifically"""
    url = "http://localhost:8001/api/hero-images"
    
    print(f"Testing hero images endpoint: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data}")
        else:
            try:
                error_data = response.json()
                print(f"Error response: {error_data}")
            except:
                print(f"Raw response: {response.text}")
                
    except Exception as e:
        print(f"Exception: {str(e)}")

def test_media_endpoint():
    """Test the media endpoint for comparison"""
    url = "http://localhost:8001/api/media"
    
    print(f"\nTesting media endpoint: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data}")
        else:
            try:
                error_data = response.json()
                print(f"Error response: {error_data}")
            except:
                print(f"Raw response: {response.text}")
                
    except Exception as e:
        print(f"Exception: {str(e)}")

if __name__ == "__main__":
    test_specific_endpoint()
    test_media_endpoint()