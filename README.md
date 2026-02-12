# ConnectKind – Community Skill & Resource Exchange Web Application

This project provides a web-based community platform that enables users to share skills and resources locally without monetary transactions. The application allows users to register, create profiles, post listings, search for resources, and communicate instantly through real-time chat.  
The backend is implemented using Firebase services including Authentication, Firestore, and Hosting.

## Architecture Diagram

![Architecture Diagram](architecture.png)

## Components

### Frontend

- index.html  
- login.html  
- profile.html  
- add-listing.html  
- search.html  
- chat.html  
- CSS styling files  
- JavaScript logic files  

Provides:
- User interface for registration and login  
- Profile creation and editing  
- Skill/resource listing creation  
- Search functionality  
- Real-time chat interface  
- Client-side form validation  



### Backend (Serverless – Firebase)

- **Firebase Authentication**  
  Handles secure user registration and login.

- **Firebase Firestore**  
  Stores user profiles, skill/resource listings, and chat messages.  
  Provides real-time data synchronization.

- **Firebase Hosting**  
  Hosts and deploys the web application securely.


## Usage

1. Open the Live Demo link.  
2. Register or log in with your email and password.  
3. Create or update your profile.  
4. Add a skill or resource listing.  
5. Search for available listings.  
6. Start real-time chat with listing owners.  

## File Overview

- serverless-web/index.html – Main landing page  
- login.html – User authentication page  
- profile.html – Profile management  
- add-listing.html – Add skill/resource listing  
- search.html – Search functionality  
- chat.html – Real-time chat interface  
- *.js – Firebase integration and application logic  
- *.css – Styling files  
- architecture.png – System architecture diagram  

## Deployment

The application is deployed using Firebase Hosting.

Live URL:  
https://communityexchange-a9cb5.web.app  

Test commit from [vaishnavi-malireddy]



##  Team Members

ConnectKind was developed as a collaborative academic project by:

- Kavya – Frontend Development & Firebase Integration
- Harika– UI Design & Real-Time Chat Implementation
- Vaishnavi – Database Structure & Testing

All members contributed equally to the overall development and implementation of the project.

## Notes

- The application follows a serverless architecture using Firebase.  
- No dedicated backend server is maintained.  
- Designed primarily for academic and learning purposes.  



