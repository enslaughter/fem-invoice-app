# Invoice App
This project is a simple invoice management app derived from the Frontend Mentor challenge. It is constructed in React with Typescript and SASS. 

## UI Features

* Responsive Design for a large range of devices
* Theme switching (Light and Dark modes available)
* Various modals for forms, confirmations, and invoice filtering
* Error messages for invalid form fields

## Code Features

* Pages are handled via react router
* Form validation is handled via regex
* Website loads preferred browser/system theme automatically
* Page information is loaded dynamically through JSON data

## My Notes

This project was a fun challenge for me to complete. This was my first real project that involved Typescript, which helped me recognize some errors in how I passed data in through my props/functions. I tried a new way of handling theme management and media queries by trying to organize them in an easier-to-manage way. This is my first attempt at a large-scale form validation so I'm happy with how it turned out, especially how I handled the price inputs. To avoid issues with mutation, I also coded my own cloning function for creating temporary copies of the invoice data for putting in the editing menu. 

Though it wasn't present in the final product, I did have a slightly more elaborate routing structure where a link to /(invoiceID)/edit would lead to a page for editing the invoice. Eventually this was turned into a large modal to better reflect the intended design. There are other parts of the project that I would like to clean up, such as a small issue with stacking order when the editing modal transitions, adding end-to-end testing, and breaking up the code into smaller, more easily readable pieces. I also intend to add in client-side storage at some point, as this is a serverless project.

### Credits
Initial design and images purchased from Frontend Mentor
