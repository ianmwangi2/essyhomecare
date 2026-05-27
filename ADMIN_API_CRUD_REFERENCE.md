# Admin API - Complete CRUD Operations

This document outlines all admin endpoints available for managing the Essy Homecare system. All endpoints require admin authentication via Bearer token.

## Authentication

All requests must include a Bearer token in the Authorization header:
```
Authorization: Bearer {access_token}
```

The access token is obtained by logging in via the admin login page or using Supabase auth directly.

---

## Admin User Management

### List All Users & Admins
**GET** `/api/admin/users`

Returns all users in the system with list of admin users.

**Response:**
```json
{
  "total_users": 10,
  "admin_users": [
    {
      "id": "uuid-1",
      "email": "admin@essyhomecare.com",
      "role": "admin"
    }
  ]
}
```

### Assign Admin Role to User
**POST** `/api/admin/users/{userId}/assign-admin`

Grants admin role to an existing user.

**Body:** (empty)

**Response:**
```json
{
  "message": "Admin role assigned successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Remove Admin Role from User
**POST** `/api/admin/users/{userId}/remove-admin`

Revokes admin role from an admin user.

**Body:** (empty)

**Response:**
```json
{
  "message": "Admin role removed successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

## Referrals Management

### Get Dashboard Stats
**GET** `/api/admin/stats`

Get overview statistics for the dashboard.

**Response:**
```json
{
  "uptime": 12345.67,
  "timestamp": "2026-05-27T10:30:00Z",
  "total_referrals": 42,
  "referrals_this_week": 5,
  "referrals_this_month": 18,
  "total_applications": 12,
  "total_contacts": 8,
  "total_jobs": 3,
  "status_breakdown": {
    "new": 5,
    "approved": 20,
    "rejected": 15,
    "pending": 2
  }
}
```

### List All Referrals
**GET** `/api/admin/referrals?page=1&pageSize=100`

List all referrals with pagination.

**Query Params:**
- `page` (default: 1) - Page number
- `pageSize` (default: 100) - Records per page

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "patient_first_name": "John",
      "patient_last_name": "Doe",
      "dob": "1950-01-15",
      "phone": "555-0123",
      "status": "new",
      "created_at": "2026-05-27T10:00:00Z",
      ...
    }
  ],
  "page": 1,
  "pageSize": 100,
  "total": 42
}
```

### Get Single Referral
**GET** `/api/admin/referrals/{id}`

Get detailed view of a single referral.

**Response:**
```json
{
  "id": "uuid",
  "patient_first_name": "John",
  "patient_last_name": "Doe",
  "dob": "1950-01-15",
  "gender": "M",
  "address": "123 Main St",
  "city": "Boston",
  "state": "MA",
  "zip": "02101",
  "phone": "555-0123",
  "insurance_type": "Medicare",
  "referring_physician": "Dr. Smith",
  "diagnosis": "CHF",
  "services_requested": ["nursing", "PT"],
  "status": "new",
  "created_at": "2026-05-27T10:00:00Z"
}
```

### Create New Referral
**POST** `/api/admin/referrals`

Create a new referral manually.

**Body:**
```json
{
  "patient_first_name": "Jane",
  "patient_last_name": "Smith",
  "dob": "1955-06-20",
  "gender": "F",
  "phone": "555-9876",
  "submitter_name": "Admin User",
  "submitter_email": "admin@essyhomecare.com",
  "diagnosis": "Post-op recovery",
  "services_requested": ["nursing"],
  "status": "new"
}
```

**Response:** (201 Created)
```json
{
  "id": "new-uuid",
  "patient_first_name": "Jane",
  ...
}
```

### Update Referral
**PUT** `/api/admin/referrals/{id}`

Update any fields of a referral.

**Body:**
```json
{
  "patient_first_name": "Jane",
  "status": "approved",
  "preferred_office": "Boston"
}
```

**Response:**
```json
{
  "id": "uuid",
  "patient_first_name": "Jane",
  "status": "approved",
  ...
}
```

### Approve Referral (Convenience)
**POST** `/api/admin/referrals/{id}/approve`

Shortcut to approve a referral and set status to "approved".

**Body:** (empty)

**Response:**
```json
{
  "message": "Referral approved",
  "data": {
    "id": "uuid",
    "status": "approved",
    ...
  }
}
```

### Reject Referral (Convenience)
**POST** `/api/admin/referrals/{id}/reject`

Reject a referral with optional reason.

**Body:**
```json
{
  "reason": "Patient does not meet criteria"
}
```

**Response:**
```json
{
  "message": "Referral rejected",
  "data": {
    "id": "uuid",
    "status": "rejected",
    "reject_reason": "Patient does not meet criteria",
    ...
  }
}
```

### Delete Referral
**DELETE** `/api/admin/referrals/{id}`

Permanently delete a referral.

**Response:**
```json
{
  "message": "Referral deleted successfully"
}
```

---

## Contacts Management

### List All Contacts
**GET** `/api/admin/contacts`

List all contact form submissions.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Contact",
    "email": "john@example.com",
    "phone": "555-0123",
    "message": "I have a question...",
    "preferred_office": "Boston",
    "created_at": "2026-05-27T10:00:00Z"
  }
]
```

