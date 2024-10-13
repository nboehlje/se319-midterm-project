SE 3190: Construction of User Interfaces  
Fall 2024  
Midterm Project Proposal  

# SE 3190 Midterm Project Proposal: Team #19  <!-- omit from toc --> 

- Nathanial Boehlje - nboehlje@iastate.edu
- Nathan Willimack - nawilli@iastate.edu
- 10/5/2024

## Table of Contents <!-- omit from toc --> 
- [1. Introduction](#1-introduction)
  - [1.1. About Nathanial Boehlje](#11-about-nathanial-boehlje)
  - [1.2. About Nathan Willimack](#12-about-nathan-willimack)
- [2. Purpose](#2-purpose)
- [3. Goals and Objectives](#3-goals-and-objectives)
  - [3.1. Goals](#31-goals)
  - [3.2. Objectives](#32-objectives)
- [4. Project](#4-project)
  - [4.1. Description](#41-description)
  - [4.2. Wireframes](#42-wireframes)
  - [4.3. Images](#43-images)
- [5. Resources](#5-resources)
- [6. Future Work](#6-future-work)
- [7. Final Comments](#7-final-comments)

## 1. Introduction

### 1.1. About Nathanial Boehlje

Nathanial is a sophomore in Software Engineering. He has professional experience developing web applications using technologies such as JavaScript, HTML, CSS and C# (.NET). 

More recently, his professional focus has shifted to backend infrastructure. This includes the design and development of Web APIs, cloud infrastructure, and IoT messaging systems.   

### 1.2. About Nathan Willimack

Nathan is a junior in Software Engineering, with a passion for frontend and game development. He has experience in building dynamic web applications using JavaScript, React, and CSS, and has worked on various projects involving user interface design and interactive features. Recently, Nathan has been expanding his skills into game development, focusing on building 2D browser-based games using modern frameworks.

## 2. Purpose

Trying to keep you mind stress-free while waiting for something personally significant to occur can be challenging, sometimes the most effective way to reduce stress is by engaging in a healthy distraction.

Simple, browser-based games can be an enjoyable way to spend time while sitting in a waiting room or attempting to clear you nerves before an important presentation. For example, waiting at the doctor's office or taking a small break right before you deliver a stressful update on your project at work. 

## 3. Goals and Objectives

### 3.1. Goals

1. To develop an entertaining browser game that will provide a small (non-addictive) distraction to players. I.e. provide a small dose of joy to ease the mind before a potentially stressful event.

2. The game should be interactive and simple. It should also support player personalization and recognition of achievement.

### 3.2. Objectives

1. Develop an interactive space travel game where the user provides input through their keyboard to direct a spaceship through a field of asteroids.
    1. Users will navigate their ship by pressing the right and left arrow keys.
    2. Users can shoot at the asteroids to destroy them, by pressing the space key.
    3. The game ends when the ship is struck by an asteroid OR 5 minutes has elapsed.

2. Develop personalized player experience.
    1. Allow users to create a custom user profile and upload a photo of themselves on a "profile" page.

3. Develop a leader-board page where users can view their 10 highest scores. (Recognition of player achievement)

4. Develop 4 web pages:
    1. A main/central page with information about the game and links to the 3 other pages.
    2. The game surface page, where the user plays the game. 
    3. A profile page where the user can view and edit their profile information.
    4. A leaderboard page where users can view their top 10 highest scores. 

## 4. Project

### 4.1. Description
The game will be a "space invaders" style shooter where the user directs their ship with the right and left arrow keys, clearing the asteroids from the ship's path.

### 4.2. Wireframes
Home Page:
This page will provide information about the game and links to the other pages (game surface, profile, leaderboard). It will also have a brief introduction about the game and a "Start Game" button.
Example:
```
+--------------------------------------+
|       2D Pixel Shooter               |
+--------------------------------------+
| [Start Game] [Profile] [Leaderboard] |
+--------------------------------------+
|       Welcome to the 2D              |
|     Pixel Shooter Game!              |
|    Navigate your spaceship           |
|   and destroy the asteroids!         |
+--------------------------------------+
```
Game play Page:
The core gameplay area, where users will control their spaceship, shoot asteroids, and track their score and time. The page will also show player health status at the top.
Example:
```
+------------------------------------+
| Player Health: 100 | Time: 00:00   |
+------------------------------------+
|                                    |
|                                    |
|         [Spaceship]                |
|                                    |
|         *Asteroids*                |
|                                    |
+------------------------------------+
```
Profile Page:
This page will allow users to create and update their profiles, including uploading a profile picture. There will be fields for the username and a button to save changes.
Example:
```
+-----------------------------+
|         Profile Page        |
+-----------------------------+
|  [Profile Picture]          |
|  [Upload New Picture]       |
|                             |
|  Username: [______]         |
|                             |
|  [Save Changes]             |
+-----------------------------+
```
Leaderboard Page:
The leaderboard page will display the top 10 highest scores, showing the player's username and their score.
Example:
```
+-----------------------------+
|        Leaderboard          |
+-----------------------------+
|  1. Username1 - Score1      |
|  2. Username2 - Score2      |
|  3. Username3 - Score3      |
|  ...                        |
|  10. Username10 - Score10   |
+-----------------------------+
```
### 4.3. Images
We have an images folder inside the project. The images so far are named accourdingly to it's purpose. Background is going to be the background, meteor is going to be the meteor, and the spaceship is going to be the player.
## 5. Resources
The development of this project will primarily rely on the following resources and organization:
Time Allocation:
Each team member will dedicate approximately 8-10 hours to the project. This time will be distributed across coding, debugging, design work, and testing.
We will be communicating through text, discord, and microsoft teams. We also meet after our morning class and our noon class. During this time, we will review progress, discuss challenges, and assign new tasks to ensure steady progress.
Developers:
The project will be developed by two team members: Nathanial Boehlje and Nathan Willimack. We are dividing the work evening amongst each other. As of right now, Nathaniel will focus on the user interface design and Nathan will focus on game logic and mechanics.
Tools and Software:
Software: We will use a combination of open-source and free tools, including:
Visual Studio Code as the primary IDE for development.
Phaser.js for game development and React.js for creating the website.
GitHub for version control and collaboration.
Figma for wireframing and UI design.
Organization and Communication:
Task Management: We will use GitHub to track development tasks and milestones, ensuring all components of the project are on schedule.
Collaboration: Regular communication will be maintained through Discord like stated before, for quick coordination, along with meetings after class for more in-depth discussions and problem-solving.
Budget:
No additional funds are required for this project since we are using personal computers and free or open-source tools. The primary investment is time and effort.  
## 6. Future Work
We’re considering expanding this project into a platform with multiple games that users can choose from. Players would be able to log in, track their progress, and view leaderboards to see how they rank against others. It would also save their game data, so they can pick up where they left off and compare their scores with friends.
## 7. Final Comments
We believe this project will be an excellent opportunity to practice both front-end web development and game development. Our goal is to deliver a polished, enjoyable game that meets the requirements for this course while challenging ourselves to explore new technologies and game mechanics.