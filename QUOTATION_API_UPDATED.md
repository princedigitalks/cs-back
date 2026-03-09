# Quotation API - Updated Documentation

## Request Body Structure

### Create Quotation
**POST** `/api/v1/quotation/create`

**Case 1: Without GST**
```json
{
  "lead": "lead_id_here",
  "price": 10000,
  "taxType": "withoutGst",
  "grandTotal": "10000"
}
```
- No tax calculated
- gstType automatically set to "none"

**Case 2: With GST - IGST (18%)**
```json
{
  "lead": "lead_id_here",
  "price": 10000,
  "taxType": "withGst",
  "gstType": "igst",
  "grandTotal": "11800"
}
```
- IGST = 18% of price
- Backend calculates: igst = 1800

**Case 3: With GST - CGST+SGST (9%+9%)**
```json
{
  "lead": "lead_id_here",
  "price": 10000,
  "taxType": "withGst",
  "gstType": "cgst_sgst",
  "grandTotal": "11800"
}
```
- CGST = 9% of price
- SGST = 9% of price
- Backend calculates: cgst = 900, sgst = 900

### Update Quotation
**PUT** `/api/v1/quotation/:id`

```json
{
  "price": 15000,
  "taxType": "withGst",
  "gstType": "cgst_sgst",
  "grandTotal": "17700"
}
```

## Database Schema

```javascript
{
  lead: ObjectId (ref: Lead),
  price: Number,
  taxType: String (enum: ["withoutGst", "withGst"]),
  gstType: String (enum: ["igst", "cgst_sgst", "none"]),
  igst: Number,
  cgst: Number,
  sgst: Number,
  grandTotal: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Logic

```javascript
// Example calculation
const price = 10000;
const taxType = "withGst"; // or "withoutGst"
const gstType = "igst"; // or "cgst_sgst"

let grandTotal;
if (taxType === "withoutGst") {
  grandTotal = price.toString();
} else if (gstType === "igst") {
  grandTotal = (price + (price * 0.18)).toString();
} else if (gstType === "cgst_sgst") {
  grandTotal = (price + (price * 0.18)).toString();
}
```

## Notes
- taxType is required
- gstType required only when taxType = "withGst"
- grandTotal is String type (frontend calculated)
- Backend calculates individual tax amounts (igst, cgst, sgst)