### Get Single Contact
**GET** `/api/admin/contacts/{id}`

Get details of a single contact submission.

**Response:**
```json
{
  "id": "uuid",
  "name": "John Contact",
  "email": "john@example.com",
  "phone": "555-0123",
  "message": "I have a question...",
  "preferred_office": "Boston",
  "created_at": "2026-05-27T10:00:00Z"
}
```

### Create Contact (Manual)
**POST** `/api/admin/contacts`

Create a new contact entry manually.

**Body:**
```json
{
  "name": "Jane Referrer",
  "email": "jane@hospital.com",
  "phone": "555-5555",
  "message": "Inquiry about referral process",
  "preferred_office": "Boston"
}
```

**Response:** (201 Created)
```json
{
  "id": "new-uuid",
  "name": "Jane Referrer",
  ...
}
```

### Update Contact
**PUT** `/api/admin/contacts/{id}`

Update contact information.

**Body:**
```json
{
  "phone": "555-1234",
  "preferred_office": "Cambridge"
}
```

**Response:**
```json
{
  "id": "uuid",
  "phone": "555-1234",
  "preferred_office": "Cambridge",
  ...
}
```

### Delete Contact
**DELETE** `/api/admin/contacts/{id}`

Delete a contact entry.

**Response:**
```json
{
  "message": "Contact deleted successfully"
}
```

---

## Job Listings Management

### List All Jobs
**GET** `/api/admin/jobs`

