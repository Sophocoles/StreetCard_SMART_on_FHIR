# =====================================
# STREETCARD BEGIN
Follow the README instructions for the react-fhir-sample-app(see below STREETCARD README) and reference the troubleshooting list for issues

Troubleshooting
    For step 1: Just copy paste the .env file and change the name to .env.local

    For step 2: Yarn needed an update prior to launch. This will take some time to install.

        In project repo(I used Command Prompt Admin)

            yarn upgrade

            yarn add yarn

    For step 3: yarn start (This should open the webapp in your desktop)


### TODO

# Marcy
    Register app with Cerner and Epic

    Ensure we can launch in either Cerner or Epic using manual Patient Selection
        Current problem: Unable to view Cerner

    Implement account creation
        Use GitHub to source Account Creation code that uses Django
            tutorial link: https://www.youtube.com/watch?v=QnviZrFr6co
            GH: https://github.com/nusrat-borsha/Django-custom-registration
        3 or 4 types of accounts to create
            Client
            Provider
            Facilitator
            Intake Worker**
            Only needs basic patient view for check-in


# Indira
    Scour old (tier 1) Django code for database
        This would only hold our Client data

    Create Provider data table

    Create Facilitator data table

    Create endpoint table
        Reference Lantern project resources
            Lantern project link: https://lantern.healthit.gov/
            Backend GH: https://github.com/onc-healthit/lantern-back-end
                Do we need to add this to our code? 

    Connect via relational (Or whatever Django supports) DB

# Chris
    Create code that can populate \src\config.json with custom JSON code using a search on our HIMS/Client database
        How to Query a Database and Write the Data to JSON
        link: https://www.goanywhere.com/managed-file-transfer/more/tutorials/how-to-query-a-database-and-write-the-data-to-json

    Create landing page using React
        I am a...

            StreetCard Client
                Log-in
                    Display basic patient profile
                    Link to tier 1?***
                Create account
                    Required
                        StreetCardID#
                            Verified using DB that tracks SCID#'s
                        
            Provider
                Log-in
                    Add StreetCardID#
                    View patients and StreetCardID#'s
                    Select a patient
                        View patient's locations
                Create account
                    Required
                        StreetCardID# 
                            Tied to at least one patient

            StreetCard Facilitator
                In charge of SC Client creation
                Log-in
                    Add new Client
                        Search endpoint database to see if it is accessible
                    Add changes to client
                        Add endpoint
                Create account

            Intake Worker**
                Log-in
                Create account

        Text entry box to input StreetCardID#
            Immediatly display patient profile

# Nick
    Replace old LOINC code w/ new one that grabs all patient data 
        code inside \src\components\Chart.js
        link: https://loinc.org/55188-7/

    Display the head of available data from LOINC code
        Checkboxes to select the data to get a detailed view of

    Display selected patient data

    Download displayed data in CSV, XLS, PDF...


### QUESTIONS
    **Okay to show patient profile upon plugging in StreetCardID#? (To skip account creation for intake workers)

    ***What do we want to do about the old code?
        Do we know anything about the new code that is being worked on?


Readme for react fhir sample app below
# STREETCARD END
# =====================================



# Introduction
This Github Project takes the awesome ["Advanced React Example"](https://codesandbox.io/s/fhir-client-react-react-router-context-0q3n8)
 found at the [client-js](https://github.com/smart-on-fhir/client-js) project and extends it in the following ways.

1.  Move the code from the codepensandbox into a stand alone app created via create-react-app and managed with yarn
2.  Extends it to work with multiple servers both open and authenticated.
    1.  Additional servers or patients can be added by extending the config.json file
3.  Upgrades the client-js library to the latest

# Test using the Public Servers

### Step 1

    cp .env .env.local

### Step 2
Start this example app

```shell script
yarn start
```

### Step 3
Open your browser to this example app at `http://localhost:9000` and choose 'smarthealthit' from the pulldown

### Step 4
Open your browser to this example app at `http://localhost:9000` and choose 'publicHapiServer' from the pulldown

# Run Open Servers Locally

## localHapiServer

### Step 1

Run the HAPI server locally (see also https://hub.docker.com/r/smartonfhir/hapi and https://github.com/smart-on-fhir/hapi)
```shell script
docker run -p 8000:8080 smartonfhir/hapi:r2-smart
# .. go get coffee
```

### Step 2
Open your browser to this example app at `http://localhost:9000` and choose 'localHapiServer' from the pulldown

## smartdev

### Step 1

Run the smartdev stack locally (see also https://github.com/smart-on-fhir/smart-dev-sandbox)
```shell script
git clone https://github.com/smart-on-fhir/smart-dev-sandbox.git
cd smart-dev-sandbox 
docker-compose up
# .. go to lunch
```

### Step 2
Open your browser to this example app at `http://localhost:9000` and choose 'smartdev' from the pulldown

# Using Cerner and Epic sandboxes

See `src/config.json` for the JSON configuration per site that is read by this application to populate the selector 
you see when you first browse to this example app.  The Cerner and Epic examples need a little extra configuration 
before they will work correctly.

## Cerner

### Step 1
Create your Cerner Sandbox account at the [Cerner Developer Console][7]

### Step 2
Create an App and Set the redirect URI to `http://localhost:9000/redirect`

### Step 3
Set your APP ID in .env.local you created above

```
REACT_APP_CLIENT_ID_cerner=<Your APP ID>
```

### Step 4
Open your browser to this example app at `http://localhost:9000` and choose cerner from the pulldown

### Step 5
Login in to the Cerner Sandbox with a sample patient

    Sample User: timmysmart
    Password: Cerner01

>**NOTE:** The cerner sample account does not have chart-able observation data
>so you will only see the patient banner after you are redirected back to the app

## Epic

### Step 1
Create your Epic Sandbox account at the [Epic Developer Console][8]

### Step 2
Create an App and Set the redirect URI to `http://localhost:9000/redirect`

>**IMPORTANT:** When creating a new app or any time you change the redirect URI with Epic, 
>you must wait until the next day for the changes to take effect (on occasion even longer..)

### Step 3
Set your APP ID in .env.local you created above

```
REACT_APP_CLIENT_ID_epic=<Your APP ID>
```

### Step 4
Open your browser to this example app at `http://localhost:9000` and choose 'epic' from the pulldown

### Step 5
Login in to the Epic Sandbox with a sample patient

    Sample User: fhirjson
    Password: epicepic1

>**NOTE:** The cerner sample account does not have chart-able observation data
>so you will only see the patient banner after you are redirected back to the app


# References

* [client-js GitHub Project][1]
* [client-js documentation][2]
* [client-js Advanced React Example][3]
* [DockerHub Hapi Images][4]
* [GitHub Repo for HAPI images][5]
* [GitHub repo for Smartdev Sandbox][6]
* [Cerner Developer Console][7]
* [Epic Developer Console][8]

[1]: https://github.com/smart-on-fhir/client-js
[2]: http://docs.smarthealthit.org/client-js/
[3]: https://codesandbox.io/s/fhir-client-react-react-router-context-0q3n8
[4]: https://hub.docker.com/r/smartonfhir/hapi
[5]: https://github.com/smart-on-fhir/hapi
[6]: https://github.com/smart-on-fhir/smart-dev-sandbox
[7]: https://code.cerner.com/developer/smart-on-fhir/apps
[8]: https://fhir.epic.com/Developer/Apps