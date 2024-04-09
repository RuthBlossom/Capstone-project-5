**Book Review Management System**

The Book Review Management System is a web application designed to facilitate the management and review of books. It provides users with a platform to search for books, add reviews, update existing reviews, and delete books from the system. The application leverages Node.js, Express.js, PostgreSQL, and HTML forms to create a seamless user experience.

**Features:**

1. **Search Functionality:** Users can search for books by entering the book's title, author, or ISBN in the search bar. The application fetches book data from the Open Library API and displays relevant results in a dropdown list.

2. **Debouncing Input:** To prevent multiple fetch requests per input, the application uses a debounce function to handle input events. This ensures efficient handling of user input without overwhelming the server with unnecessary requests.

3. **Dynamic Dropdown List:** As users type in the search bar, the application dynamically updates the dropdown list with book suggestions based on the search term. Each suggestion includes the book's title, author, and cover image.

4. **Adding and Updating Reviews:** Users can add new reviews or update existing reviews for books. The application provides a user-friendly interface for users to write reviews, select ratings, and submit their feedback.

5. **Sorting Books:** Users can sort the list of books by title, author, or rating using the sorting functionality provided in the application. This allows users to easily find books of interest based on their preferences.

6. **CRUD Operations:** The application supports CRUD (Create, Read, Update, Delete) operations for managing books and their reviews. Users can add new books, update existing reviews, delete books, and view books sorted by various criteria.

**How to Use:**

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Set up environment variables for database configuration (DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT).
4. Start the server using `npm start`.
5. Access the application in your web browser at `http://localhost:3000`.

**Technologies Used:**

- Node.js
- Express.js
- PostgreSQL
- HTML
- CSS
- JavaScript


**Acknowledgments:**

Special thanks to the creators of Node.js, Express.js, PostgreSQL, and other open-source technologies used in this project.
