# next-train

A simple next departure/arrival display for Blair Station.

## Setup

A `.env.local` file must be created with the following variables included from the OC Transpo API:
```env
REACT_APP_APP_ID=<app id>
REACT_APP_API_KEY=<api key>
```

Run `yarn` to install all required dependencies.

## Launching

Run `yarn start` from the command line, and then navigate to `http://localhost:3000` in your browser.

## Usage

The direction of travel (departure/arrival) can be controlled using the `direction` query parameter.

`http://localhost:3000?direction=departure` for departure times.  
`http://localhost:3000?direction=arrival` for arrival times.  
