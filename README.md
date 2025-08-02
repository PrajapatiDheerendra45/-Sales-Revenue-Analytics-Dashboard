# Sales & Revenue Analytics Dashboard

A comprehensive full-stack analytics dashboard for sales and revenue data visualization, built with React, Node.js, Express, MongoDB, and Redux Toolkit.

## Features

### Backend (Node.js + Express + MongoDB)
- **RESTful API** with comprehensive endpoints
- **MongoDB** database with optimized schemas and indexes
- **File Upload** support for CSV and Excel files
- **Data Processing** with validation and error handling
- **Analytics Endpoints** for trends, summaries, and filtering
- **Security** with input validation and error handling

### Frontend (React + Redux Toolkit + MUI)
- **Modern UI** with Material-UI components
- **Interactive Charts** using Recharts library
- **Real-time Filtering** by date, category, region, and product
- **File Upload** with drag-and-drop functionality
- **Responsive Design** for all screen sizes
- **State Management** with Redux Toolkit

### Analytics Features
- **Revenue Trends** (daily, weekly, monthly)
- **Product-wise Sales** bar chart
- **Regional Revenue** pie chart
- **Summary Cards** with key metrics
- **Filtered Data Table** with pagination
- **CSV/Excel Import** with data validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/PrajapatiDheerendra45/-Sales-Revenue-Analytics-Dashboard.git>
   cd sales-analytics-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure MongoDB**
   - Start MongoDB service
   - Update `backend/config.env` with your MongoDB connection string:
     ```
     MONGODB_URI=mongodb://localhost:27017/sales_analytics
     ```

4. **Start the application**
   ```bash
   # From the root directory
   npm run dev
   ```
   
   This will start both backend (port 5000) and frontend (port 3000) simultaneously.

## API Endpoints

### Sales Analytics
- `GET /api/sales/summary` - Get total sales and revenue summary
- `GET /api/sales/trends` - Get revenue trends (daily/weekly/monthly)
- `GET /api/sales/products` - Get product-wise sales data
- `GET /api/sales/regions` - Get revenue by region
- `GET /api/sales/filter` - Filter sales data with pagination
- `GET /api/sales/categories` - Get unique categories
- `GET /api/sales/regions-list` - Get unique regions

### File Upload
- `POST /api/upload/file` - Upload CSV/Excel file

## Data Format

The application expects CSV or Excel files with the following columns:

| Column | Type | Description |
|--------|------|-------------|
| date | Date | Sales date (YYYY-MM-DD format) |
| product | String | Product name |
| category | String | Product category |
| region | String | Sales region |
| quantity | Number | Units sold |
| price | Number | Unit price |
| revenue | Number | Total revenue (quantity × price) |

### Sample CSV Format
```csv
date,product,category,region,quantity,price,revenue
2024-01-01,Laptop,Electronics,North,5,1200,6000
2024-01-02,Smartphone,Electronics,South,3,800,2400
2024-01-03,Tablet,Electronics,East,2,500,1000
```

## Usage

1. **Upload Data**
   - Navigate to the "Upload Data" page
   - Drag and drop or select a CSV/Excel file
   - The system will validate and import the data

2. **View Dashboard**
   - The main dashboard shows key metrics and charts
   - Use filters to analyze specific data ranges
   - Charts update automatically based on selected filters

3. **Filter Data**
   - Date range: Select start and end dates
   - Category: Filter by product category
   - Region: Filter by sales region
   - Product: Search for specific products
   - Period: Choose trend period (daily/weekly/monthly)

## Project Structure

```
sales-analytics-dashboard/
├── backend/
│   ├── models/
│   │   └── Sales.js
│   ├── routes/
│   │   ├── sales.js
│   │   └── upload.js
│   ├── config.env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── RevenueTrendChart.js
│   │   │   │   ├── ProductSalesChart.js
│   │   │   │   └── RegionRevenueChart.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Filters.js
│   │   │   ├── Header.js
│   │   │   ├── SalesTable.js
│   │   │   ├── SummaryCards.js
│   │   │   └── UploadPage.js
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── salesSlice.js
│   │   │   │   └── uploadSlice.js
│   │   │   └── index.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Multer** - File upload middleware
- **csv-parser** - CSV file processing
- **xlsx** - Excel file processing
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **Material-UI** - UI component library
- **Recharts** - Charting library
- **Axios** - HTTP client
- **date-fns** - Date utility library

## Development

### Running in Development Mode
```bash
# Start both backend and frontend
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client
```

### Building for Production
```bash
# Build frontend
npm run build
```

## Error Handling

The application includes comprehensive error handling:

- **File Upload Errors**: Invalid file types, size limits, data validation
- **API Errors**: Network issues, database errors, validation failures
- **Frontend Errors**: Loading states, error messages, fallback UI

## Performance Optimizations

- **Database Indexes**: Optimized queries with compound indexes
- **Pagination**: Efficient data loading with pagination
- **Caching**: Redux state management for data caching
- **Lazy Loading**: Components load on demand
- **Responsive Charts**: Optimized chart rendering

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 