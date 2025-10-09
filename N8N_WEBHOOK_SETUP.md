# n8n Webhook Setup Guide for Lookup Form

## Overview
The lookup form allows users to search for existing projects by Project ID and edit their data. This requires two n8n webhooks:

1. **GET Webhook** - To retrieve project data
2. **POST/UPDATE Webhook** - To save edited project data

---

## 1. GET Webhook (Retrieve Project Data)

### Webhook Configuration

**URL Format:**
```
https://jamlive.app.n8n.cloud/webhook/jam-people-lookup?projectId=ES25373
```

### How it Works
- When a user enters a project ID (e.g., "ES25373") and clicks "Search"
- The frontend makes a GET request to your n8n webhook
- The project ID is sent as a **query parameter**: `?projectId=ES25373`

### Expected Response Format

Your n8n webhook should return a JSON object with the following structure:

```json
{
  "clientName": "Example Client",
  "projectName": "Annual Conference 2025",
  "eventType": "Conference",
  "contactPerson": "John Smith",
  "clientContactNo": "+971501234567",
  "clientEmail": "contact@example.com",
  "quoteSource": "JAM UAE",
  "xeroContact": "Wilson Fletcher Limited",
  "location": "Dubai World Trade Centre",
  "startDate": "2025-03-15",
  "endDate": "2025-03-17",
  "accountManagerInitials": "AB",
  "roles": [
    {
      "role": "Event Manager",
      "quantity": "2",
      "gender": "Any",
      "language": "English, Arabic",
      "hourlyRate": "150",
      "fixedOutgoingRate": "120"
    },
    {
      "role": "Technician",
      "quantity": "5",
      "gender": "Male",
      "language": "English",
      "hourlyRate": "80",
      "fixedOutgoingRate": "65"
    }
  ],
  "timeSlots": {
    "2025-03-15": {
      "startTime": "09:00",
      "endTime": "18:00"
    },
    "2025-03-16": {
      "startTime": "09:00",
      "endTime": "18:00"
    },
    "2025-03-17": {
      "startTime": "09:00",
      "endTime": "15:00"
    }
  }
}
```

### n8n Workflow Steps (Example)

1. **Webhook Trigger** (GET method)
   - Path: `/jam-people-lookup`
   - Method: GET
   - Extract query parameter: `{{ $json.query.projectId }}`

2. **Database/Airtable Lookup**
   - Search for record where Project ID = `{{ $json.query.projectId }}`
   
3. **Format Response**
   - Map your database fields to the expected JSON structure above
   - Return the formatted JSON

4. **Error Handling**
   - If project not found, return 404 status code
   - The frontend will show "Project not found" message

---

## 2. POST/UPDATE Webhook (Save Edited Data)

### Webhook Configuration

**URL:**
```
https://jamlive.app.n8n.cloud/webhook/jam-people-update
```

### How it Works
- After searching and editing project data, user clicks "Update Project"
- The frontend sends a POST request with all form data including the project ID

### Request Body Format

The frontend sends a JSON object with this structure:

```json
{
  "projectId": "ES25373",
  "clientName": "Example Client",
  "projectName": "Annual Conference 2025",
  "eventType": "Conference",
  "contactPerson": "John Smith",
  "clientContactNo": "+971501234567",
  "clientEmail": "contact@example.com",
  "quoteSource": "JAM UAE",
  "xeroContact": "Wilson Fletcher Limited",
  "location": "Dubai World Trade Centre",
  "startDate": "2025-03-15",
  "endDate": "2025-03-17",
  "accountManagerInitials": "AB",
  "roles": [
    {
      "id": "1",
      "role": "Event Manager",
      "quantity": "2",
      "gender": "Any",
      "language": "English, Arabic",
      "hourlyRate": "150",
      "fixedOutgoingRate": "120"
    }
  ],
  "timeSlots": {
    "2025-03-15": {
      "startTime": "09:00",
      "endTime": "18:00"
    }
  }
}
```

### n8n Workflow Steps (Example)

1. **Webhook Trigger** (POST method)
   - Path: `/jam-people-update`
   - Method: POST

2. **Extract Data**
   - Project ID: `{{ $json.body.projectId }}`
   - All other fields: `{{ $json.body }}`

3. **Update Database/Airtable**
   - Find record by Project ID
   - Update all fields with new data
   - Update related tables (roles, time slots)

4. **Update Other Platforms**
   - Update Xero
   - Update any other connected systems
   - Send notifications if needed

5. **Return Response**
   - Success: Return 200 status code with success message
   - Error: Return appropriate error code

---

## Testing the Integration

### Test the GET Webhook

1. Create a test project in your database with a known Project ID (e.g., "TEST001")
2. Open the lookup form in your app
3. Enter "TEST001" and click Search
4. Verify that all fields populate correctly

### Test the UPDATE Webhook

1. After retrieving a project, make some changes to the fields
2. Click "Update Project"
3. Check your database to confirm the changes were saved
4. Verify that changes propagated to other connected systems

---

## Troubleshooting

### Project Not Found Error
- Check that the Project ID exists in your database
- Verify the GET webhook is returning the correct field names
- Check n8n logs for errors

### Data Not Updating
- Verify the POST webhook URL is correct
- Check that the Project ID is being sent in the request body
- Review n8n logs to see if the webhook is receiving the data

### Fields Not Populating
- Ensure field names in the n8n response match exactly (case-sensitive)
- Check browser console for JavaScript errors
- Verify dates are in YYYY-MM-DD format
- Verify times are in HH:MM format (24-hour)

---

## Current Webhook URLs in Code

You can find and update these URLs in `/src/app/lookup-form/page.tsx`:

- **GET Webhook** (line ~450): 
  ```javascript
  const webhookUrl = `https://jamlive.app.n8n.cloud/webhook/jam-people-lookup?projectId=${encodeURIComponent(projectId)}`;
  ```

- **UPDATE Webhook** (line ~775):
  ```javascript
  const webhookUrl = 'https://jamlive.app.n8n.cloud/webhook/jam-people-update';
  ```

Update these URLs to match your actual n8n webhook endpoints.

---

## Security Considerations

1. **Authentication**: Consider adding authentication to your webhooks
2. **Validation**: Validate the Project ID format in n8n
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Data Sanitization**: Sanitize input data before storing

---

## Next Steps

1. Create the GET webhook in n8n to retrieve project data
2. Create the UPDATE webhook in n8n to save edited data
3. Update the webhook URLs in the code if they differ from the defaults
4. Test with a sample project
5. Monitor n8n execution logs for any errors

