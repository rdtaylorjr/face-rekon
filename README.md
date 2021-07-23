# Face-Rekon

Facial Recognition for Mobile Payments

A cross-platform iOS and Android app for accepting Stripe payments with liveness detection and facial recognition. Written for TCS Paceport Retail Applications using React Native, Expo, Stripe, and AWS Rekognition

## Instructions for Installing and Running the App

1. Clone the face-rekon repository to your local machine
2. Install the Expo command line interface by typing `npm install -g expo-cli` in the terminal
3. Download and install Expo Go from the app store on your mobile phone
4. Navigate in your terminal to the folder where you cloned the repository
5. Run the command `expo start`
6. Your browser will open and display a QR code. Scan the code with your mobile phone
7. Face-Rekon will run inside Expo Go on your mobile phone

## Instructions for Using the App

#### Registering Faces
1. From the Home screen click 'Register Face' to register your face to make a new payment
2. Enter the administrator username 'Admin' and password 'Admin123'
3. Enter a username for the face you want to register. Usernames must not contain spaces or special characters.
4. The following screen will capture your image automatically once your face is fully contained within the circle.
5. A Confirmation screen will appear confirming that your face was registered successfully.

#### Making Payments
1. From the Home screen click 'Make Payment' to pake a new payment
2. Enter a payment amount in US Dollars. Foreign currencies will be supported in future versions.
3. Tap 'Payment Method' to select a new payment method. Credit or debit cards are currently accepted. Additional payment methods will be available in future versions. 
4. Tap 'Proceed'
5. Select whether to validate your payment using 'Face Recognition' or your device's built-in 'Touch ID'. Facial recognition does not require any additonal biometric sensors.
6. If you selected 'Touch ID', use your fingerprint scanner to validate your identity.
7. If you selected 'Face Recognition' the following screen will guide you through a series of steps for liveness detection. Make sure your face is fully visible within the circle and follow the instructions.
8. Once validated, a Confirmation Screen will appear confirming that your face was registered successfully.

## Design Document
## Retail Lab POC Project
Use Case 1: Face-based Identification for Payments\

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
