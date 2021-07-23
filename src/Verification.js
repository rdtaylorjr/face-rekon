import React, { useState } from 'react'
import * as FaceDetector from 'expo-face-detector'
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native'
import { Camera } from 'expo-camera'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import MaskedView from '@react-native-community/masked-view'
import Amplify, { API } from 'aws-amplify'

Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'face-payment',
        endpoint: 'https://bhwt4vsv86.execute-api.us-east-2.amazonaws.com/face-payment'
      }
    ]
  }
})

const { width: windowWidth } = Dimensions.get('window')

const PREVIEW_SIZE = 325
const PREVIEW_RECT = {
  minX: (windowWidth - PREVIEW_SIZE) / 2,
  minY: 50,
  width: PREVIEW_SIZE,
  height: PREVIEW_SIZE
}

const instructionsText = {
  initialPrompt: 'Position your face in the circle',
  performActions: 'Keep the device still and perform\nthe following actions:',
  tooClose: 'You\'re too close. Hold the device further.'
}

const detections = {
  BLINK: { instruction: 'Blink both eyes', minProbability: 0.3 },
  TURN_HEAD_LEFT: { instruction: 'Turn head left', maxAngle: -15 },
  TURN_HEAD_RIGHT: { instruction: 'Turn head right', minAngle: 15 },
  NOD: { instruction: 'Nod', minDiff: 1.5 },
  SMILE: { instruction: 'Smile', minProbability: 0.7 }
}

const detectionsList = [
  'BLINK',
  'TURN_HEAD_LEFT',
  'TURN_HEAD_RIGHT',
  'NOD',
  'SMILE'
]

const initialState = {
  faceDetected: 'no',
  faceTooBig: 'no',
  detectionsList,
  currentDetectionIndex: 0,
  progressFill: 0,
  processComplete: false
}

const detectionReducer = (state, action) => {
  switch (action.type) {
    case 'FACE_DETECTED':
      if (action.payload === 'yes') {
        return {
          ...state,
          faceDetected: action.payload,
          progressFill: 100 / (state.detectionsList.length + 1)
        }
      }
      else {
        return initialState
      }

    case 'FACE_TOO_BIG':
      return { ...state, faceTooBig: action.payload }

    case 'NEXT_DETECTION':
      const nextDetectionIndex = state.currentDetectionIndex + 1

      const progressMultiplier = nextDetectionIndex + 1

      const newProgressFill =
        (100 / (state.detectionsList.length + 1)) * progressMultiplier

      if (nextDetectionIndex === state.detectionsList.length)
        return { ...state, processComplete: true, progressFill: newProgressFill }
      else
        return { ...state, currentDetectionIndex: nextDetectionIndex, progressFill: newProgressFill }

    default:
      throw new Error('Unexpected action type.')
  }
}