List all job postings.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Registered Nurse - Home Health",
    "type": "Full-time",
    "location": "Boston, MA",
    "description": "Provide in-home nursing care...",
    "requirements": "RN License, Valid driver's license",
    "is_active": true,
    "created_at": "2026-05-20T10:00:00Z"
  }
]
```

### Get Single Job
**GET** `/api/admin/jobs/{id}`

Get details of a single job posting.

**Response:**
```json
{
  "id": "uuid",
  "title": "Registered Nurse - Home Health",
  "type": "Full-time",
  "location": "Boston, MA",
  "description": "Provide in-home nursing care...",
  "requirements": "RN License, Valid driver's license",
  "is_active": true,
  "created_at": "2026-05-20T10:00:00Z"
}
```

### Create Job
**POST** `/api/admin/jobs`

Create a new job posting.

**Body:**
```json
{
  "title": "Physical Therapist",
  "type": "Part-time",
  "location": "Cambridge, MA",
  "description": "Provide PT services to patients in their homes",
  "requirements": "PT License, Current CPR certification",
  "is_active": true
}
```

**Response:** (201 Created)
```json
{
  "id": "new-uuid",
  "title": "Physical Therapist",
  ...
}
```

### Update Job
**PUT** `/api/admin/jobs/{id}`

Update job posting details.

**Body:**
```json
{
  "title": "Physical Therapist - Boston Area",
  "location": "Boston, MA",
  "description": "Updated description with more details"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Physical Therapist - Boston Area",
  ...
}
```

### Publish/Unpublish Job
**POST** `/api/admin/jobs/{id}/publish`

Toggle job posting visibility (publish or unpublish).

**Body:**
```json
{
  "is_active": true
}
```

**Response:**
```json
{
  "message": "Job published",
  "data": {
    "id": "uuid",
    "is_active": true,
    ...
  }
}
```

### Delete Job
**DELETE** `/api/admin/jobs/{id}`

Delete a job posting.

**Response:**
```json
{
  "message": "Job deleted successfully"
}
```

---

## Job Applications Management

### List All Applications
**GET** `/api/admin/applications`

List all job applications.

**Response:**
```json
[
  {
    "id": "uuid",
    "job_id": "uuid",
    "applicant_name": "John Applicant",
    "email": "john@example.com",
    "phone": "555-0123",
    "resume_url": "https://...",
    "status": "received",
    "created_at": "2026-05-25T10:00:00Z"
  }
]
```

### Get Single Application
**GET** `/api/admin/applications/{id}`

Get details of a single application.

**Response:**
```json
{
  "id": "uuid",
  "job_id": "uuid",
  "applicant_name": "John Applicant",
  "email": "john@example.com",
  "phone": "555-0123",
  "resume_url": "https://...",
  "status": "received",
  "created_at": "2026-05-25T10:00:00Z"
}
```

### Create Application (Manual)
**POST** `/api/admin/applications`

Create a new application entry manually.

**Body:**
```json
{
  "job_id": "uuid",
  "applicant_name": "Jane Nurse",
  "email": "jane@example.com",
  "phone": "555-5555",
  "resume_url": "https://storage.../resume.pdf",
  "status": "received"
}
```

**Response:** (201 Created)
```json
{
  "id": "new-uuid",
  "applicant_name": "Jane Nurse",
  ...
}
```

### Update Application
**PUT** `/api/admin/applications/{id}`

Update application details or status.

**Body:**
```json
{
  "status": "shortlisted",
  "phone": "555-1234"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "shortlisted",
  ...
}
```

### Approve Application (Convenience)
**POST** `/api/admin/applications/{id}/approve`

Approve an application.

**Body:** (empty)

**Response:**
```json
{
  "message": "Application approved",
  "data": {
    "id": "uuid",
    "status": "approved",
    ...
  }
}
```

### Reject Application (Convenience)
**POST** `/api/admin/applications/{id}/reject`

Reject an application with reason.

**Body:**
```json
{
  "reason": "Does not meet qualifications"
}
```

**Response:**
```json
{
  "message": "Application rejected",
  "data": {
    "id": "uuid",
    "status": "rejected",
    "reject_reason": "Does not meet qualifications",
    ...
  }
}
```

### Delete Application
**DELETE** `/api/admin/applications/{id}`

Delete an application.

**Response:**
```json
{
  "message": "Application deleted successfully"
}
```

---

## Error Handling

All endpoints follow standard HTTP status codes:

- **200 OK** - Request succeeded
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request parameters
- **403 Forbidden** - User is not authenticated or not an admin
- **404 Not Found** - Resource does not exist
- **500 Internal Server Error** - Server error

Error responses:
```json
{
  "error": "Description of what went wrong"
}
```

---

## Usage Examples

### Approve a referral
```bash
curl -X POST http://localhost:5000/api/admin/referrals/uuid-123/approve \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

### Create a new job
```bash
curl -X POST http://localhost:5000/api/admin/jobs \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nurse Manager",
    "type": "Full-time",
    "location": "Boston",
    "description": "Lead nursing team",
    "is_active": true
  }'
```

### Promote user to admin
```bash
curl -X POST http://localhost:5000/api/admin/users/user-uuid/assign-admin \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

### Delete a contact
```bash
curl -X DELETE http://localhost:5000/api/admin/contacts/uuid-456 \
  -H "Authorization: Bearer {token}"
```

---

## Summary of CRUD Operations

| Entity | Create | Read | Update | Delete | Special |
|--------|--------|------|--------|--------|---------|
| **Referrals** | ✅ POST | ✅ GET | ✅ PUT | ✅ DELETE | Approve/Reject |
| **Contacts** | ✅ POST | ✅ GET | ✅ PUT | ✅ DELETE | - |
| **Jobs** | ✅ POST | ✅ GET | ✅ PUT | ✅ DELETE | Publish/Unpublish |
| **Applications** | ✅ POST | ✅ GET | ✅ PUT | ✅ DELETE | Approve/Reject |
| **Admin Users** | - | ✅ GET | - | - | Assign/Remove Role |

All admin operations are protected by admin authentication middleware.
