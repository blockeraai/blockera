#!/bin/bash

# Define the JSON file and find command
json_file="cypress.env.json"
found_files=$(find ./packages/ -type f \( -name "*.build.e2e.cy.js" \) -print0 | jq -R -s -c 'split("\u0000")[:-1]')

# Use jq to modify the JSON file
jq --argjson foundFiles "$found_files" '
  .e2e.excludeSpecPattern = .e2e.specPattern
  | .e2e.specPattern = $foundFiles
' "$json_file" > temp.json && mv temp.json "$json_file"
