# Face-Rekon

Facial Recognition for Mobile Payments

A cross-platform iOS and Android app with liveness detection and facial recognition. Written using React Native and AWS Rekognition

## Retail Lab POC Project
Use Case 1: Face-based Identification for Payments\
Design Document

## App Name:
FacePayment

## Developers:
Immanuel Joseph Antony\
Russell Taylor

## Technologies:
This mobile app will be written using React Native. React Native is a cross-platform technology, so the app will run on both Android and iOS mobile phones. The app will use the Amazon AWS Rekognition API in order to register and verify faces.

## Design:
The project requirements in the Use Case Manual outline a basic application with two distinct flows and six distinct views. These views are illustrated in the following diagram:

### Face Verification Flow:

#### View 1: Home Screen

The Home screen will have a field to enter the payment amount and a button to proceed. The button to proceed will navigate to the image capture screen (View 2). Additionally there will be an option on the home screen to navigate to the admin screen (View 4).

#### View 2: Image Capture Screen

Once the proceed button is clicked, a camera window will open to complete face verification.

#### View 3: Payment Status Screen

Once the face is detected the camera window will close and redirect to next screen which is the payment status screen. The payment status screen will display the status message (success/failure) and provide an a navigation button to return to the home screen (View 1).

### Face Registration Flow:

#### View 4: Admin Screen

The admin mode will allow the user to select and train a specific face for detection. This screen will provide navigation options to return to the home screen (View 1) or train a face (View 5).

#### View 5: Image Capture Screen

Once the train a face button is clicked, a camera window will open to complete face registration.

#### View 6: Training Status Screen

Once the face is detected the camera window will close and redirect to next screen which is the training status screen. The training status screen will display the status message (success/failure) and provide an a navigation button to return to the admin screen (View 4).
