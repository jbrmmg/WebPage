# JBR-397 Add page to search for documents

Add a new tab for searching the backup database for documents.

# Criteria

Allow user to specify the following criteria, all criteria are optional but at least one must be specified.

## Filename

Specify a filename with wildcards * and ?, e.g. fred*.m?? will find filenames such as fred322.m94 and fredojhg.m93.

## Date Range

A date range - specify a from and to date - can be open ended.

## Size Range

A size range - specify a min and max - can be open ended.

## Expiry Date

A date range - specify a from and to date - can be open ended.

## Labels

Enter a list of strings.

## Location

Specify a north, west, south and east co-ordinate.  UI should display a leaflet map control - user will adjust the view and this will form the location bounds of the search criteria.

# Display

View should have two parts; the search citeria and the list of results.

## Criteria Section

Fields to enter the search criteria and then a search button, buttons to move through pages, control to select page size (25,50,100).

## Results

Should display basic list of details, including filename, date and size.

# Technical details

The end point is at backup/search

## Request

Request has the following format:

{
    "page": 0,
    "pageSize": 0,
    "filename": "string",
    "dateFrom": "2026-08-13T08:43:41.420Z",
    "dateTo": "2026-08-13T08:43:41.420Z",
    "sizeMin": 0,
    "sizeMax": 0,
    "expiryFrom": "2026-08-13T08:43:41.420Z",
    "expiryTo": "2026-08-13T08:43:41.420Z",
    "labels": \[
        "string"
    ],
    "location": {
        "south": 0.1,
        "west": 0.1,
        "north": 0.1,
        "east": 0.1
    }
}

## Response

The response has the following format:

{
    "page": 0,
    "pageSize": 0,
    "totalCount": 0,
    "results": \[
        {
            "id": 0,
            "name": "string",
            "fullFilename": "string",
            "path": "string",
            "locationName": "string",
            "date": "2026-08-13T08:43:41.421Z",
            "size": 0,
            "expiry": "2026-08-13T08:43:41.421Z",
            "icon": "string",
            "md5": "string",
            "latitude": 0.1,
            "longitude": 0.1,
            "video": true,
            "image": true
        }
    ]
}