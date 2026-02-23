#  Family Photo Gallery – Serverless Static Website on AWS

## Project Overview

The **Family Photo Gallery** is a fully serverless, static web application hosted on Amazon S3 and powered by an AWS Lambda backend exposed through API Gateway.

The frontend is a **self-contained HTML file** (with embedded CSS & JavaScript) that:

- Loads photos dynamically from S3
- Uses a Lambda function to list and return image metadata
- Displays photos in a responsive grid
- Demonstrates AWS serverless architecture visually
- Includes comprehensive error handling and fallback modes

---

## 🏗️ Architecture

### Services Used

- **Amazon S3** – Static website hosting & image storage
- **AWS Lambda** – Serverless backend logic
- **Amazon API Gateway** – REST API endpoint
- **Amazon CloudWatch** – Logging & monitoring

### 🔄 Request Flow

1. User opens `index.html` hosted on S3
2. JavaScript calls API Gateway endpoint:
3. API Gateway triggers Lambda
4. Lambda:
   - Reads `/uploads` folder in S3 bucket
   - Filters supported image types
   - Returns structured JSON
5. Frontend renders photo grid dynamically

---

## 📁 Repository Structure

```
.
├── index.html                     # Main self-contained frontend application
├── lambda_function.py             # Lambda backend (lists photos from S3)
├── lambda_function_presigned.py   # Secure version using pre-signed URLs
├── final-test-report.md           # Complete testing validation report
├── final-integration-report.md    # Integration & requirements validation
├── S3-ACCESS-FIX-GUIDE.md         # Guide to resolving S3 access issues
├── integration-test.html          # Automated integration test suite
├── comprehensive-api-test.html    # API diagnostics
├── demo-gallery.html              # Demo version with mock data
└── README.md
```

---

## 🎯 Key Features

### ✅ Fully Self-Contained Frontend
- Single HTML file
- No external CSS or JS dependencies
- Portable across systems

### ✅ Responsive Design
- CSS Grid layout
- Mobile, tablet, desktop optimized
- Touch-friendly controls

### ✅ Backend Integration
- Lambda lists S3 objects
- Supports:
  - JPG - JPEG - PNG - GIF - WEBP
- Returns structured JSON with:
  - `photos[]`
  - title
  - description
  - tags

### ✅ Error Handling
- CORS validation
- Timeout detection
- Diagnostic panel

---

## AWS Setup Guide

### 1️⃣ Create S3 Bucket

1. Go to S3 Console
2. Create bucket:
   ```
   family-bucket-22
   ```
3. Create folder:
   ```
   /uploads
   ```
4. Upload image files

---

### 2️⃣ Configure Lambda Function

1. Create new Lambda (Python 3.12 recommended)
2. Add environment variable:
   ```
   BUCKET_NAME = family-bucket-22
   ```
3. Attach IAM permissions:
   - `s3:ListBucket`
   - `s3:GetObject`
4. Deploy code

---

### 3️⃣ Create API Gateway

1. Create HTTP API
2. Add route:
   ```
   GET /photos
   ```
3. Integrate with Lambda
4. Enable CORS:
   - Allow Origin: *
   - Allow Methods: GET, OPTIONS
5. Deploy and copy endpoint URL

---

### 4️⃣ Update Frontend Configuration

Inside `index.html`, update:

```javascript
const API_CONFIG = {
    baseUrl: "https://your-api-id.execute-api.us-east-2.amazonaws.com"
};
```

---

## 🔐 S3 Access Configuration

If photos fail to load, see: `S3-ACCESS-FIX-GUIDE.md`

### Recommended Solution (Public Read for /uploads)

Apply bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::family-bucket-22/uploads/*"
    }
  ]
}
```

---

## 🧪 Testing & Validation

According to `final-test-report.md`:

- ✅ API Connectivity – PASSED  
- ✅ Lambda Integration – PASSED  
- ✅ S3 Configuration – PASSED  
- ✅ CORS Configuration – PASSED  
- ✅ Frontend Application – PASSED  
- ✅ Integration Tests – PASSED  
- ✅ Demo Version – PASSED  

All requirements validated in `final-integration-report.md`.

---

---

## 📊 API Response Example

```json
{
  "photos": [
    {
      "url": "https://family-bucket-22.s3.us-east-2.amazonaws.com/uploads/photo1.jpg",
      "title": "Family Vacation",
      "description": "Beach trip 2025",
      "tags": ["vacation", "beach"]
    }
  ]
}
```

---

## 📦 Deployment Options

- S3 Static Website Hosting
- CloudFront + S3
- Local file execution
- Any HTTP server

---

---

## 🎉 Final Status

**ALL TESTS PASSED**  
**PRODUCTION READY**  
**SERVERLESS ARCHITECTURE VERIFIED**

This project demonstrates:

- Modern serverless design
- AWS integration best practices
- Robust frontend engineering
- Accessibility compliance
- Deployment flexibility

---

## Author

Edah Evans  
AWS Solutions Architect    

---