export default function Verification({ navigation, route }) {

  const [hasPermission, setHasPermission] = React.useState(false)
  const [state, dispatch] = React.useReducer(detectionReducer, initialState)
  const rollAngles = React.useRef([])
  const [cameraRef, setCameraRef] = useState(null)

  React.useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }
    requestPermissions()
  }, [])

  const onFacesDetected = (result) => {
    if (result.faces.length !== 1) {
      dispatch({ type: 'FACE_DETECTED', payload: 'no' })
      return
    }

    const face = result.faces[0]
    const faceRect = {
      minX: face.bounds.origin.x,
      minY: face.bounds.origin.y,
      width: face.bounds.size.width,
      height: face.bounds.size.height
    }

    const edgeOffset = 50
    const faceRectSmaller = {
      width: faceRect.width - edgeOffset,
      height: faceRect.height - edgeOffset,
      minY: faceRect.minY + edgeOffset / 2,
      minX: faceRect.minX + edgeOffset / 2
    }

    const contains = ({ outside, inside }) => {
      const outsideMaxX = outside.minX + outside.width
      const insideMaxX = inside.minX + inside.width

      const outsideMaxY = outside.minY + outside.height
      const insideMaxY = inside.minY + inside.height

      if (inside.minX < outside.minX || insideMaxX > outsideMaxX || inside.minY < outside.minY || insideMaxY > outsideMaxY)
        return false
      else
        return true
    }

    const previewContainsFace = contains({
      outside: PREVIEW_RECT,
      inside: faceRectSmaller
    })

    if (!previewContainsFace) {
      dispatch({ type: 'FACE_DETECTED', payload: 'no' })
      return
    }

    if (state.faceDetected === 'no') {
      const faceMaxSize = PREVIEW_SIZE - 90
      if (faceRect.width >= faceMaxSize && faceRect.height >= faceMaxSize) {
        dispatch({ type: 'FACE_TOO_BIG', payload: 'yes' })
        return
      }

      if (state.faceTooBig === 'yes') {
        dispatch({ type: 'FACE_TOO_BIG', payload: 'no' })
      }
    }

    if (state.faceDetected === "no") {
      dispatch({ type: 'FACE_DETECTED', payload: 'yes' })
    }

    const detectionAction = state.detectionsList[state.currentDetectionIndex]

    switch (detectionAction) {
      case 'BLINK':
        const leftEyeClosed =
          face.leftEyeOpenProbability <= detections.BLINK.minProbability
        const rightEyeClosed =
          face.rightEyeOpenProbability <= detections.BLINK.minProbability
        if (leftEyeClosed && rightEyeClosed)
          dispatch({ type: 'NEXT_DETECTION', payload: null })
        return

      case 'NOD':
        rollAngles.current.push(face.rollAngle)

        if (rollAngles.current.length > 10)
          rollAngles.current.shift()

        if (rollAngles.current.length < 10)
          return

        const rollAnglesExceptCurrent = [...rollAngles.current].splice(0, rollAngles.current.length - 1)

        const rollAnglesSum = rollAnglesExceptCurrent.reduce((prev, curr) => {
          return prev + Math.abs(curr)
        }, 0)

        const avgAngle = rollAnglesSum / rollAnglesExceptCurrent.length

        const diff = Math.abs(avgAngle - Math.abs(face.rollAngle))

        if (diff >= detections.NOD.minDiff)
          dispatch({ type: 'NEXT_DETECTION', payload: null })
        return

      case 'TURN_HEAD_LEFT':
        if (face.yawAngle <= detections.TURN_HEAD_LEFT.maxAngle)
          dispatch({ type: 'NEXT_DETECTION', payload: null })
        return

      case 'TURN_HEAD_RIGHT':
        if (face.yawAngle >= detections.TURN_HEAD_RIGHT.minAngle)
          dispatch({ type: 'NEXT_DETECTION', payload: null })
        return

      case 'SMILE':
        if (face.smilingProbability >= detections.SMILE.minProbability)
          dispatch({ type: 'NEXT_DETECTION', payload: null })
        return
    }
  }

  const verifyFace = (photo) => {
    const apiName = 'face-payment'
    const path = '/verify'

    const init = {
      headers: {
        "Accept": "application/json",
        "X-Amz-Target": "RekognitionService.SearchFacesByImage",
        "Content-Type": "application/x-amz-json-1.1"
      },
      body: JSON.stringify({
        name: '',
        Image: photo.base64
      })
    }

    API.post(apiName, path, init).then(response => {
      if (response.errorMessage) {
        throw response.errorMessage
      }
      const parsed = JSON.parse(response.body)

      if (JSON.stringify(parsed.FaceMatches.length) == 0) {
        navigation.navigate('Confirmation', {
          type: 'failed'
        })
      }
      else if (route.params.error) {
        navigation.navigate('Confirmation', {
          paymentAmount: route.params.paymentAmount,
          paymentMethod: route.params.paymentMethod,
          error: route.params.error,
          type: 'declined'
        })
      }
      else {
        navigation.navigate('Confirmation', {
          paymentAmount: route.params.paymentAmount,
          paymentMethod: route.params.paymentMethod,
          username: parsed.FaceMatches[0].Face.ExternalImageId,
          type: 'payment'
        })
      }
    }).catch(error => {
      Alert.alert('Error', error)
      navigation.navigate('Home')
    })
  }

  const captureImage = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync({ base64: true })
      verifyFace(photo)
    }
    else {
      navigation.navigate('Verification', {
        paymentAmount: route.params.paymentAmount,
        paymentMethod: route.params.paymentMethod,
        error: route.params.error
      })
    }
  }

  React.useEffect(() => {
    if (state.processComplete) {
      captureImage()
    }
  }, [state.processComplete])

  if (hasPermission === false) {
    return <Text style={{ textAlign: "center", marginTop: 100 }}>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={<View style={styles.mask} />}
      >
        <Camera
          style={StyleSheet.absoluteFill}
          type={Camera.Constants.Type.front}
          onFacesDetected={onFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.Constants.Mode.fast,
            detectLandmarks: FaceDetector.Constants.Landmarks.none,
            runClassifications: FaceDetector.Constants.Classifications.all,
            minDetectionInterval: 125,
            tracking: false
          }}
          ref={ref => { setCameraRef(ref) }}
        >
          <AnimatedCircularProgress
            style={styles.circularProgress}
            size={PREVIEW_SIZE}
            width={5}
            backgroundWidth={7}
            fill={state.progressFill}
            tintColor="#009688"
            backgroundColor="#e8e8e8"
          />
        </Camera>
      </MaskedView>
      <View style={styles.instructionsContainer}>
        {!state.processComplete &&
          <Text style={styles.instructions}>
            {state.faceDetected === "no" &&
              state.faceTooBig === "no" &&
              instructionsText.initialPrompt}

            {state.faceTooBig === "yes" &&
              instructionsText.tooClose}

            {state.faceDetected === "yes" &&
              state.faceTooBig === "no" &&
              instructionsText.performActions}
          </Text>
        }
        {!state.processComplete &&
          <Text style={styles.action}>
            {state.faceDetected === "yes" &&
              state.faceTooBig === "no" &&
              detections[state.detectionsList[state.currentDetectionIndex]]
                .instruction}
          </Text>
        }
        {state.processComplete &&
          <Text style={styles.processing}>
            Processing payment...
          </Text>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mask: {
    borderRadius: PREVIEW_SIZE / 2,
    height: PREVIEW_SIZE,
    width: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    alignSelf: "center",
    backgroundColor: "white"
  },
  circularProgress: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    marginLeft: PREVIEW_RECT.minX
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: PREVIEW_RECT.minY + PREVIEW_SIZE
  },
  instructions: {
    fontSize: 20,
    textAlign: "center",
    position: "absolute",
    top: 15
  },
  action: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    position: "absolute",
    top: 70
  },
  processing: {
    fontSize: 24,
    textAlign: "center",
    // fontWeight: "bold",
    position: "absolute",
    top: 25
  }
})
