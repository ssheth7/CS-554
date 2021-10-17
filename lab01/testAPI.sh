#!/bin/bash
printf 'Creating a new Account\n'
curl -s -X POST -H "Content-Type: application/json" \
    -d '{"username": "hello", "password": "123", "name" : "123"}' \
    http://localhost:3000/blog/signup | jq

printf 'Logging in with new account\n'
curl -s -X POST -H "Content-Type: application/json" \
    -d '{"username": "hello", "password": "123"}' \
    -c cookie.txt http://localhost:3000/blog/login | jq

printf 'Posting an article\n'
postData=$(curl -s -b cookie.txt -X POST -H "Content-Type: application/json"\
    -d '{"title": "My first article", "body": "akfjneaf"}' \
    http://localhost:3000/blog/)
echo "$postData" | jq
articleID=$(echo "$postData" | jq  ._id | bc)

printf 'Putting an article\n'
curl -s -b cookie.txt -X PUT -H "Content-Type: application/json"\
    -d '{"title": "My first article - updated", "body": "Fixed"}' \
    http://localhost:3000/blog/$articleID | jq

printf 'Patching an article\n'
curl -s -b cookie.txt -X PATCH -H "Content-Type: application/json"\
    -d '{"body": "Another edit"}' \
    http://localhost:3000/blog/$articleID | jq

printf 'Posting a comment\n'
commentData=$(curl -s -b cookie.txt -X POST -H "Content-Type: application/json"\
    -d '{"comment": "My first comment"}' \
    http://localhost:3000/blog/$articleID/comments)
echo "$commentData" | jq
commentID=$(echo "$commentData" | jq ._id | bc)


printf 'Logging out\n'
curl -s -b cookie.txt http://localhost:3000/blog/logout | jq

printf 'Creating a second Account\n'
curl -s -X POST -H "Content-Type: application/json" \
    -d '{"username": "hackermans", "password": "321", "name" : "beep"}' \
    http://localhost:3000/blog/signup | jq

printf 'Logging in with second account\n'
curl -s -X POST -H "Content-Type: application/json" \
    -d '{"username": "hackermans", "password": "321"}' \
    -c cookie.txt http://localhost:3000/blog/login | jq

printf 'Checking post /blog/\n'
curl -s -b cookie.txt -X POST -H "Content-Type: application/json"\
    -d '{"title": "", "body": "   "}' \
    http://localhost:3000/blog/ | jq

# printf 'Attempting to patch another users article\n'
# curl -s -b cookie.txt -X PUT -H "Content-Type: application/json"\
#     -d '{"title": "Taking over your article", "body": "woohoo"}' \
#     http://localhost:3000/blog/$articleID | jq

# printf 'Attempt #2 at patching another users article\n'
# curl -s -b cookie.txt -X PATCH -H "Content-Type: application/json"\
#     -d '{"body": "Another edit"}' \
#     http://localhost:3000/blog/$articleID | jq

printf 'Adding a comment to another users article\n'
curl -s -b cookie.txt -X POST -H "Content-Type: application/json"\
    -d '{"comment": "   "}' \
    http://localhost:3000/blog/$articleID/comments | jq


# printf 'Logging out\n'
# curl -s -b cookie.txt http://localhost:3000/blog/logout | jq
printf '\n'
