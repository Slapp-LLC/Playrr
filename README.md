![Portada](https://playrr.s3.us-west-1.amazonaws.com/Playrr.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBgaCXNhLWVhc3QtMSJHMEUCIQCBL67BI82fNLClzyUMCIqNm9mXdPaxM2EuNXsrgqWQcwIgI3fbJHURsvEvFBJp2F9UO1BuB%2FRMquR4rPxwblSSpIsq6AIIYRACGgwzOTEzNTk5MDcwMTEiDFsyGIqBeEtDTQ7OhCrFAoYonJ8aK8cFRHslfIVr8HtCWKtjNpjE3i9J7%2FK8r0GCv8y%2FcQV7ajKIe3xgH6m%2BhAilAA8oU4LRs19NsH1oBY6LGC7ugB2hlCLRBcVpKonPbjAt1sGG38Vhnc7NPJk0noOLdk0Xm%2B6j0ktfo1FqhvgkfpPOXh%2Bzso7rCbkNRy9%2BzNvZux22%2BM8k4C%2BPpLegrJd2sQ80Fe1rgPWeOzS%2Bo24FFnk2Fdqe%2BqTOF2x87ybICWIQeO5r8lFpdq1fm9HyGar7MD%2B79VAyMTtBkXM%2BiA6XvD7z1MhSbOVLDxYmswl%2FvIXy7lwwrLX29yOnPj%2FvCW48MY82EvRuWLjdJRRNwWIHbT%2BZ3GdJytw15uLdn6gVRUK5Bo4oE6xHccFgWC%2BTvGMrQB4rScRxtdUcgVPT%2B1VLoxhNwYc3tPKoXG9g01Of4pSF2bwwscWCpAY6swJYPAwVAvfzNFR3gD0aamH2mzlbmdoCO%2BSIhBcOnyqB%2FVa%2B2W%2BUdLrFKyjmHSg2WWlr7zhzgCS1HzN%2FWpTOYlCDsKmc9MswWjO7Bbdo%2F3gn2ucxGcGegjjaHnboYZGA78fMVSiZ%2Futjz%2BxcFJJtZLgszLP%2BWkvmJK3a6LZiVwFpf8GQ6lihk%2F4MouEhqjbdmuGm8Q5DTC%2FQ14AJuhxbBxme%2FKlL2RmWvjN%2BDGtvJZfL%2BXEPfkd5bHjHbl8cbzNcyAMaVG4JXWIVbziCd%2F8UAY6aPkP6zRc8s8N51kMS5C%2F2J28HL%2FNqgU3GgjeQYzXEQo5c6plEFSnjtYRXREZ1D6RdERHca5FLo7ycxXPUxElZ0iZq41nzjeNdnevVGko62xdsNcmNF3XYGFMLhdPOUr9Mc8uH&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230607T155514Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAVWHW6ITBT4WL62MA%2F20230607%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=93449735b008e417e611e31d6358b7da956783bc6eccf770e416a7da2ddbc9d3)
## Introduction

This API provides access to a range of sports-related features, including event search, event creation, and event management. It is designed to be used by clients that need to interact with the sports app's backend.

## Getting Started

To get started with the API, you will need to download and install the necessary dependencies. Once you have done this, you can run the API locally and start making requests. Additionally, create a .env file and ask your supervisor for the development environment keys.

## Entity Relationship Model
![ERM](https://playrr.s3.us-west-1.amazonaws.com/ERM-Reta.png)
## Authentication and Authorization

This API uses token-based authentication to secure endpoints. Users can obtain access tokens by logging in or creating an account. Access tokens must be included in the Authorization header of each request to protected endpoints.

## Endpoints

The API for Playrr provides several endpoints for interacting with the sports app's backend. All of these endpoints are fully documented in the Swagger documentation which can be accessed at `<URL>/api`.


## Error Handling

The API returns error responses with appropriate HTTP status codes and error messages. Errors are handled consistently across all endpoints.


## Deployment

The API can be deployed to a production environment using a range of tools and technologies. Detailed instructions for deployment are beyond the scope of this README file.

## Testing

To test the API, you can use tools like Postman to send requests and inspect responses. Sample requests and responses are provided in the API reference.

## Contact

If you have any questions or encounter any issues with the API, please contact the developers or maintainers of the sports app.