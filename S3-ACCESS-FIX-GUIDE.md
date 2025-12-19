# S3 Access Fix Guide - Family Photo Gallery

## Problem Identified ❌

**Issue:** Photos cannot be accessed from S3 URLs  
**Error:** "Network connection failed. Unable to reach the server."  
**Cause:** S3 bucket photos are not publicly accessible

## Solution Options 🔧

### **Option 1: Make S3 Bucket Publicly Readable (Simplest)**

This is the easiest solution for a family photo gallery where photos don't need to be private.

#### Steps:

1. **Go to AWS S3 Console**
   - Navigate to: https://s3.console.aws.amazon.com/s3/

2. **Open Your Bucket**
   - Click on: `family-bucket-22`

3. **Unblock Public Access**
   - Go to: **Permissions** tab
   - Click: **Edit** under "Block public access (bucket settings)"
   - **Uncheck:** "Block all public access"
   - Click: **Save changes**
   - Type: `confirm` when prompted

4. **Add Bucket Policy**
   - Still in **Permissions** tab
   - Scroll to: **Bucket policy**
   - Click: **Edit**
   - Paste this policy:

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

   - Click: **Save changes**

5. **Test Access**
   - Try accessing one of your photo URLs directly in browser
   - Example: `https://family-bucket-22.s3.us-east-2.amazonaws.com/uploads/[your-photo-name].jpg`
   - If it loads, you're done! ✅

---

### **Option 2: Use Pre-Signed URLs (More Secure)**

This option keeps your bucket private but generates temporary URLs that expire.

#### Steps:

1. **Update Lambda Function**
   - Go to: AWS Lambda Console
   - Open: Your Lambda function
   - Replace code with: `lambda_function_presigned.py` (created in your project)

2. **Ensure Lambda Has S3 Permissions**
   - In Lambda function, go to: **Configuration** → **Permissions**
   - Click on the execution role
   - Ensure it has: `s3:GetObject` and `s3:ListBucket` permissions

3. **Deploy Lambda Function**
   - Click: **Deploy** button in Lambda console

4. **Test**
   - The Lambda function will now generate pre-signed URLs
   - These URLs are valid for 1 hour
   - Photos will load without making bucket public

---

### **Option 3: Enable CORS on S3 Bucket**

If you want to keep bucket private but allow browser access, configure CORS.

#### Steps:

1. **Go to S3 Bucket**
   - Open: `family-bucket-22`

2. **Configure CORS**
   - Go to: **Permissions** tab
   - Scroll to: **Cross-origin resource sharing (CORS)**
   - Click: **Edit**
   - Paste this configuration:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "HEAD"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [
            "ETag"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

   - Click: **Save changes**

3. **Still Need Public Access**
   - CORS alone won't fix the issue
   - You still need either Option 1 (public bucket) or Option 2 (pre-signed URLs)

---

## Recommended Solution 🎯

**For a Family Photo Gallery:** Use **Option 1** (Public Bucket)

**Why?**
- ✅ Simplest to implement
- ✅ Photos load instantly
- ✅ No URL expiration issues
- ✅ Better performance (no Lambda overhead)
- ✅ Suitable for non-sensitive family photos

**Security Note:** Only the `/uploads` folder will be public, not the entire bucket.

---

## Testing After Fix ✅

Once you've applied the fix:

1. **Test Direct URL Access**
   ```
   https://family-bucket-22.s3.us-east-2.amazonaws.com/uploads/[photo-name].jpg
   ```
   Should load the image in your browser

2. **Test API**
   ```
   https://h0vcodxzhj.execute-api.us-east-2.amazonaws.com/photos
   ```
   Should return photo URLs

3. **Test Gallery**
   - Open: http://localhost:8000/index.html
   - Click: "SEE PHOTOS" button
   - Photos should now display! 🎉

---

## Current Status 📊

✅ **API Gateway:** Working  
✅ **Lambda Function:** Working  
✅ **S3 Photos:** Uploaded (10 photos found)  
✅ **Photo URLs:** Generated correctly  
❌ **S3 Access:** Blocked (needs fixing)  

**Next Step:** Apply Option 1 to make photos accessible! 🚀

---

## Quick Verification Commands

Test if a photo is accessible:
```bash
curl -I https://family-bucket-22.s3.us-east-2.amazonaws.com/uploads/heriberto-garcia-YdjrYLvLO5Y-unsplash.jpg
```

Should return: `HTTP/1.1 200 OK` (not 403 Forbidden)

---

## Need Help?

If you encounter issues:
1. Check CloudWatch Logs for Lambda errors
2. Verify bucket policy is correctly applied
3. Ensure bucket name matches: `family-bucket-22`
4. Confirm photos are in: `/uploads` folder
5. Test with: http://localhost:8000/simple-photo-test.html
