## Bislerium Blogs

## Overview

In our group coursework for Bislerium PVT. LTD.'s blogging platform, we're tasked with developing a web application that embodies the future of digital interaction within their social media ecosystem. With strict requirements for an enterprise-level framework, our goal is to deliver a robust and scalable solution aligned with Bislerium's vision. The application caters to two primary user categories: bloggers and admins, with authorized access to all features. Additionally, "surfers" can browse and read blogs without authentication. Key features include self-registration, advanced sorting options, community-driven reactions and comments, and push notifications for authors. Administrators gain access to comprehensive usage metrics and rankings for strategic decision-making.s

## Installation Steps
### Prerequisites
Before the configuration of .Net Web API Project, we have to confirm installation of following:

- .NET Core SDK (version 3.1 or higher)
- Visual Studio
- Database (e.g., SQLite, MySQL)

## Clone the Repository


git clone https://github.com/notniraj/Bislerium-Blogs
cd Bislerium-Blogs


## Install Dependencies Backend
Run the command below in Package Manager Console to install the project dependencies defined.

dotnet restore


## Install Dependencies Frontend
Run the command below in Package Manager Console to install the project dependencies defined.

cd client
npm install



## Environmental Configuration

After cloning the Bislerium-Blogs project, copy the example environment configuration file and update it with your database credentials:

cp appsettings.example.json appsettings.json




## Database Setup

Create the database migration using Entity Framework Core migrations. This command is also to be executed in Package Manager Console:

add-Migration


Also, for database update run following command.

update-database



## Run the Application

Finally, start the DotNet development server.

dotnet build
dotnet run BisleriumCW.sln

## Acess the Application

dotnet: visit http://localhost:7212/ in your web browser, where you can access the application.
react: visit http://localhost:3000/ in your web browser, where you can access the application.

## Usage and Testing

### Key Features

- User Authentication: Users can self-register and log in, which allows them to post, respond, and comment on blogs.

- Content Discovery: Advanced sorting options including random, popularity, and recency improve the browsing experience for consumers.

- Community Engagement: Users can reply to and comment on blogs, which promotes interaction and community building on the platform.

- Analytics: Administrators can view usage analytics such as total and daily blog posts, reactions, and comments, as well as top posts and bloggers.

### Sample Data and Testing

The seeded data can be used as sample data to test the Chirper Application or new account can be created.

## Contributing and Issues

We welcome contributions!, Thank you for considering contributing to this Project. If you find a bug or have a feature request, please open an issue on the [GitHub repository](https://github.com/notniraj/Bislerium-Blogs.git/issues).

## License

The dotnet framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Contact Information

For support or inquiries, contact us at nirajkarkithapa@gmail.com