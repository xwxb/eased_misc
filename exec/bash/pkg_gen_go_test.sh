#!/bin/bash

# Get the current package name
PACKAGE_NAME=$(go list -f '{{.Name}}' ./...)

for FILE in $(find . -name '*.go' -not -name '*_test.go'); do
  TEST_FILE="${FILE%.*}_test.go"
  if [[ ! -f "$TEST_FILE" && ${FILE%.*} != *_test ]]; then
    touch "$TEST_FILE"
    echo "Created $TEST_FILE"
  fi
done