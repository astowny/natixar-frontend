#!/bin/bash

# Build the static site
(cd web-src; hugo --gc --minify)

# Build the anima hello world web app in React
#(cd hello-world && yarn install && yarn build)
#(cd hello-world; npm run build)

# Build Collabrium's front end
(cd react-app && yarn install && yarn build)


