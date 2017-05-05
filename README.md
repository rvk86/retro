# Installation
  * `sudo apt-get update`
  * `sudo apt-get install potrace`
  * `sudo apt-get install libcairo2-dev`
  * `sudo apt-get install python-cffi`
  * `sudo apt-get install libffi-dev`
  * `sudo apt-get install postgresql postgresql-client`
  * `sudo apt-get install postgresql-server-dev-9.3`
  * `sudo apt-get install libpq-dev`
  * `pip install -r requirements.txt`
  * `./manage.py migrate`

# Deployment notes
  * For the react build process to work run `heroku config:set NPM_CONFIG_PRODUCTION=false` so it also installs the dev deps.
