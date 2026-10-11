# Vayu Intel --- Air Quality Intelligence & Early Warning System

Vayu Intel is an air-quality intelligence dashboard designed to help
people understand pollution levels, explore monitoring data, view
forecasts, and access early-warning information for Indian cities.

This project is being developed as a 24-hour hackathon MVP. It aims to
bring air-quality observations, weather context, geospatial
visualization, forecasts, and public advisories into one interface.

> **Data transparency:** Values shown in the UI may be illustrative
> until connected to verified data sources. Never present demonstration
> data as live measurements or describe a forecast as validated unless
> it has been evaluated on historical observations.

## Key Features

-   **City overview:** Summary of AQI, pollutant readings, and active
    alerts.
-   **Live station monitoring:** Monitoring-station locations and
    available observations.
-   **48-hour AQI forecast:** Hourly predictions and forecast
    uncertainty, when implemented.
-   **Pollution intelligence:** Evidence-based explanations of
    conditions that may contribute to pollution.
-   **Alerts and advisories:** Warnings and general precautions based on
    applicable AQI categories.
-   **Data transparency:** Source, timestamp, freshness, coverage, and
    model-performance information.
-   **Responsive interface:** Designed for desktop presentations and
    mobile screens.

The exact functionality depends on which frontend and backend
integrations are enabled in the repository.

## Project Status

Label information according to its actual status:

-   **Live:** Retrieved from a verified external data source.
-   **Estimated:** Produced by a model or spatial estimation method.
-   **Demo:** Illustrative or synthetic data used for UI development.
-   **Unavailable:** Data could not be retrieved or is not integrated
    yet.

Do not report model accuracy, ward-level precision, or
source-apportionment percentages unless these have been measured and
validated.

## Suggested Architecture

The intended architecture is:

1.  **Frontend:** React with Vite, if used by the current project.
2.  **Backend:** Python with FastAPI.
3.  **Data processing:** Python, pandas, and validation utilities.
4.  **Visualization:** A map library such as Leaflet and chart
    components such as Recharts, depending on the implementation.
5.  **Forecasting:** Start with a baseline; add a trained model only
    when suitable historical data is available.

If the repository uses a different stack, update this section to match
the actual code.

## Potential Data Sources

-   **CPCB:** Indian air-quality monitoring information, subject to
    availability and access restrictions.
-   **OpenAQ:** Air-quality measurements available through its
    documented API.
-   **Weather provider:** Weather observations or forecasts from an
    accessible provider.
-   **Satellite products:** Optional future integration for atmospheric
    observations, with appropriate processing and interpretation.

Use documented endpoints and respect each provider's access rules, rate
limits, and licensing. Satellite aerosol measurements are not the same
as ground-level PM2.5. Nearby station measurements should not be
presented as exact ward-wide readings.

## Getting Started

### Prerequisites

Install the tools required by the components present in your repository:

-   Git
-   Node.js and npm for a React/Vite frontend
-   Python 3.10 or later for a FastAPI backend

Check the repository for `package.json`, `requirements.txt`,
`pyproject.toml`, and existing setup instructions before installing
dependencies.

### 1. Clone the repository

Replace the placeholders with your Git repository URL and folder name:

``` bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

### 2. Start the frontend

If the frontend uses React and Vite, move into the frontend directory
(if one exists) and run:

``` bash
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal. The default is often
`http://localhost:5173`.

If there is no separate frontend directory, run these commands in the
directory containing `package.json`.

### 3. Start the backend

If the backend uses FastAPI, open a second terminal and move into the
backend directory (if one exists). Create and activate a virtual
environment.

**Windows PowerShell:**

``` powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Then start the server using the module path that matches the repository.
For example, if the entry point is `app/main.py` and it defines `app`:

``` powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API will usually be available at `http://127.0.0.1:8000`, with
interactive documentation at `http://127.0.0.1:8000/docs`.

> These are example commands. Confirm the actual folder names,
> dependency file, and FastAPI import path in your repository before
> running them.

## Environment Variables

If an external service requires a key, store it in a local `.env` file
or the environment---not directly in frontend source code or committed
files.

Example only; use the variable names expected by your code:

``` env
AIR_QUALITY_API_KEY=
WEATHER_API_KEY=
VITE_API_BASE_URL=http://127.0.0.1:8000
```

-   Add `.env` to `.gitignore`.
-   Commit a `.env.example` containing variable names but no secrets.
-   Do not expose private API keys in browser-side code.
-   Some data sources may not require a key; check their current
    documentation.

## Forecasting and Validation

A responsible forecasting workflow should:

1.  Validate and timestamp historical observations.
2.  Establish a simple baseline forecast.
3.  Split data chronologically into training and evaluation periods.
4.  Avoid using future measurements as features.
5.  Report metrics such as MAE on a clearly defined holdout period.
6.  Compare the model with the baseline.
7.  Display uncertainty and data freshness alongside predictions.

A 48-hour forecast should not be called accurate until evaluated on
suitable real observations. Synthetic demo data is not evidence of
real-world forecasting performance.

## Source Intelligence and Alerts

Pollution-source explanations should distinguish measured evidence from
hypotheses. Weather and pollutant patterns may suggest possible
contributors, but they do not by themselves prove exact source
contributions.

Alert categories should follow the applicable CPCB National AQI
methodology. Health content should be general information, not a medical
diagnosis. Administrative actions such as school closures or
construction restrictions remain decisions for authorized officials.

## Troubleshooting

-   **Frontend will not start:** Check that Node.js is installed, run
    `npm install` in the directory containing `package.json`, and review
    terminal errors.
-   **Backend will not start:** Confirm the Python environment,
    installed requirements, and correct Uvicorn module path.
-   **Frontend cannot reach the backend:** Confirm the backend is
    running, check the configured API base URL, and configure CORS for
    the frontend origin.
-   **No live readings appear:** Check provider availability,
    credentials, network access, rate limits, and API responses. Do not
    silently replace failed live data with values presented as real.
-   **Map is blank:** Check map-library dependencies, tile-provider
    availability, network access, and any required configuration.
-   **Charts show demo values:** Confirm the UI clearly labels the
    values and whether live API integration is enabled.

## Roadmap

-   [ ] Verify local setup and document exact run commands.
-   [ ] Connect at least one verified air-quality data source.
-   [ ] Add weather observations or forecasts.
-   [ ] Complete the monitoring-station map and data-quality indicators.
-   [ ] Implement and evaluate a baseline 48-hour forecast.
-   [ ] Add evidence-based alerts and advisories.
-   [ ] Add ward boundaries only when suitable geospatial data is
    available.
-   [ ] Explore satellite-data integration and validated
    source-apportionment methods.
-   [ ] Add automated tests and deployment instructions.

## Contributing

Keep changes focused and test each feature before integrating it. Do not
commit API secrets, and document the source and meaning of new data
fields.

## License

Add the license selected for this project here. Before reusing code,
datasets, maps, or assets from another repository, check their
individual licenses and attribution requirements.
