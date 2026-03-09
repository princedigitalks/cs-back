# Quotation API Documentation

## Endpoints

### 1. Create Quotation
**POST** `/api/v1/quotation/create`

**Request Body:**
```json
{
  "lead": "lead_id_here",
  "price": 10000
}
```

**Response:**
- Automatically calculates:
  - withoutGst = price
  - IGST = 18% of price
  - CGST = 9% of price
  - SGST = 9% of price
  - withGst = price + IGST
  - grandTotal = withGst

### 2. Get All Quotations
**GET** `/api/v1/quotation?page=1&limit=10`

### 3. Get Quotation by ID
**GET** `/api/v1/quotation/:id`

### 4. Get Quotations by Lead ID
**GET** `/api/v1/quotation/lead/:leadId`

### 5. Update Quotation
**PUT** `/api/v1/quotation/:id`

**Request Body:**
```json
{
  "price": 15000
}
```
- GST calculations automatically update

### 6. Delete Quotation
**DELETE** `/api/v1/quotation/:id`

## Database Schema

```javascript
{
  lead: ObjectId (ref: Lead),
  price: Number,
  withoutGst: Number,
  withGst: Number,
  igst: Number (18%),
  cgst: Number (9%),
  sgst: Number (9%),
  grandTotal: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Notes
- All endpoints require authentication (authMiddleware)
- Lead must exist before creating quotation
- GST calculations are automatic
- Lead details are populated with category and leadStatus
