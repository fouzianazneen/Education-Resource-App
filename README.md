## Education-Resource-App
** Overview
The Education-Resource-App is a Full-Stack web application designed to serve as a comprehensive platform for managing educational resources. It facilitates educators in uploading, organizing, sharing, and managing various types of educational materials, while students can browse, search, and download these resources based on their academic needs.

## Key Features
** User Authentication: Secure registration and login for both educators and students, ensuring authenticated access to the platform.

** Educator Dashboard: A dedicated space for educators to manage their profiles, upload educational resources, categorize them by subject, branch, and semester, and add 
   descriptions and tags for easy organization and searchability.

** Student Interface: Students can browse educational resources, filter by subject, branch, and semester, view resource details, and download relevant materials.

** Role-based Access: Differentiated permissions where educators can upload, edit, and manage resources, while students can view and download resources.

** Database Management: Effective utilization of MongoDB for storing and retrieving educational resource metadata, ensuring efficient data handling.

## Technologies Used
* Backend: Node.js, Express.js
* Database: MongoDB
* Authentication: Session-based authentication for secure user login and management.
* File Upload: Multer for handling file uploads.

## Getting Started
1. Clone the Repository:
```
git clone https://github.com/yourusername/Education_Resource-App.git
cd Education_Resource-App

```
2. Install Dependencies:
```
npm install

```
3.Set Up Environment Variables:
```
PORT=your_port_number
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```
4.Run the Application:
```
npm run dev
