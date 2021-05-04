https://online-checkers2.herokuapp.com/

# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku
*Don't do the Heroku step for assignments, you only need to deploy for Project 2*
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

##Eslint
1. react/no-array-index-key: allowed by project 2
2. react-hooks/exhaustive-deps: allowed by project 2
3. react/jsx-filename-extension: allowed by project 2
    
4. react/prop-types: group needs to decide if we want this syntax or not, will be resolved by sprint 2
5. no-console: this will stay until sprint 2 for debugging
    
6. import/no-extraneous-dependencies: will be removed later

##Pylint
All allowed errors from project 2

