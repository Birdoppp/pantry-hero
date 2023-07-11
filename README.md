# Pantry Hero application

![Pantry page screenshot.png](src%2Fassets%2FPantry%20page%20screenshot.png)

An application that allows a user to gain insight in their pantry and the expiry status of ingredients.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Description

This is an application that is meant to give a user insight into his or her pantry. They can choose to add items manually in the dashboard, or select one of the suggestions the API gives the user to get more detailed information of the selected ingredient. In the dashboard the user also receives live information about the expiry status of their pantry items.

The user also has the option to manage their shopping list within this application, they can add items directly from their pantry to the shopping list, or add them manually in the dashboard. Here too the API will suggest items, picking one of these will provide the application with a more detailed item.

Finally the application will make recipe suggestions to the user based on ingredients available in the pantry. The application will prioritize ingredients that are about to expire for the selection of these recipes. The user can however influence these suggestions with the parameters provided in the dashboard. If none of the suggestions are to the user's liking they can re-apply the parameters in the dashboard and receive a new selection for as long as there are API requests available, or they can search for their desired dish directly using the searchbar.

When the user has found a recipe they like, they can add it to their selection, which will be shown in the "My recipes" page. On this page the user will also receive information on whether they have all ingredients to cook their chosen recipes available, or if a shopping trip is still needed.

## Features

* **See your pantry in one simple overview**
* **Keep track of expiry**
* **Find recipes that fit your tastes**
* **Easily manage your shopping list**

## Installation

This application makes use of several dependencies, in order to make sure these all install correctly run the following command before starting the application:
```npm install```

To make use of the API the user will have to get their own API key, this API key can be gotten by visiting [Spoonacular](https://spoonacular.com/food-api/console#Dashboard) and creating an account, with the account you receive your own API key and 150 free points to use per day. (*Teachers reviewing this assignment can make use of my personal API KEY: ```850e550630214c8fb9f11f5a1db10196```*)

To start using the API key follow these steps:
1. Create a new file in the "pantry-hero-app" folder and name it ```.env``` (*note: this file should be at the same level as the ```.env.dist``` file* )
2. Copy the contents of ```.env.dist``` and paste it in your newly created ```.env``` file.
3. Copy your personal API key from the Spoonacular dashboard, and paste it directly behind the "REACT_APP_API_KEY=" variable.
4. You are now ready to use the Pantry Hero Application.

## Usage

In order to start using the application you can use the following command: ```npm start``` 

To access the application you will first need to register a user account, you will be informed if the user registration was successful. If the registration was successful you can use your credentials to start using the application.
these credentials will only exist in the backend for 24h but the pantry will be stored locally and is not directly connected to a user account yet.

