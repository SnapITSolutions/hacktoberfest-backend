# OAuth Related Endpoints
Here are all the endpoints relating to OAuth

## GET /api/oauth/login
Redirect users to this endpoint to take them to GitHub's OAuth login page.

## GET /api/oauth/callback?code=\<code>
This endpoint is used by GitHub when the user successfully logs-in.

## POST /api/oauth/logout
Logout the user