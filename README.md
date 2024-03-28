# Tech Blog

## Description

The Tech Blog is a Content Management System (CMS)-style blog site tailored for developers to publish articles, blog posts, and share their thoughts and opinions on technical concepts, recent advancements, and new technologies. Built from scratch and deployed to Heroku, this application follows the Model-View-Controller (MVC) paradigm in its architectural structure. Handlebars.js is utilized as the templating language, Sequelize as the ORM, and express-session npm package for authentication.

### Motivation

The Tech Blog project aims to provide a platform where developers can not only focus on coding but also on sharing their knowledge and engaging with the developer community through meaningful blog posts and discussions.

### Problem Solved

By creating the Tech Blog, developers can overcome the challenge of finding a suitable platform to publish their articles and blog posts. This application empowers developers to contribute to the tech community by sharing their insights and experiences.

### Key Features

- User authentication and authorization for secure access to the platform.
- Seamless navigation between homepage, dashboard, and individual blog posts.
- Ability to create, read, update, and delete (CRUD) blog posts.
- Commenting system to foster discussions and interactions among users.
- Elegant and intuitive user interface designed for optimal user experience.

## Getting Started

To set up the Tech Blog on your local machine, follow these steps:

1. Clone the repository:

```bash
git clone <repository_url>

```

2. Navigate to the project directory:

```bash
cd tech-blog

```

3. Install dependencies:

```bash
npm install

```


4. Set up environment variables:
- Create a `.env` file in the project root.
- Add the following variables to the `.env` file:
  ```
  DB_NAME=your_database_name
  DB_USER=your_mysql_username
  DB_PASSWORD=your_mysql_password
  ```

5. Initialize the database:
- Use `schema.sql` in the `db` folder to create the database using MySQL shell commands.

6. Start the server:

```bash
npm start

```

7. Seed the database (optional):

```bash
npm run seed

```

## Usage

The Tech Blog is a CMS-style blog site where developers can:
- Publish articles, blog posts, and thoughts on tech topics.
- Navigate seamlessly between homepage, dashboard, and individual blog posts.
- Interact with other users by leaving comments on blog posts.
- Create, update, and delete their own blog posts.

## Demo

Check out the application functionality in action:

[![Demo of the Application](demo.gif)](https://example.com)

## Credits

### Documentation

- [Handlebars.js](https://handlebarsjs.com/)
- [Sequelize](https://sequelize.org/)
- [Express](https://expressjs.com/)

### Dependencies

- [Sequelize](https://www.npmjs.com/package/sequelize)
- [MySQL2](https://www.npmjs.com/package/mysql2)
- [dotenv](https://www.npmjs.com/package/dotenv)

## License

Please refer to the license in the repository.
