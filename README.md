# Stock Price View Application

## Overview 
An application to access and manage data from the Bombay Stock
Exchange (BSE) Using Nodejs.

## Requirements

- Node.js
- MongoDB
- Redis
- Python (for running the script and download data)

## Getting Started

1. Clone the Repository

```
git clone <repository-url>
cd <repository-folder>
```
2. Install Dependencies

```
npm install

```
3. Configure MongoDB

Make sure MongoDB is running. You can modify the MongoDB connection URI in index.js if needed.

4. Start Application
```
nodemon index.js
```
You can visit the application on `localhost:3000`

5. Python Script

To Download data from the BSE site a python script is written in script.py
The Python script automatically runs whenever index.js starts.
To further add refresh functionality to update data from equity bhav copy zip an endpoint is futher created to refresh and download the data again.

- Endpoint:`/refresh`

6. DockerFile
To run the file via docker Edit the docker-compose.yml file and enter your MongoDB Root username and password.
Build and run the Docker container:
```
docker compose build

docker-compose up
```

## API ENDPOINTS

1) Get Top 10 Stocks
- Endpoint: `GET stocks/top-stocks`
- Sample Response Body:
```
[
{
        "_id": "65ae4938738a70a319a6f6fa",
        "SC_CODE": 500023,
        "SC_NAME": "ASIANHOTNR",
        "OPEN": 198.05,
        "HIGH": 198.05,
        "LOW": 198.05,
        "CLOSE": 198.05,
        "date": "2024-01-20"
    },
 ...
]
```
2)Add to Favorites
- EndPoint: `POST stocks/favourites`
- Request Body:

```
    {
        "SC_CODE": 500023,
        "SC_NAME": "ASIANHOTNR",
        "OPEN": 198.05,
        "HIGH": 198.05,
        "LOW": 198.05,
        "CLOSE": 198.05,
        "date": "2024-01-20"
    }
```

3) Get Favorites
- Endpoint: `GET stocks/favourites`
- Sample Response Body:

```
[
    {
        "_id": "65ae71be3491301f2d70dda3",
        "code": "500023",
        "name": "ASIANHOTNR",
        "open": 198.05,
        "high": 198.05,
        "low": 198.05,
        "close": 198.05,
        "date": "2024-01-22",
     
    }
]

```


4)Remove from Favorites
- EndPoint: `DELETE stocks/favourites`
- Request Body: 

```
    {
        
        "SC_CODE": 500023,
        "SC_NAME": "ASIANHOTNR",
        "OPEN": 198.05,
        "HIGH": 198.05,
        "LOW": 198.05,
        "CLOSE": 198.05,
        "date": "2024-01-20"
    }
```

5) Get Stock Price History
- EndPoint:`GET stocks/history`
- Sample Request Body:
```
    {
        "SC_NAME": "ASIANHOTNR"
    }

```
- Sample Response Body:
```
[
    {
        "_id": "65ae4938738a70a319a6f6f2",
        "SC_NAME": "ABB LTD.",
        "OPEN": 4819.1,
        "date": "2024-01-20"
    },
    {
        "_id": "65ae4a87d4938eb48bb9acbb",
        "SC_NAME": "ABB LTD.",
        "OPEN": 4779.25,
        "date": "2024-01-19"
    }

]
```

6) Get Stock by Name
- Endpoint: GET stocks/:name
- Sample URL `/stocks/ASIANHOTNR  `
- Sample Response Body:
```
{
    "_id": "65ae4938738a70a319a6f6fa",
    "SC_CODE": 500023,
    "SC_NAME": "ASIANHOTNR",
    "OPEN": 198.05,
    "HIGH": 198.05,
    "LOW": 198.05,
    "CLOSE": 198.05,
    "date": "2024-01-20"
}

```
