#!/usr/bin/env python3
"""
Quick test script for Gemini AI integration
Tests basic functionality without starting the full server
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_api_key():
    """Test if API key is configured"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment")
        print("Please set it in .env file or export it")
        return False
    
    if api_key == "your_gemini_api_key_here":
        print("❌ GEMINI_API_KEY is still the placeholder value")
        print("Please update .env with your actual API key")
        return False
    
    print(f"✅ API key configured (length: {len(api_key)})")
    return True

def test_imports():
    """Test if all required packages are installed"""
    print("\n📦 Testing imports...")
    
    try:
        import google.generativeai as genai
        print("✅ google-generativeai installed")
    except ImportError:
        print("❌ google-generativeai not installed")
        print("Run: pip install google-generativeai")
        return False
    
    try:
        import fastapi
        print("✅ fastapi installed")
    except ImportError:
        print("❌ fastapi not installed")
        print("Run: pip install fastapi")
        return False
    
    try:
        import uvicorn
        print("✅ uvicorn installed")
    except ImportError:
        print("❌ uvicorn not installed")
        print("Run: pip install uvicorn")
        return False
    
    return True

def test_gemini_connection():
    """Test connection to Gemini API"""
    print("\n🔌 Testing Gemini API connection...")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        print("⚠️  Skipping connection test (no valid API key)")
        return False
    
    try:
        import google.generativeai as genai
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Simple test prompt
        response = model.generate_content("Say 'Hello from Gemini!' in one sentence")
        
        print(f"✅ Gemini API connection successful!")
        print(f"📝 Test response: {response.text[:100]}...")
        return True
        
    except Exception as e:
        print(f"❌ Gemini API connection failed: {e}")
        return False

def test_service_import():
    """Test if our service can be imported"""
    print("\n🔧 Testing service import...")
    
    try:
        from gemini_chat_service import GeminiFantasyAssistant
        print("✅ GeminiFantasyAssistant can be imported")
        return True
    except Exception as e:
        print(f"❌ Failed to import service: {e}")
        return False

def main():
    print("🧪 Flow Fantasy Fusion - Gemini AI Test Suite")
    print("=" * 50)
    
    results = []
    
    # Run tests
    results.append(("API Key Configuration", test_api_key()))
    results.append(("Package Imports", test_imports()))
    results.append(("Service Import", test_service_import()))
    results.append(("Gemini Connection", test_gemini_connection()))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    print("=" * 50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print("=" * 50)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! You're ready to start the service.")
        print("Run: ./start_gemini.sh")
        return 0
    else:
        print("\n⚠️  Some tests failed. Please fix the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
